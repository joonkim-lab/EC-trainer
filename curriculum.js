/* =====================================================================
 * 쌉가능 — 이제 영어, 쌉가능
 * 개발: coldwater1042
 *
 * 커리큘럼: 보편적인 영어 문법 습득 순서(뼈대 → 시제 → 조동사 → 수식 →
 *   구 → 연결 → 태/비교 → 절 → 가정법)에 따라 독자적으로 구성했다.
 *   핵심 교수 철학은 "뼈대 → 확장": '누가 한다(주어+동사)'를 먼저 세우고
 *   바깥으로 하나씩 붙여 나간다.
 *
 * 콘셉트: 레벨마다 "오늘 영어로 뭐가 쌉가능해졌는지"를 잠금 해제한다.
 *   문장 쌉가능 → 시간 쌉가능 → … → 만렙 '영어 쌉가능'.
 *
 * 구조: LEVEL > CHAPTER > UNIT
 *   level.level     : 1~9
 *   level.stage     : 그 레벨에서 새로 가능해지는 능력 (「~ 쌉가능」)
 *   level.title     : 그 레벨의 문법 한 줄
 *   level.theme     : 화면 테마 색 (밝은 인디고 → 마젠타 만렙)
 *   chapter.why     : "이건 왜 배우나" 한두 줄 (연습 전 노출)
 *   unit.id         : 진도 저장용 고유 키 (예: "L1-1-3")
 *   unit.title      : 유닛 제목
 *   unit.focus      : AI 출제·채점이 참고할 문법 초점 (한 줄)
 *   ※ 교재 예문(seeds)은 넣지 않는다. 모든 연습 문장은 AI가 새로 생성.
 * ===================================================================== */

