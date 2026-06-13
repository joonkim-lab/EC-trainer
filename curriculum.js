/* =====================================================================
 * 봇물 — 막혔던 영어가 쏟아지는 곳
 * 개발: coldwater1042
 *
 * 커리큘럼: 보편적인 영어 문법 습득 순서(뼈대 → 시제 → 조동사 → 수식 →
 *   구 → 연결 → 태/비교 → 절 → 가정법)에 따라 독자적으로 구성했다.
 *   핵심 교수 철학은 "뼈대 → 확장": '누가 한다(주어+동사)'를 먼저 세우고
 *   바깥으로 하나씩 붙여 나간다.
 *
 * 콘셉트(물길 여정): 마음 깊은 곳의 영어가 샘에서 솟아 물꼬가 트이고,
 *   강을 이뤄 흐르다, 마침내 봇물처럼 터져 바다(세상)에 가닿는다.
 *
 * 구조: LEVEL > CHAPTER > UNIT
 *   level.level     : 1~9
 *   level.stage     : 물길 단계 이름 (샘·물방울·물꼬·시냇물·여울·강·큰물·봇물·바다)
 *   level.title     : 그 레벨의 문법 한 줄
 *   level.theme     : 화면 테마 색 (밝은 샘물 → 깊은 바다)
 *   chapter.why     : "이건 왜 배우나" 한두 줄 (연습 전 노출)
 *   unit.id         : 진도 저장용 고유 키 (예: "L1-1-3")
 *   unit.title      : 유닛 제목
 *   unit.focus      : AI 출제·채점이 참고할 문법 초점 (한 줄)
 *   ※ 교재 예문(seeds)은 넣지 않는다. 모든 연습 문장은 AI가 새로 생성.
 * ===================================================================== */

