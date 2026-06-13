/* =====================================================================
 * 영작 트레이너 — AI 프록시 (Firebase Cloud Functions, 2세대)
 *  - 배포된 웹앱이 Anthropic API를 '안전하게' 호출하도록 중계합니다.
 *  - API 키는 코드에 적지 않고 시크릿(ANTHROPIC_API_KEY)으로 보관됩니다.
 *
 *  엔드포인트 1개 (POST):
 *    { action: "grade",    ... }   문장 한 개 채점
 *    { action: "generate", ... }   유닛에 맞는 연습 문장 N개 출제
 *
 *  배포:  firebase deploy --only functions      (SETUP_Firebase.md 5단계)
 * ===================================================================== */

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");

// 채점/출제 품질을 높이려면 "claude-opus-4-8"로 바꿔도 됩니다(비용 ↑).
const MODEL = "claude-sonnet-4-6";

// ▼ 배포 후, 실제 웹앱 도메인으로 좁히는 것을 권장합니다.
//   (예: "https://yeongjak.example.com") 우선은 전체 허용으로 시작.
const ALLOW_ORIGIN = "*";

function setCors(res) {
  res.set("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");
}

async function callClaude(system, userText, maxTokens) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY.value(),
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens || 1024,
      system,
      messages: [{ role: "user", content: userText }]
    })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(data));
  const text = (data.content || [])
    .filter(b => b.type === "text").map(b => b.text).join("\n");
  // ```json 펜스 제거 후 첫 { ~ 마지막 } 파싱
  const cleaned = text.replace(/```json|```/g, "");
  const s = cleaned.indexOf("{");
  const e = cleaned.lastIndexOf("}");
  return JSON.parse(cleaned.slice(s, e + 1));
}

/* ---- 채점 시스템 프롬프트 (교육 철학 반영) ---- */
const GRADE_SYSTEM = `너는 한국 환경에서 자란 학생들의 영작을 봐 주는 따뜻하고 정확한 영어 선생님이다.

학생 정보: 한국어로 사고하고 번역기에 의존하기 쉬운 중·고등학생. CEFR B2 안팎.

채점 1순위 기준 (이 순서가 중요하다):
1) 뜻이 통하는가 (meaning)
2) 영어 어순이 맞는가 — 특히 '누가 한다(주어+서술어)'라는 뼈대가 먼저 서 있는가 (word order / skeleton)
3) 그 다음에야 문법·철자 (사소한 건 너그럽게)

반드시 지킬 것:
- 피드백은 한국어로, "한 번에 한 가지만" 짚어 준다. 잘못을 모두 나열하지 말 것.
- 기를 살리되 정확하게. 중학생도 이해할 쉬운 말로.
- 빈칸 채우기식으로 가르치지 말고, 학생이 스스로 다시 쓰게 이끈다.
- 정답이 한 개라고 단정하지 말 것. 자연스러운 다른 표현도 인정한다.

반드시 아래 JSON만 출력 (설명·인사·코드펜스 금지):
{
  "score": 0~100 정수,
  "pass": true 또는 false,        // score>=70 이면 true
  "meaningOk": true/false,
  "skeletonOk": true/false,        // 주어+서술어 뼈대가 바르게 섰는가
  "feedbackKo": "한국어로, 한 가지만 짚은 따뜻한 피드백 (2~3문장)",
  "betterAnswer": "더 자연스러운 영어 예시 한 문장",
  "skeleton": "이 문장의 뼈대를 영어로 (예: 'I run')"
}`;

/* ---- 출제 시스템 프롬프트 ---- */
const GEN_SYSTEM = `너는 한국 학생용 영작 연습 문제를 만드는 출제자다.
유은하 『영어로 문장 만들기 훈련』의 방식을 따른다: 한국어 문장을 주고 학생이 영어로 옮기게 한다.

반드시 지킬 것:
- 빈칸 채우기 금지. 실제로 그 또래(중·고등학생)가 할 법한 생각·일상을 소재로.
- 해당 '문법 초점'을 자연스럽게 연습하게 만든다.
- 난이도는 레벨에 맞춘다(1=기초, 2=중급, 3=고급 뉘앙스).
- 각 문항에 영작에 필요한 핵심 단어를 hint로 2~4개 준다(한국어 학생이 모를 만한 단어 위주).
- ref(모범답안)는 자연스러운 영어 한 문장.

반드시 아래 JSON만 출력 (설명·코드펜스 금지):
{ "items": [ { "ko": "한국어 문장", "hint": "단어 / 단어 / 단어", "ref": "English answer." }, ... ] }`;

exports.api = onRequest(
  { region: "asia-northeast3", secrets: [ANTHROPIC_API_KEY], cors: true },
  async (req, res) => {
    setCors(res);
    if (req.method === "OPTIONS") { res.status(204).send(""); return; }
    if (req.method !== "POST")    { res.status(405).json({ error: "POST only" }); return; }

    try {
      const body = req.body || {};
      const action = body.action;

      if (action === "grade") {
        const { korean, studentAnswer, focus, level } = body;
        const user =
          `레벨: ${level}\n` +
          `문법 초점: ${focus || "(없음)"}\n` +
          `한국어 문장: ${korean}\n` +
          `학생이 쓴 영어: ${studentAnswer}\n\n` +
          `위 기준으로 채점하고 JSON으로만 답하라.`;
        const out = await callClaude(GRADE_SYSTEM, user, 700);
        res.json(out);
        return;
      }

      if (action === "generate") {
        const { focus, level, count, avoid } = body;
        const user =
          `레벨: ${level}\n` +
          `문법 초점: ${focus}\n` +
          `만들 문항 수: ${count || 8}\n` +
          (avoid ? `이미 낸 문장(피하기): ${avoid}\n` : "") +
          `위 초점을 연습하는 한국어→영어 작문 문제를 만들어 JSON으로만 답하라.`;
        const out = await callClaude(GEN_SYSTEM, user, 1500);
        res.json(out);
        return;
      }

      res.status(400).json({ error: "unknown action" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: String(e.message || e) });
    }
  }
);
