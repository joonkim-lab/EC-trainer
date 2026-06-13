/* =====================================================================
 * 영작 트레이너 — 커리큘럼 데이터
 * 출처: 유은하 『영어로 문장 만들기 훈련』 1·2·3차 임계점 (사람in)
 *   - 1차 임계점  →  LEVEL 1  (영작의 기초 체력 / 뼈대→확장)
 *   - 2차 임계점  →  LEVEL 2  (의미를 가르는 정교함)
 *   - 3차 임계점  →  LEVEL 3  (표현력이 실력)
 *
 * 구조: LEVEL > CHAPTER > UNIT  (책 목차 순서를 그대로 따름)
 *   level.theme   : 화면 테마 색 (1 블루프린트 / 2 세이지 / 3 네이비)
 *   chapter.why   : 이 챕터를 "왜 배우나" 한두 줄 설명 (연습 전 노출)
 *   unit.id       : 진도 저장용 고유 키 (예: "L1-1-1")
 *   unit.title    : 유닛 제목
 *   unit.focus    : AI 출제·채점이 참고할 문법 초점 (한 줄)
 *   unit.seeds    : 교재에서 뽑은 진짜 예문 (있으면 우선 사용, 없으면 AI 생성)
 * ===================================================================== */

const CURRICULUM = [
  /* ============================ LEVEL 1 ============================ */
  {
    level: 1,
    name: "1차 임계점",
    tagline: "영작의 기초 체력 — 뼈대부터 세운다",
    theme: { key: "blueprint", ink: "#1E3A6E", accent: "#2E5EAA", soft: "#E8EEF8" },
    chapters: [
      {
        part: "PART 1 · 영작의 BASE",
        title: "뼈대 문장에서 확장 문장으로",
        why: "영어는 아무리 긴 문장도 '누가 한다(주어+서술어)'를 먼저 박고, 나머지를 그 뒤에 하나씩 붙입니다. 이 뼈대 감각이 모든 영작의 토대예요.",
        units: [
          { id: "L1-1-1", title: "뼈대 문장에서 확장 문장으로", focus: "주어+서술어(뼈대)를 먼저 세우고 장소·시간·목적 순으로 확장",
            seeds: [
              { ko: "나는 체중을 줄이려고 매일 아침 공원에서 달립니다.", hint: "run / in the park / every morning / to lose weight", ref: "I run in the park every morning to lose weight." },
              { ko: "그는 건강을 유지하려고 매일 걸어서 출근해요.", hint: "walk to work / every day / to stay healthy", ref: "He walks to work every day to stay healthy." }
            ] },
          { id: "L1-1-2", title: "뼈대 문장에 보충어를 더해 확장 1", focus: "be동사 + 보어(형용사·명사)로 상태를 설명" },
          { id: "L1-1-3", title: "뼈대 문장에 보충어를 더해 확장 2", focus: "감각·상태동사(look/feel/become 등) + 보어" },
          { id: "L1-1-4", title: "뼈대 문장에서 대상어를 더해 확장", focus: "주어+서술어+대상어(목적어) 3형식" },
          { id: "L1-1-5", title: "남에게 퍼 주는 문장으로", focus: "수여동사 주어+서술어+간접목적어+직접목적어(4형식)" },
          { id: "L1-1-6", title: "대상어를 명확히 하는 문장 1", focus: "목적격보어(형용사/명사) 5형식" },
          { id: "L1-1-7", title: "대상어를 명확히 하는 문장 2", focus: "사역·지각동사의 목적격보어" }
        ]
      },
      {
        part: "PART 1 · 영작의 BASE",
        title: "시제와 조동사로 문장의 의도를 분명하게",
        why: "같은 뼈대라도 시제와 조동사가 '언제' '얼마나 확실한지' '해야 하는지'를 정합니다. 의도를 또렷하게 만드는 단계예요.",
        units: [
          { id: "L1-2-1", title: "현재 시제", focus: "습관·일반적 사실의 단순현재" },
          { id: "L1-2-2", title: "과거 시제", focus: "끝난 과거 동작의 단순과거" },
          { id: "L1-2-3", title: "미래 시제 1 (will)", focus: "will로 미래 의지·예측" },
          { id: "L1-2-4", title: "미래 시제 2 (be going to)", focus: "계획된 미래 be going to" },
          { id: "L1-2-5", title: "현재진행 1", focus: "지금 진행 중인 동작 am/is/are+Ving" },
          { id: "L1-2-6", title: "현재진행 2", focus: "가까운 예정·일시적 상황의 현재진행" },
          { id: "L1-2-7", title: "과거진행", focus: "과거 한 시점에 진행 중이던 동작 was/were+Ving" },
          { id: "L1-2-8", title: "현재완료 1", focus: "경험·완료 have/has+p.p." },
          { id: "L1-2-9", title: "현재완료 2", focus: "계속·결과의 현재완료" },
          { id: "L1-2-10", title: "현재완료진행", focus: "과거부터 지금까지 계속 진행 have been Ving" },
          { id: "L1-2-11", title: "조동사 can", focus: "능력·가능·허락의 can" },
          { id: "L1-2-12", title: "조동사 could", focus: "과거 능력·정중함·약한 추측 could" },
          { id: "L1-2-13", title: "조동사 should / had better", focus: "충고·권유 should, 강한 권고 had better" },
          { id: "L1-2-14", title: "조동사 have to", focus: "의무·필요 have to" }
        ]
      },
      {
        part: "PART 2 · 영어다운 영작",
        title: "수식어로 명사 자리 늘이기",
        why: "한 단어 명사를 '구·절'로 길게 만들어 영어다운 문장으로 키웁니다. 명사를 뒤에서 꾸미는 영어식 감각이 핵심이에요.",
        units: [
          { id: "L1-3-1", title: "명사 + 전치사구 (형용사구) 1", focus: "명사 뒤 전치사구로 수식" },
          { id: "L1-3-2", title: "명사 + 전치사구 (형용사구) 2", focus: "여러 전치사구로 명사 확장" },
          { id: "L1-3-3", title: "명사 + 현재분사", focus: "능동·진행 의미 현재분사로 명사 수식" },
          { id: "L1-3-4", title: "명사 + 과거분사", focus: "수동·완료 의미 과거분사로 명사 수식" },
          { id: "L1-3-5", title: "명사 + to부정사구", focus: "to부정사로 명사 수식(~할)" },
          { id: "L1-3-6", title: "명사 + 관계대명사절 1", focus: "주격·목적격 관계대명사" },
          { id: "L1-3-7", title: "명사 + 관계대명사절 2", focus: "관계대명사 심화" },
          { id: "L1-3-8", title: "명사 + 관계부사절", focus: "where/when/why 관계부사" }
        ]
      },
      {
        part: "PART 2 · 영어다운 영작",
        title: "동사, 형용사 수식하고 늘이기",
        why: "동사와 형용사 뒤를 부사적 표현으로 늘려 '어떻게·왜·언제'를 더합니다.",
        units: [
          { id: "L1-4-1", title: "전치사구 (부사구)", focus: "전치사구로 동사 수식" },
          { id: "L1-4-2", title: "to부정사구 1", focus: "목적의 to부정사(~하기 위해)" },
          { id: "L1-4-3", title: "to부정사구 2", focus: "감정의 원인·결과 to부정사" },
          { id: "L1-4-4", title: "현재분사 (동시동작)", focus: "~하면서의 현재분사" }
        ]
      },
      {
        part: "PART 2 · 영어다운 영작",
        title: "긴 명사 써서 늘이기",
        why: "동명사·to부정사·명사절을 '명사 덩어리'로 주어·목적어 자리에 넣어 표현 폭을 넓힙니다.",
        units: [
          { id: "L1-5-1", title: "명사구 1 (동명사구)", focus: "동명사를 주어·목적어로" },
          { id: "L1-5-2", title: "명사구 2 (to부정사구 1)", focus: "to부정사를 주어·목적어로" },
          { id: "L1-5-3", title: "명사구 3 (to부정사구 2)", focus: "가주어 it ~ to부정사" },
          { id: "L1-5-4", title: "명사구 4 (의미상 주어)", focus: "for+목적격 to부정사의 의미상 주어" },
          { id: "L1-5-5", title: "명사구 5 (의문사+to부정사)", focus: "what/how/where + to부정사" },
          { id: "L1-5-6", title: "명사절 1 (that)", focus: "that절을 명사 자리에" },
          { id: "L1-5-7", title: "명사절 2", focus: "think/believe류 + that절" },
          { id: "L1-5-8", title: "명사절 3", focus: "that절 심화·생략" },
          { id: "L1-5-9", title: "의문사 명사절 1", focus: "what이 이끄는 명사절" },
          { id: "L1-5-10", title: "의문사 명사절 2", focus: "who/which가 이끄는 명사절" },
          { id: "L1-5-11", title: "의문사 명사절 3", focus: "when/where/how/why 명사절(간접의문문)" }
        ]
      },
      {
        part: "PART 2 · 영어다운 영작",
        title: "문장 수식하고 늘이기",
        why: "접속사와 분사구문으로 문장과 문장을 자연스럽게 잇습니다. 글이 흐르기 시작하는 단계예요.",
        units: [
          { id: "L1-6-1", title: "시간 접속사 1", focus: "when/while/before/after" },
          { id: "L1-6-2", title: "시간 접속사 2", focus: "as soon as/until/since" },
          { id: "L1-6-3", title: "조건 접속사", focus: "if/unless" },
          { id: "L1-6-4", title: "이유 접속사", focus: "because/since/as" },
          { id: "L1-6-5", title: "양보 접속사 1", focus: "although/though" },
          { id: "L1-6-6", title: "양보 접속사 2", focus: "even though/even if" },
          { id: "L1-6-7", title: "분사구문 1", focus: "동시동작·연속동작 분사구문" },
          { id: "L1-6-8", title: "분사구문 2", focus: "이유·시간 분사구문" },
          { id: "L1-6-9", title: "분사구문 3", focus: "분사구문 심화" }
        ]
      }
    ]
  },

  /* ============================ LEVEL 2 ============================ */
  {
    level: 2,
    name: "2차 임계점",
    tagline: "의미를 가르는 정교함 — 시제·태·뉘앙스",
    theme: { key: "sage", ink: "#2F4A3A", accent: "#5B8C6E", soft: "#E9F1EB" },
    chapters: [
      {
        part: "PART 1 · 의미를 가르는 영작 BASE",
        title: "영어의 시제",
        why: "완료·진행·미래의 미세한 시제 차이가 문장의 '의미'를 가릅니다. 같은 사건도 시제로 뜻이 달라져요.",
        units: [
          { id: "L2-1-1", title: "단순 현재와 현재진행", focus: "사실/습관 vs 지금 진행" },
          { id: "L2-1-2", title: "단순 과거와 과거진행", focus: "끝난 동작 vs 과거 진행 중" },
          { id: "L2-1-3", title: "현재완료", focus: "과거~현재 연결 have+p.p." },
          { id: "L2-1-4", title: "현재완료와 현재완료진행", focus: "결과 강조 vs 지속 강조" },
          { id: "L2-1-5", title: "과거완료", focus: "과거보다 더 이전 had+p.p." },
          { id: "L2-1-6", title: "과거완료진행", focus: "과거 한 시점까지 지속 had been Ving",
            seeds: [
              { ko: "그녀는 작년에 승진하기 전 10년 동안 그 회사에서 계속 일하고 있었어요.", hint: "work / for ten years / before / got promoted", ref: "She had been working at the company for ten years before she got promoted last year." }
            ] },
          { id: "L2-1-7", title: "미래를 나타내는 현재진행/단순현재", focus: "확정된 일정의 현재시제 미래" },
          { id: "L2-1-8", title: "will (의지·예측)", focus: "즉흥 결정·예측 will" },
          { id: "L2-1-9", title: "be going to", focus: "이미 정한 계획 be going to" },
          { id: "L2-1-10", title: "was/were going to", focus: "과거 속 미래(하려던 것)" },
          { id: "L2-1-11", title: "미래진행", focus: "미래 한 시점에 진행 will be Ving" },
          { id: "L2-1-12", title: "미래완료", focus: "미래 한 시점까지 완료 will have p.p." }
        ]
      },
      {
        part: "PART 2 · 원어민 감각의 영작",
        title: "사물 주어로 문장을 더 간결하게",
        why: "사물·개념을 주어로 쓰면 문장이 짧고 또렷해집니다. (단, 일상 대화에선 'I enjoyed ~'가 더 자연스러울 때가 많아요. 도구가 아니라 '맥락'을 보고 고르는 감각을 기릅니다.)",
        units: [
          { id: "L2-2-1", title: "사물주어 + 서술어 + 대상어", focus: "사물주어 3형식" },
          { id: "L2-2-2", title: "사물주어 + 서술어 + 전치사구", focus: "사물주어 + 자동사 + 전치사구" },
          { id: "L2-2-3", title: "사물주어 + I.O + D.O", focus: "사물주어 수여동사 4형식" },
          { id: "L2-2-4", title: "make/help/cause/drive 5형식", focus: "사물주어 사역·유발 5형식" },
          { id: "L2-2-5", title: "enable류 + 대상어 + to V", focus: "allow/enable/force + O + to V" },
          { id: "L2-2-6", title: "prevent/keep + 대상어 + from Ving", focus: "방지·억제 from Ving" },
          { id: "L2-2-7", title: "사물 주어가 조건을 나타낼 때", focus: "조건을 함축하는 사물주어" }
        ]
      },
      {
        part: "PART 2 · 원어민 감각의 영작",
        title: "수동태",
        why: "행위자보다 '당한 일·행위 자체'가 중요할 때 수동태를 씁니다. 시제·get과 만나면 더 자연스러워져요.",
        units: [
          { id: "L2-3-1", title: "행위 자체를 언급하는 문장", focus: "기본 수동태 be+p.p." },
          { id: "L2-3-2", title: "시제와 만난 수동태", focus: "완료·진행 수동태" },
          { id: "L2-3-3", title: "get 수동태", focus: "be 대신 get 수동태" },
          { id: "L2-3-4", title: "수동태로 굳어진 문장 1", focus: "be known/interested in 등 관용 수동태" },
          { id: "L2-3-5", title: "수동태로 굳어진 문장 2", focus: "be supposed to 등 관용 수동태" }
        ]
      },
      {
        part: "PART 2 · 원어민 감각의 영작",
        title: "준동사의 시제를 다양하게",
        why: "to부정사·동명사·분사도 시제와 태를 입을 수 있습니다. 시간 관계를 정교하게 표현하는 단계예요.",
        units: [
          { id: "L2-4-1", title: "시제와 만난 to부정사 1", focus: "to have p.p. 완료부정사" },
          { id: "L2-4-2", title: "수동태와 만난 to부정사 2", focus: "to be p.p. 수동부정사" },
          { id: "L2-4-3", title: "시제와 만난 동명사", focus: "having p.p. 완료동명사" },
          { id: "L2-4-4", title: "다양한 시제의 분사구문", focus: "having p.p. 분사구문" },
          { id: "L2-4-5", title: "내용을 추가하는 분사구문", focus: "보충 정보 분사구문" }
        ]
      },
      {
        part: "PART 3 · 문장의 기본 다듬기",
        title: "의문문·부정문·명령문 만들기",
        why: "묻고, 부정하고, 시키는 문장은 어순이 바뀝니다. 기본기를 손에 익혀 흔들리지 않게 합니다.",
        units: [
          { id: "L2-5-1", title: "be동사 의문문 1", focus: "Am/Is/Are 의문문" },
          { id: "L2-5-2", title: "be동사 의문문 2", focus: "be동사 의문문 심화" },
          { id: "L2-5-3", title: "조동사 의문문", focus: "can/will/should 의문문" },
          { id: "L2-5-4", title: "일반동사 의문문", focus: "do/does/did 의문문" },
          { id: "L2-5-5", title: "현재완료 의문문", focus: "Have/Has ~ p.p.? 의문문" },
          { id: "L2-5-6", title: "의문사 의문문 (who/what) 1", focus: "주어 의문사" },
          { id: "L2-5-7", title: "의문사 의문문 (who/what) 2", focus: "목적어 의문사" },
          { id: "L2-5-8", title: "의문사 의문문 (when/where/how/why)", focus: "부사 의문사" },
          { id: "L2-5-9", title: "how + 형용사/부사 의문문", focus: "How long/often/far 등" },
          { id: "L2-5-10", title: "be동사 부정문", focus: "be + not" },
          { id: "L2-5-11", title: "조동사 부정문", focus: "can't/won't/shouldn't 등" },
          { id: "L2-5-12", title: "일반동사 부정문", focus: "don't/doesn't/didn't" },
          { id: "L2-5-13", title: "명령문 1", focus: "긍정 명령문" },
          { id: "L2-5-14", title: "명령문 2", focus: "부정·정중 명령문" }
        ]
      },
      {
        part: "PART 3 · 문장의 기본 다듬기",
        title: "주어-동사 수 일치",
        why: "주어가 단수냐 복수냐에 따라 동사가 바뀝니다. 사소해 보여도 영어다움을 가르는 디테일이에요.",
        units: [
          { id: "L2-6-1", title: "수 일치 1 (집합명사·단수동사)", focus: "team/family 등 집합명사" },
          { id: "L2-6-2", title: "수 일치 2 (복수명사·복수동사)", focus: "복수 주어" },
          { id: "L2-6-3", title: "수 일치 3 (복수처럼 보이는 단수)", focus: "news/mathematics 등" },
          { id: "L2-6-4", title: "수 일치 4 (수량사)", focus: "some/much/many/a lot of" }
        ]
      },
      {
        part: "PART 3 · 영어식 사고를 키워 주는 영작",
        title: "관사, 제대로 알고 자신 있게 쓰기",
        why: "a / the / 무관사의 선택이 의미를 바꿉니다. 한국어엔 없는 감각이라 가장 까다롭지만, 영어다움의 마지막 한 끗이에요.",
        units: [
          { id: "L2-7-1", title: "관사로 문장 만들기", focus: "관사 기본 감각" },
          { id: "L2-7-2", title: "the를 제대로 쓴 문장", focus: "특정·유일의 the" },
          { id: "L2-7-3", title: "a/an을 제대로 쓴 문장", focus: "처음 언급·하나의 a/an" },
          { id: "L2-7-4", title: "무관사 표현", focus: "추상·복수·고유 무관사" }
        ]
      }
    ]
  },

  /* ============================ LEVEL 3 ============================ */
  {
    level: 3,
    name: "3차 임계점",
    tagline: "표현력이 실력 — 뉘앙스·재구성",
    theme: { key: "navy", ink: "#16213E", accent: "#26407A", soft: "#E7EBF4" },
    chapters: [
      {
        title: "조동사로 표현하는 한 끗 차이 뉘앙스",
        why: "같은 사실도 조동사 하나로 후회·추측·공손함이 달라집니다. 미묘한 마음을 영어로 옮기는 단계예요.",
        units: [
          { id: "L3-1-1", title: "used to (과거 습관·상태)", focus: "예전엔 ~했다 used to",
            seeds: [
              { ko: "예전에는 아침마다 커피를 마셨지만, 이제는 차가 더 좋아요.", hint: "used to / every morning / prefer tea", ref: "I used to drink coffee every morning, but now I prefer tea." }
            ] },
          { id: "L3-1-2", title: "would (공손한 뉘앙스)", focus: "정중·완곡 would" },
          { id: "L3-1-3", title: "would (추측·예상)", focus: "추측의 would" },
          { id: "L3-1-4", title: "should have p.p. (후회)", focus: "~했어야 했는데" },
          { id: "L3-1-5", title: "might/could/must have p.p.", focus: "과거 추측의 강도 차이" },
          { id: "L3-1-6", title: "be able to / will be able to", focus: "능력의 시제 표현" }
        ]
      },
      {
        title: "비교급·최상급으로 문장을 더 풍부하게",
        why: "비교는 생각을 또렷하게 만듭니다. 같다·더하다·가장 ~하다를 자유자재로 쓰는 단계예요.",
        units: [
          { id: "L3-2-1", title: "비교 문장 1", focus: "원급 as ~ as" },
          { id: "L3-2-2", title: "비교 문장 2", focus: "비교급 -er/more" },
          { id: "L3-2-3", title: "비교 문장 3", focus: "비교급 강조(much/far)" },
          { id: "L3-2-4", title: "비교 문장 4", focus: "the+비교급, the+비교급" },
          { id: "L3-2-5", title: "비교 문장 5", focus: "최상급" },
          { id: "L3-2-6", title: "비교 문장 6", focus: "비교 관용표현" }
        ]
      },
      {
        title: "예의 있게 질문/요청하기",
        why: "정중함은 어순과 표현으로 만듭니다. 직접 묻기보다 둘러 묻는 영어식 예의를 익혀요.",
        units: [
          { id: "L3-3-1", title: "정중한 직접의문문", focus: "Could/Would you ~?" },
          { id: "L3-3-2", title: "정중한 간접의문문 1", focus: "Could you tell me + 의문사절" },
          { id: "L3-3-3", title: "정중한 간접의문문 2", focus: "I wonder if/whether" },
          { id: "L3-3-4", title: "정중한 간접의문문 3", focus: "간접의문문 어순(평서문 어순)" },
          { id: "L3-3-5", title: "정중한 간접의문문 4", focus: "간접의문문 심화" },
          { id: "L3-3-6", title: "부가의문문", focus: "~, isn't it? 등 부가의문문" }
        ]
      },
      {
        title: "관계사절로 문장 확장하기",
        why: "관계사절은 두 문장을 하나로 압축해 정보를 우아하게 더합니다. 글이 어른스러워지는 분기점이에요.",
        units: [
          { id: "L3-4-1", title: "관계사절 1 (주격·목적격)", focus: "who/which/that 주격·목적격" },
          { id: "L3-4-2", title: "관계사절 2 (that 전용)", focus: "that만 쓰는 경우" },
          { id: "L3-4-3", title: "관계사절 3 (소유격)", focus: "whose" },
          { id: "L3-4-4", title: "관계사절 4 (계속적 용법)", focus: ", who/which 계속적 용법" },
          { id: "L3-4-5", title: "관계사절 5 (문장 전체를 받는 which)", focus: "앞 문장 전체를 받는 which" }
        ]
      },
      {
        title: "복합관계사로 문장 확장하기",
        why: "whoever·whatever·however로 '누구든·무엇이든·아무리 ~해도'를 한 단어에 담습니다.",
        units: [
          { id: "L3-5-1", title: "복합관계사 1 (명사절)", focus: "whoever/whatever/whichever 명사절" },
          { id: "L3-5-2", title: "복합관계사 2 (부사절)", focus: "whoever/whatever 양보 부사절" },
          { id: "L3-5-3", title: "복합관계사 3 (wherever/whenever/however)", focus: "장소·시간·정도 부사절" },
          { id: "L3-5-4", title: "복합관계사 4 (도사 생략)", focus: "복합관계사 생략·심화" }
        ]
      },
      {
        title: "분사구문으로 더 간결하고 세련되게",
        why: "접속사+주어+동사를 분사 하나로 줄여 문장에 리듬을 줍니다. 세련됨의 핵심 기술이에요.",
        units: [
          { id: "L3-6-1", title: "분사구문 1 (다양한 형태)", focus: "시간·이유·조건 분사구문" },
          { id: "L3-6-2", title: "분사구문 2 (독립분사구문)", focus: "주어가 다른 독립분사구문" },
          { id: "L3-6-3", title: "분사구문 3 (with + 명사 + 분사)", focus: "부대상황 with 분사구문" }
        ]
      },
      {
        title: "조건절과 가정법 문장 만들기",
        why: "사실이 아닌 일을 상상해 말하는 가정법은 표현력의 정점입니다. 'if'의 세계를 정교하게 다룹니다.",
        units: [
          { id: "L3-7-1", title: "조건절 만들기", focus: "if 직설 조건문" },
          { id: "L3-7-2", title: "가정법 1 (현재 사실 반대)", focus: "if + 과거, would + 동사원형" },
          { id: "L3-7-3", title: "가정법 2 (과거 사실 반대)", focus: "if + had p.p., would have p.p." },
          { id: "L3-7-4", title: "가정법 3 (혼합 가정법)", focus: "과거 원인 + 현재 결과" },
          { id: "L3-7-5", title: "I wish / as if 가정법", focus: "소망·마치 ~인 듯" },
          { id: "L3-7-6", title: "if only 가정법", focus: "강한 소망·후회 if only" },
          { id: "L3-7-7", title: "if it were not for 가정법", focus: "~이 없다면/없었다면" },
          { id: "L3-7-8", title: "if절 없는 가정법", focus: "도치·without 등 if 생략 가정법" }
        ]
      },
      {
        title: "문장의 재구성",
        why: "강조하고 싶은 것을 앞으로 끌어내고, 도치·분열·병렬로 문장을 다시 짭니다. 자기 목소리가 생기는 마지막 단계예요.",
        units: [
          { id: "L3-8-1", title: "감탄문", focus: "What/How 감탄문" },
          { id: "L3-8-2", title: "전치 (Fronting)", focus: "강조 요소를 문두로" },
          { id: "L3-8-3", title: "도치 (Inversion)", focus: "부정어·장소 도치" },
          { id: "L3-8-4", title: "분열문 (Cleft sentence)", focus: "It is ~ that 강조구문" },
          { id: "L3-8-5", title: "반복 (Repetition)", focus: "강조의 반복" },
          { id: "L3-8-6", title: "병렬 (Parallelism)", focus: "병렬 구조로 리듬" },
          { id: "L3-8-7", title: "생략 (Ellipsis)", focus: "반복 요소 생략" },
          { id: "L3-8-8", title: "추가 정보 (Insertion)", focus: "삽입구로 정보 더하기" },
          { id: "L3-8-9", title: "동격 (Apposition)", focus: "동격 구조" },
          { id: "L3-8-10", title: "반전의 영어 문장", focus: "기대를 뒤집는 문장 구성" }
        ]
      }
    ]
  }
];