const CURRICULUM = [

  /* ===================== LEVEL 1 · 샘 ===================== */
  {
    level: 1, stage: "샘", title: "누가 한다 — 문장의 뼈대",
    bookLabel: "샘 · 깊은 곳에서 솟다",
    tagline: "깊은 곳에서 첫 물이 솟듯, 주어와 동사부터",
    theme: { key: "spring", ink: "#2A5A7A", accent: "#4A90B8", soft: "#E8F2F8" },
    chapters: [{
      why: "영어는 아무리 긴 문장도 '누가 한다(주어+동사)'를 먼저 꺼내고, 나머지를 그 뒤에 하나씩 붙여요. 이 첫 물줄기가 모든 문장의 시작이에요.",
      units: [
        { id: "L1-1-1", title: "누가 + 한다", focus: "주어+동사만으로 짧은 문장 세우기(1형식 자동사)" },
        { id: "L1-1-2", title: "누가 + 이다 / 어떠하다", focus: "be동사 + 보어(형용사·명사)로 상태 말하기(2형식)" },
        { id: "L1-1-3", title: "누가 + 한다 + 무엇을", focus: "주어+동사+목적어(3형식)" },
        { id: "L1-1-4", title: "누가 + 준다 + 누구에게 + 무엇을", focus: "수여동사 4형식(give/send/tell 등)" },
        { id: "L1-1-5", title: "무엇을 + 어떤 상태로", focus: "목적격 보어로 대상을 설명(5형식)" },
        { id: "L1-1-6", title: "~이 있다 / ~가 있다", focus: "There is / There are 존재 표현" },
        { id: "L1-1-7", title: "~해 / ~하자", focus: "동사원형으로 시작하는 명령·권유문" }
      ]
    }]
  },

  /* ===================== LEVEL 2 · 물방울 ===================== */
  {
    level: 2, stage: "물방울", title: "시간을 표현하기 — 시제",
    bookLabel: "물방울 · 모이다",
    tagline: "물방울이 모이듯, '언제'의 감각을 쌓는다",
    theme: { key: "spring", ink: "#27576F", accent: "#4488AE", soft: "#E5F0F6" },
    chapters: [{
      why: "같은 일도 '언제'냐에 따라 동사 모양이 달라져요. 지금·지나간 일·앞으로 할 일을 구분해 쓰면, 작은 물방울들이 모여 또렷한 흐름이 됩니다.",
      units: [
        { id: "L2-1-1", title: "지금·늘 그렇다", focus: "현재형(일반적 사실·습관), 3인칭 단수 -s" },
        { id: "L2-1-2", title: "지나간 일", focus: "과거형(규칙·불규칙 동사)" },
        { id: "L2-1-3", title: "앞으로 할 일", focus: "미래 will / be going to" },
        { id: "L2-1-4", title: "지금 하는 중", focus: "현재진행(be + -ing)" },
        { id: "L2-1-5", title: "그때 하는 중이었다", focus: "과거진행" },
        { id: "L2-1-6", title: "늘 그런 일 vs 지금만 그런 일", focus: "현재형과 현재진행의 의미 구분" }
      ]
    }]
  },

  /* ===================== LEVEL 3 · 물꼬 ===================== */
  {
    level: 3, stage: "물꼬", title: "뜻을 더하기 — 조동사·부정·의문",
    bookLabel: "물꼬 · 트이다",
    tagline: "막힌 물꼬가 트이듯, 가능·의무·추측이 열린다",
    theme: { key: "stream", ink: "#245466", accent: "#3E80A4", soft: "#E2EEF4" },
    chapters: [{
      why: "조동사 하나면 같은 동사에 '할 수 있다·해야 한다·일지도 모른다'는 마음이 얹혀요. 부정과 질문도 여기서 트입니다. 막혔던 물꼬가 열리는 단계예요.",
      units: [
        { id: "L3-1-1", title: "할 수 있다", focus: "can / be able to (능력·가능)" },
        { id: "L3-1-2", title: "해야 한다", focus: "must / have to / should (의무·조언)" },
        { id: "L3-1-3", title: "일 것이다 · 일지도 모른다", focus: "will / may / might (추측의 강도)" },
        { id: "L3-1-4", title: "아니다 · 안 한다", focus: "부정문(do/does/did not, be동사·조동사 부정)" },
        { id: "L3-1-5", title: "그래? 맞아?", focus: "Yes/No 의문문(do/be/조동사 도치)" },
        { id: "L3-1-6", title: "누가 · 언제 · 왜", focus: "의문사 의문문(who/what/when/where/why/how)" }
      ]
    }]
  },

  /* ===================== LEVEL 4 · 시냇물 ===================== */
  {
    level: 4, stage: "시냇물", title: "살을 붙이기 — 수식어",
    bookLabel: "시냇물 · 자라다",
    tagline: "뼈대에 살이 붙어 시냇물처럼 자란다",
    theme: { key: "stream", ink: "#21505E", accent: "#388A8E", soft: "#E2F0EF" },
    chapters: [{
      why: "뼈대 문장에 꾸미는 말을 붙이면 문장이 살아나요. 명사를 꾸미고, 동사를 꾸미고, 어디서·언제·어떻게를 더하면 가는 물줄기가 시냇물로 자랍니다.",
      units: [
        { id: "L4-1-1", title: "어떤 명사 (명사 꾸미기)", focus: "형용사로 명사 앞 꾸미기" },
        { id: "L4-1-2", title: "어떻게 한다 (동사 꾸미기)", focus: "부사로 동사·형용사·문장 꾸미기" },
        { id: "L4-1-3", title: "어디서 · 언제 · 어떻게", focus: "전치사구(in/on/at/with/by 등)로 정보 더하기" },
        { id: "L4-1-4", title: "얼마나 · 몇 개", focus: "수량·정도 표현(many/much/a few/enough 등)" },
        { id: "L4-1-5", title: "꾸밈말 자연스레 잇기", focus: "여러 수식어의 자연스러운 어순" }
      ]
    }]
  },

  /* ===================== LEVEL 5 · 여울 ===================== */
  {
    level: 5, stage: "여울", title: "덩어리로 말하기 — 구·to부정사·동명사",
    bookLabel: "여울 · 덩어리로 흐르다",
    tagline: "여울에서 물이 덩어리로 흐르듯, 단어를 묶어 말한다",
    theme: { key: "river", ink: "#1E4C56", accent: "#33828A", soft: "#DFEDEC" },
    chapters: [{
      why: "한 단어로 안 되는 생각은 여러 단어를 한 덩어리로 묶어 말해요. 'to부정사'와 '동명사'는 동작을 명사처럼 다루게 해, 더 큰 생각을 한 자리에 담게 해줍니다.",
      units: [
        { id: "L5-1-1", title: "~하는 것 (to부정사·명사 역할)", focus: "to부정사를 주어·목적어·보어로" },
        { id: "L5-1-2", title: "~하기 위해", focus: "목적의 to부정사(부사적 용법)" },
        { id: "L5-1-3", title: "~할 / ~하는 (명사 꾸미는 to부정사)", focus: "to부정사의 형용사적 수식" },
        { id: "L5-1-4", title: "~하는 것 (동명사)", focus: "동명사를 주어·목적어로, 전치사 뒤 -ing" },
        { id: "L5-1-5", title: "긴 주어는 it에게 맡기기", focus: "가주어 it ~ to부정사 구문" }
      ]
    }]
  },

  /* ===================== LEVEL 6 · 강 ===================== */
  {
    level: 6, stage: "강", title: "문장을 잇기 — 접속·완료",
    bookLabel: "강 · 이어 흐르다",
    tagline: "시냇물이 모여 강이 되듯, 문장과 문장을 잇는다",
    theme: { key: "river", ink: "#1B4750", accent: "#2E7A86", soft: "#DCEAEA" },
    chapters: [{
      why: "생각이 하나로 끝나지 않을 때, 문장을 이어 흐르게 해요. '그리고·그러나·~때문에·~라는 것'으로 잇고, 완료시제로 과거와 지금을 연결하면 짧은 문장들이 강처럼 흐릅니다.",
      units: [
        { id: "L6-1-1", title: "그리고 · 그러나 · 그래서", focus: "등위접속사 and/but/or/so로 문장 잇기" },
        { id: "L6-1-2", title: "~때문에 · ~할 때 · ~하면", focus: "부사절 because/when/if/although" },
        { id: "L6-1-3", title: "~라는 것", focus: "명사절 that(생각·사실을 목적어로)" },
        { id: "L6-1-4", title: "해 왔다 · 해 본 적 있다", focus: "현재완료(경험·계속·완료)" },
        { id: "L6-1-5", title: "그전에 이미", focus: "과거완료(과거의 과거)" }
      ]
    }]
  },

  /* ===================== LEVEL 7 · 큰물 ===================== */
  {
    level: 7, stage: "큰물", title: "관점을 바꾸기 — 수동태·비교",
    bookLabel: "큰물 · 방향을 틀다",
    tagline: "큰물이 방향을 틀듯, 같은 일을 다른 관점에서",
    theme: { key: "tide", ink: "#1C3F5A", accent: "#2C5E86", soft: "#E0E8F2" },
    chapters: [{
      why: "누가 했는지보다 '무엇이 되었는지'가 중요할 때가 있어요. 수동태로 관점을 바꾸고, 비교로 둘 이상을 견주면 표현의 시야가 큰물처럼 넓어집니다.",
      units: [
        { id: "L7-1-1", title: "~되다 · ~당하다", focus: "수동태 기본(be + 과거분사)" },
        { id: "L7-1-2", title: "누구에 의해", focus: "수동태 + by, 행위자 표현" },
        { id: "L7-1-3", title: "더 ~한", focus: "비교급(-er / more ~)" },
        { id: "L7-1-4", title: "가장 ~한", focus: "최상급(-est / most ~)" },
        { id: "L7-1-5", title: "~만큼 ~한", focus: "원급 비교 as ~ as" }
      ]
    }]
  },

  /* ===================== LEVEL 8 · 봇물 ===================== */
  {
    level: 8, stage: "봇물", title: "문장 속 문장 — 관계사·분사구문",
    bookLabel: "봇물 · 터져 쏟아지다",
    tagline: "마침내 봇물이 터지듯, 두세 정보를 한 문장에",
    theme: { key: "tide", ink: "#193652", accent: "#27507E", soft: "#DDE5F0" },
    chapters: [{
      why: "막혀 있던 생각이 봇물처럼 터지는 단계예요. 관계사와 분사구문으로 두세 문장을 하나로 압축하면, 길고 자연스러운 문장이 한 번에 쏟아져 나옵니다.",
      units: [
        { id: "L8-1-1", title: "~하는 사람 / ~하는 것", focus: "관계대명사 who/which/that" },
        { id: "L8-1-2", title: "~하는 곳 / ~하는 때", focus: "관계부사 where/when/why" },
        { id: "L8-1-3", title: "콤마로 덧붙이기", focus: "관계사의 계속적 용법(부가 설명)" },
        { id: "L8-1-4", title: "~하면서 · ~한 채", focus: "분사구문(동시동작·이유·조건)" },
        { id: "L8-1-5", title: "두 문장을 한 문장으로", focus: "관계사·분사로 정보 압축하기" }
      ]
    }]
  },

  /* ===================== LEVEL 9 · 바다 ===================== */
  {
    level: 9, stage: "바다", title: "마음을 표현하기 — 가정법·공손·재구성",
    bookLabel: "바다 · 세상에 가닿다",
    tagline: "모든 물길이 바다에 가닿듯, 미묘한 마음까지 영어로",
    theme: { key: "ocean", ink: "#15293F", accent: "#22406E", soft: "#DCE3EE" },
    chapters: [{
      why: "이제 사실을 넘어 '마음'을 담을 차례예요. 가정·공손·완곡함을 다루고, 같은 뜻을 더 매끄럽게 다듬어 문장을 이으면, 내 안의 말이 마침내 세상에 가닿습니다.",
      units: [
        { id: "L9-1-1", title: "만약 ~라면", focus: "가정법 과거(현재 사실의 반대)" },
        { id: "L9-1-2", title: "그때 ~했더라면", focus: "가정법 과거완료(과거 사실의 반대)" },
        { id: "L9-1-3", title: "공손하게 부탁·제안", focus: "would/could/Would you mind ~?" },
        { id: "L9-1-4", title: "조심스럽게 · 완곡하게", focus: "might/I think/perhaps로 톤 누그러뜨리기" },
        { id: "L9-1-5", title: "같은 뜻 더 매끄럽게", focus: "어색한 문장을 자연스럽게 재구성" },
        { id: "L9-1-6", title: "내 생각을 한 문단으로", focus: "여러 문장을 이어 짧은 글로(마무리)" }
      ]
    }]
  }

];