const CURRICULUM = [

  /* ===================== LEVEL 1 · 문장 쌉가능 ===================== */
  {
    level: 1, stage: "문장 쌉가능", title: "누가 한다 — 문장의 뼈대",
    bookLabel: "이제 문장은 쌉가능",
    tagline: "누가 한다부터. 영어는 여기서 시작.",
    theme: { key: "lv1", ink: "#3A2E7A", accent: "#5B4BD6", soft: "#ECE9FB" },
    chapters: [{
      why: "영어는 아무리 긴 문장도 '누가 한다(주어+동사)'를 먼저 꺼내고, 나머지를 그 뒤에 하나씩 붙여요. 이 한 줄만 손에 익으면 영어 문장의 절반은 끝난 거예요.",
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

  /* ===================== LEVEL 2 · 시간 쌉가능 ===================== */
  {
    level: 2, stage: "시간 쌉가능", title: "시간을 표현하기 — 시제",
    bookLabel: "과거·현재·미래 쌉가능",
    tagline: "언제 일어난 일인지, 동사로 딱.",
    theme: { key: "lv2", ink: "#352B72", accent: "#6248D8", soft: "#EAE7FA" },
    chapters: [{
      why: "같은 일도 '언제'냐에 따라 동사 모양이 달라져요. 지금·지나간 일·앞으로 할 일만 구분해 써도 말이 훨씬 또렷해집니다.",
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

  /* ===================== LEVEL 3 · 질문·부정 쌉가능 ===================== */
  {
    level: 3, stage: "질문·부정 쌉가능", title: "뜻을 더하기 — 조동사·부정·의문",
    bookLabel: "묻고 답하기 쌉가능",
    tagline: "할 수 있다·해야 한다·아니다·진짜?",
    theme: { key: "lv3", ink: "#322969", accent: "#6A46DA", soft: "#E8E5F9" },
    chapters: [{
      why: "조동사 하나면 같은 동사에 '할 수 있다·해야 한다·일지도 몰라'는 마음이 얹혀요. 부정과 질문도 여기서 트입니다. 진짜 대화가 시작되는 단계예요.",
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

  /* ===================== LEVEL 4 · 꾸미기 쌉가능 ===================== */
  {
    level: 4, stage: "꾸미기 쌉가능", title: "살을 붙이기 — 수식어",
    bookLabel: "문장 꾸미기 쌉가능",
    tagline: "밋밋한 문장에 살 붙이기.",
    theme: { key: "lv4", ink: "#2E2660", accent: "#7244DC", soft: "#EDE8FA" },
    chapters: [{
      why: "뼈대 문장에 꾸미는 말을 붙이면 문장이 살아나요. 명사를 꾸미고, 동사를 꾸미고, 어디서·언제·어떻게를 더하면 짧던 문장이 풍성해집니다.",
      units: [
        { id: "L4-1-1", title: "어떤 명사 (명사 꾸미기)", focus: "형용사로 명사 앞 꾸미기" },
        { id: "L4-1-2", title: "어떻게 한다 (동사 꾸미기)", focus: "부사로 동사·형용사·문장 꾸미기" },
        { id: "L4-1-3", title: "어디서 · 언제 · 어떻게", focus: "전치사구(in/on/at/with/by 등)로 정보 더하기" },
        { id: "L4-1-4", title: "얼마나 · 몇 개", focus: "수량·정도 표현(many/much/a few/enough 등)" },
        { id: "L4-1-5", title: "꾸밈말 자연스레 잇기", focus: "여러 수식어의 자연스러운 어순" }
      ]
    }]
  },

  /* ===================== LEVEL 5 · 덩어리 쌉가능 ===================== */
  {
    level: 5, stage: "덩어리 쌉가능", title: "덩어리로 말하기 — 구·to부정사·동명사",
    bookLabel: "긴 덩어리 쌉가능",
    tagline: "여러 단어를 한 덩어리로 묶어서.",
    theme: { key: "lv5", ink: "#3A2566", accent: "#8341DC", soft: "#F0E8FA" },
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

  /* ===================== LEVEL 6 · 연결 쌉가능 ===================== */
  {
    level: 6, stage: "연결 쌉가능", title: "문장을 잇기 — 접속·완료",
    bookLabel: "문장 잇기 쌉가능",
    tagline: "그리고·근데·때문에로 술술.",
    theme: { key: "lv6", ink: "#46245F", accent: "#9440D8", soft: "#F3E8F9" },
    chapters: [{
      why: "생각이 하나로 끝나지 않을 때, 문장을 이어 흐르게 해요. '그리고·그러나·~때문에·~라는 것'으로 잇고, 완료시제로 과거와 지금을 연결하면 짧은 문장들이 자연스럽게 이어집니다.",
      units: [
        { id: "L6-1-1", title: "그리고 · 그러나 · 그래서", focus: "등위접속사 and/but/or/so로 문장 잇기" },
        { id: "L6-1-2", title: "~때문에 · ~할 때 · ~하면", focus: "부사절 because/when/if/although" },
        { id: "L6-1-3", title: "~라는 것", focus: "명사절 that(생각·사실을 목적어로)" },
        { id: "L6-1-4", title: "해 왔다 · 해 본 적 있다", focus: "현재완료(경험·계속·완료)" },
        { id: "L6-1-5", title: "그전에 이미", focus: "과거완료(과거의 과거)" }
      ]
    }]
  },

  /* ===================== LEVEL 7 · 관점 전환 쌉가능 ===================== */
  {
    level: 7, stage: "관점 전환 쌉가능", title: "관점을 바꾸기 — 수동태·비교",
    bookLabel: "관점 바꾸기 쌉가능",
    tagline: "수동태·비교로 시야 넓히기.",
    theme: { key: "lv7", ink: "#52224F", accent: "#B23BC0", soft: "#F8E8F6" },
    chapters: [{
      why: "누가 했는지보다 '무엇이 되었는지'가 중요할 때가 있어요. 수동태로 관점을 바꾸고, 비교로 둘 이상을 견주면 표현의 시야가 한층 넓어집니다.",
      units: [
        { id: "L7-1-1", title: "~되다 · ~당하다", focus: "수동태 기본(be + 과거분사)" },
        { id: "L7-1-2", title: "누구에 의해", focus: "수동태 + by, 행위자 표현" },
        { id: "L7-1-3", title: "더 ~한", focus: "비교급(-er / more ~)" },
        { id: "L7-1-4", title: "가장 ~한", focus: "최상급(-est / most ~)" },
        { id: "L7-1-5", title: "~만큼 ~한", focus: "원급 비교 as ~ as" }
      ]
    }]
  },

  /* ===================== LEVEL 8 · 긴 문장 쌉가능 ===================== */
  {
    level: 8, stage: "긴 문장 쌉가능", title: "문장 속 문장 — 관계사·분사구문",
    bookLabel: "긴 문장 쌉가능",
    tagline: "관계사·분사로 두세 문장을 하나로.",
    theme: { key: "lv8", ink: "#5A2147", accent: "#C8388F", soft: "#FAE8F2" },
    chapters: [{
      why: "이제 두세 정보를 한 문장에 담을 차례예요. 관계사와 분사구문으로 짧은 문장들을 하나로 압축하면, 길고 자연스러운 문장이 한 번에 나옵니다.",
      units: [
        { id: "L8-1-1", title: "~하는 사람 / ~하는 것", focus: "관계대명사 who/which/that" },
        { id: "L8-1-2", title: "~하는 곳 / ~하는 때", focus: "관계부사 where/when/why" },
        { id: "L8-1-3", title: "콤마로 덧붙이기", focus: "관계사의 계속적 용법(부가 설명)" },
        { id: "L8-1-4", title: "~하면서 · ~한 채", focus: "분사구문(동시동작·이유·조건)" },
        { id: "L8-1-5", title: "두 문장을 한 문장으로", focus: "관계사·분사로 정보 압축하기" }
      ]
    }]
  },

  /* ===================== LEVEL 9 · 영어 쌉가능 (만렙) ===================== */
  {
    level: 9, stage: "영어 쌉가능", title: "마음을 표현하기 — 가정법·공손·재구성",
    bookLabel: "만렙 · 영어 쌉가능",
    tagline: "마음까지 영어로. 졸업 ㅊㅋ.",
    theme: { key: "lv9", ink: "#5E1F38", accent: "#E63677", soft: "#FCE7EE" },
    chapters: [{
      why: "마지막 단계, 사실을 넘어 '마음'을 담을 차례예요. 가정·공손·완곡함을 다루고, 같은 뜻을 더 매끄럽게 다듬어 문장을 이으면, 진짜 영어 쌉가능이에요.",
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