/* ---- 파생 데이터: 유닛을 평탄화해서 진도 계산에 사용 ---- */
function flattenUnits(levelNum) {
  const lv = CURRICULUM.find(l => l.level === levelNum);
  if (!lv) return [];
  const out = [];
  lv.chapters.forEach((ch, ci) => {
    ch.units.forEach((u, ui) => {
      out.push({ ...u, chapterTitle: ch.title, chapterWhy: ch.why, part: ch.part || "", chapterIndex: ci, unitIndex: ui });
    });
  });
  return out;
}

/* 승급·통과 기준점 (준킴쌤이 자유롭게 조정 가능) */
const RULES = {
  UNIT_SET_SIZE: 8,        // 한 유닛에서 출제되는 문장 수
  UNIT_PASS_RATIO: 0.75,   // 유닛 통과: 75% 이상 '통과' 판정
  LEVELUP_SET_SIZE: 12,    // 승급 시험 문장 수
  LEVELUP_PASS_RATIO: 0.85,// 승급 통과: 85% 이상
  PLACEMENT_SIZE: 6,       // 배치고사 문장 수
  PASS_SCORE: 70           // 한 문장이 '통과'로 인정되는 점수(0~100)
};

if (typeof module !== "undefined") module.exports = { CURRICULUM, flattenUnits, RULES };