const MAX_LEVEL = CURRICULUM.length; // 9

/* ---- 파생 데이터: 유닛 평탄화 (진도 계산용) ---- */
function flattenUnits(levelNum) {
  const lv = CURRICULUM.find(l => l.level === levelNum);
  if (!lv) return [];
  const out = [];
  lv.chapters.forEach((ch, ci) => {
    ch.units.forEach((u, ui) => {
      out.push({ ...u, chapterTitle: lv.title, chapterWhy: ch.why, part: ch.part || "", chapterIndex: ci, unitIndex: ui });
    });
  });
  return out;
}

/* =====================================================================
 * 승급·통과 기준점 (조정 가능)
 *   합격선은 위로 갈수록 살짝 높아진다.
 *     레벨 1~3 (기초): 유닛 70% · 승급시험 80%
 *     레벨 4~6 (확장): 유닛 75% · 승급시험 85%
 *     레벨 7~9 (도약): 유닛 80% · 승급시험 88%
 * ===================================================================== */
const RULES = {
  UNIT_SET_SIZE: 8,
  LEVELUP_SET_SIZE: 12,
  PLACEMENT_PASS: 70,
  PASS_SCORE: 70,
  UNIT_PASS_RATIO: 0.75,
  LEVELUP_PASS_RATIO: 0.85,
  MAX_LEVEL
};

function rulesFor(level) {
  let unit = 0.75, levelup = 0.85;
  if (level <= 3)      { unit = 0.70; levelup = 0.80; }
  else if (level >= 7) { unit = 0.80; levelup = 0.88; }
  return {
    UNIT_SET_SIZE: RULES.UNIT_SET_SIZE,
    LEVELUP_SET_SIZE: RULES.LEVELUP_SET_SIZE,
    PASS_SCORE: RULES.PASS_SCORE,
    UNIT_PASS_RATIO: unit,
    LEVELUP_PASS_RATIO: levelup
  };
}

if (typeof module !== "undefined") module.exports = { CURRICULUM, flattenUnits, RULES, rulesFor, MAX_LEVEL };
