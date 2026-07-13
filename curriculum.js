/* =====================================================================
 * 쌉가능 — 이제 영어, 쌉가능
 * 개발: coldwater1042
 *
 * 커리큘럼: 12레벨 / 3임계점 나선형
 *   1차 임계점(L1–4)  기초  "문장을 만들 수 있다"
 *   2차 임계점(L5–8)  정교  "문장을 정교하게"
 *   3차 임계점(L9–12) 세련  "원어민 감각"
 * ---------------------------------------------------------------------
 * 로딩: <script src="curriculum.js"></script>   (모듈 아님 · 전역 상수)
 *
 * 저작권: 모든 예문·설명은 독자 집필. 교재(《영어로 문장 만들기 훈련》,
 *         유은하)의 방법론만 흡수하고 예문·문구는 복제하지 않음.
 * 대상: 중·고등 (영어를 어려워하는 학생)
 * =====================================================================
 *
 * [ 유닛 스키마 ]  ※ L1만 집필 완료. L2~12는 골격만.
 *   id, title, skeleton, focus
 *   card { achieve, howto, demo{ ko[], steps[{q,ko,en}], answer, tip } }
 *   practice[]   ② 연습 "한 줄씩 쌓기" — 통과/탈락 없음
 *                { ko, steps:[{q,en,hint}], answer }
 *                └ hint 에 시제·형태 설명 필수 ("한 명이면 → runs")
 *   challenges[] ③ 실전 "통문장" 3문제 — 순서대로 90점↑ 통과해야 유닛 완료
 *                { ko, answer, verb?{base,s}, chunks?[{lab,ko}] }
 *   similar[]    "↻ 비슷한 문제 한 번 더" 폴백 (실앱에선 AI가 생성)
 *
 * [ 레벨 스키마 ]
 *   exam { passScore:8, total:10, questions[] }
 *   → 모든 유닛 통과 후 총정리. 8/10 이상이면 다음 레벨 해금 + 스킬 연출
 *
 * [ 진급 규칙 ]
 *   유닛: challenges 3문제 모두 통과(90점↑)
 *   레벨: 전 유닛 통과 → 총정리 8/10 → 다음 레벨 해금
 *   ※ 선생님 관리 패널(△▽) 수동 조정은 그대로 유지
 * =================================================================== */

const MAX_LEVEL = 12;

/* 임계점(반 편성 경계) */
const THRESHOLDS = [
  { id:1, name:'1차 임계점', stage:'기초', goal:'문장을 만들 수 있다', levels:[1,2,3,4],
    theme:{ ink:'#241f3d', accent:'#4f46e5', soft:'#eef0ff' } },
  { id:2, name:'2차 임계점', stage:'정교', goal:'문장을 정교하게',   levels:[5,6,7,8],
    theme:{ ink:'#251c3f', accent:'#7c3aed', soft:'#f3edff' } },
  { id:3, name:'3차 임계점', stage:'세련', goal:'원어민 감각',        levels:[9,10,11,12],
    theme:{ ink:'#2e1830', accent:'#db2777', soft:'#fdf2f8' } },
];

/* 전역 규칙 */
const RULES = {
  PASS_SCORE: 90,           // 실전 통문장 통과 기준 (준킴쌤 요구: 90점 게이트)
  PRACTICE_PER_UNIT: 3,     // 유닛당 연습 문제 수 (손잡고 하는 단계)
  CHALLENGES_PER_UNIT: 5,   // 유닛당 실전 문제 수 (게이트)
  EXAM_TOTAL: 20,           // 레벨 시험 문항 수 (AI가 매번 새로 출제)
  EXAM_MAX_WRONG: 2,        // 허용 오답 수 (2개 이하 틀려야 통과 = 18개 이상)
  EXAM_PASS: 18,            // 통과 정답 수 (EXAM_TOTAL - EXAM_MAX_WRONG)
  EXAM_NEEDS_PERMIT: true,  // 레벨 시험은 선생님 허가가 있어야 응시 가능
  PLACEMENT_PASS: 70,       // 배치고사 레벨 통과 평균
};

/* 구버전 index.html 호환 (레벨별 규칙) */
function rulesFor(level){
  return {
    PASS_SCORE: RULES.PASS_SCORE,
    UNIT_PASS_RATIO: 1.0,               // 3문제 모두 통과해야 유닛 완료
    LEVELUP_SET_SIZE: RULES.EXAM_TOTAL, // 총정리 10문제
    LEVELUP_PASS_RATIO: RULES.EXAM_PASS / RULES.EXAM_TOTAL, // 0.8
  };
}

const CURRICULUM = [

  {
    level: 1,
    threshold: 1,
    stage: '기초',
    bookLabel: '1차 임계점',
    theme: { ink:'#241f3d', accent:'#4f46e5', soft:'#eef0ff' },
    title: '뼈대 : 누가 한다',
    skill: '문장 쌉가능',
    skillDesc: 'L1 클리어! 이제 영어 문장의 여섯 가지 뼈대를 스스로 만들 수 있어요. 다음은 여기에 시제(언제)를 입힐 차례예요.',
    nextHint: 'LEVEL 2 · 기본 시제',
    units: [

      /* ---------------------------------------------------------------- */
      {
        id: 'L1-1',
        title: '누가 + 한다',
        tagline: '누가 무엇을 한다 — 가장 기본 문장을 말해요',
        skeleton: '누가 + 한다',
        focus: 'SV (1형식) / 3인칭 단수 -s',
        card: {
          achieve: '이걸 익히면 "누가 무엇을 한다"를 영어로 딱 말할 수 있어요. 영어의 모든 문장이 여기서 시작해요.',
          howto: '영어는 누가(주어) + 한다(동사)를 항상 맨 앞에 박아요. 한국어는 "나는 매일 아침 공원에서 달린다"처럼 \'한다\'가 맨 뒤에 오지만, 영어는 I run부터 꺼내고 나머지를 뒤에 붙여요. 👉 늘 : "누가?" → "한다?"',
          demo: {
            ko: [
              '친구들이',
              '웃는다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '친구들이',
                en: 'My friends'
              },
              {
                q: '한다?',
                ko: '웃는다',
                en: 'laugh'
              }
            ],
            answer: 'My friends laugh.',
            tip: '딱 두 조각. "누가 한다"만 있으면 벌써 완전한 영어 문장.'
          }
        },
        practice: [
          {
            ko: '그가 달린다',
            steps: [
              {
                q: '누가?',
                en: 'He'
              },
              {
                q: '한다?',
                en: 'runs',
                hint: '한 명이면 → runs'
              }
            ],
            answer: 'He runs.'
          },
          {
            ko: '우리 팀이 이긴다',
            steps: [
              {
                q: '누가?',
                en: 'Our team'
              },
              {
                q: '한다?',
                en: 'wins',
                hint: '하나면 → wins'
              }
            ],
            answer: 'Our team wins.'
          },
          {
            ko: '새들이 노래한다',
            steps: [
              {
                q: '누가?',
                en: 'The birds'
              },
              {
                q: '한다?',
                en: 'sing',
                hint: '여럿이면 → 그대로 sing'
              }
            ],
            answer: 'The birds sing.'
          }
        ],
        challenges: [
          {
            ko: '고양이가 뛴다.',
            answer: 'The cat jumps.',
            verb: {
              base: 'jump',
              s: 'jumps'
            },
            chunks: [
              {
                lab: '누가',
                ko: '고양이가'
              },
              {
                lab: '한다',
                ko: '뛴다'
              }
            ]
          },
          {
            ko: '개가 짖는다.',
            answer: 'The dog barks.',
            verb: {
              base: 'bark',
              s: 'barks'
            }
          },
          {
            ko: '아기가 웃는다.',
            answer: 'The baby smiles.',
            verb: {
              base: 'smile',
              s: 'smiles'
            }
          },
          {
            ko: '새가 난다.',
            answer: 'The bird flies.',
            verb: {
              base: 'fly',
              s: 'flies'
            }
          },
          {
            ko: '별이 빛난다.',
            answer: 'The star shines.',
            verb: {
              base: 'shine',
              s: 'shines'
            }
          }
        ],
        similar: [
          {
            ko: '아이들이 논다.',
            answer: 'The children play.'
          },
          {
            ko: '해가 뜬다.',
            answer: 'The sun rises.',
            verb: {
              base: 'rise',
              s: 'rises'
            }
          }
        ],
      },
      {
        id: 'L1-2',
        title: '누가 + 이다 · 어떠하다',
        tagline: '누가 무엇이다 / 어떠하다를 말해요',
        skeleton: '누가 + 이다 · 어떠하다',
        focus: 'be동사 (2형식) / am·is·are 수 일치',
        card: {
          achieve: '이걸 익히면 "누가 무엇이다"(나는 학생이다)와 "누가 어떠하다"(그녀는 피곤하다)를 말할 수 있어요.',
          howto: '한국어의 \'~이다 / ~하다\'는 영어에서 사라지지 않아요. am / is / are가 그 자리에 들어가요. 누가에 따라 짝이 달라요 : I → am / 한 명(He·She·It) → is / 여럿(We·You·They) → are',
          demo: {
            ko: [
              '그녀는',
              '피곤하다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '그녀는',
                en: 'She'
              },
              {
                q: '어떠하다?',
                ko: '피곤하다',
                en: 'is tired'
              }
            ],
            answer: 'She is tired.',
            tip: '\'한다\'가 안 보이는 문장엔 am/is/are가 대신 들어간다!'
          }
        },
        practice: [
          {
            ko: '그는 배고프다',
            steps: [
              {
                q: '누가?',
                en: 'He'
              },
              {
                q: '어떠하다?',
                en: 'is hungry',
                hint: '한 명 → is'
              }
            ],
            answer: 'He is hungry.'
          },
          {
            ko: '우리는 친구다',
            steps: [
              {
                q: '누가?',
                en: 'We'
              },
              {
                q: '이다?',
                en: 'are friends',
                hint: '여럿 → are'
              }
            ],
            answer: 'We are friends.'
          },
          {
            ko: '그것은 쉽다',
            steps: [
              {
                q: '누가?',
                en: 'It'
              },
              {
                q: '어떠하다?',
                en: 'is easy',
                hint: '하나 → is'
              }
            ],
            answer: 'It is easy.'
          }
        ],
        challenges: [
          {
            ko: '나는 피곤하다.',
            answer: 'I am tired.',
            chunks: [
              {
                lab: '누가',
                ko: '나는'
              },
              {
                lab: '어떠하다',
                ko: '피곤하다 → am'
              }
            ]
          },
          {
            ko: '그는 행복하다.',
            answer: 'He is happy.'
          },
          {
            ko: '그들은 바쁘다.',
            answer: 'They are busy.'
          },
          {
            ko: '그녀는 친절하다.',
            answer: 'She is kind.'
          },
          {
            ko: '나는 학생이다.',
            answer: 'I am a student.'
          }
        ],
        similar: [
          {
            ko: '우리는 준비됐다.',
            answer: 'We are ready.'
          },
          {
            ko: '그것은 새것이다.',
            answer: 'It is new.'
          }
        ],
      },
      {
        id: 'L1-3',
        title: '누가 + 한다 + 무엇을',
        tagline: '누가 무엇을 한다 — 대상을 붙여 말해요',
        skeleton: '누가 + 한다 + 무엇을',
        focus: 'SVO (3형식) / 목적어 어순 역전',
        card: {
          achieve: '이걸 익히면 "누가 무엇을 한다"(나는 게임을 한다)를 말할 수 있어요. 문장이 한 덩어리 길어져요.',
          howto: '여기서 한국어랑 순서가 처음으로 뒤집혀요. 한국어는 "나는 게임을 한다"지만, 영어는 한다 → 무엇을 순서예요. I play games — \'무엇을\'이 동사 뒤로 가요. 👉 "누가?" → "한다?" → "무엇을?"',
          demo: {
            ko: [
              '나는',
              '게임을',
              '한다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '나는',
                en: 'I'
              },
              {
                q: '한다?',
                ko: '한다',
                en: 'play'
              },
              {
                q: '무엇을?',
                ko: '게임을',
                en: 'games'
              }
            ],
            answer: 'I play games.',
            tip: '한국어에선 \'무엇을\'이 가운데, 영어에선 동사 뒤로 넘어간다.'
          }
        },
        practice: [
          {
            ko: '그녀가 커피를 마신다',
            steps: [
              {
                q: '누가?',
                en: 'She'
              },
              {
                q: '한다?',
                en: 'drinks',
                hint: '한 명 → drinks'
              },
              {
                q: '무엇을?',
                en: 'coffee'
              }
            ],
            answer: 'She drinks coffee.'
          },
          {
            ko: '우리는 축구를 한다',
            steps: [
              {
                q: '누가?',
                en: 'We'
              },
              {
                q: '한다?',
                en: 'play'
              },
              {
                q: '무엇을?',
                en: 'soccer'
              }
            ],
            answer: 'We play soccer.'
          },
          {
            ko: '그가 사과를 먹는다',
            steps: [
              {
                q: '누가?',
                en: 'He'
              },
              {
                q: '한다?',
                en: 'eats',
                hint: '한 명 → eats'
              },
              {
                q: '무엇을?',
                en: 'an apple'
              }
            ],
            answer: 'He eats an apple.'
          }
        ],
        challenges: [
          {
            ko: '나는 책을 읽는다.',
            answer: 'I read books.',
            chunks: [
              {
                lab: '누가',
                ko: '나는'
              },
              {
                lab: '한다',
                ko: '읽는다'
              },
              {
                lab: '무엇을',
                ko: '책을'
              }
            ]
          },
          {
            ko: '그녀가 커피를 마신다.',
            answer: 'She drinks coffee.',
            verb: {
              base: 'drink',
              s: 'drinks'
            }
          },
          {
            ko: '우리는 축구를 한다.',
            answer: 'We play soccer.'
          },
          {
            ko: '그가 음악을 좋아한다.',
            answer: 'He likes music.',
            verb: {
              base: 'like',
              s: 'likes'
            }
          },
          {
            ko: '나는 물을 마신다.',
            answer: 'I drink water.'
          }
        ],
        similar: [
          {
            ko: '그들은 영어를 공부한다.',
            answer: 'They study English.'
          },
          {
            ko: '그녀가 피아노를 친다.',
            answer: 'She plays the piano.',
            verb: {
              base: 'play',
              s: 'plays'
            }
          }
        ],
      },
      {
        id: 'L1-4',
        title: '누가 + 준다 + 누구에게 + 무엇을',
        tagline: '누가 누구에게 무엇을 준다를 말해요',
        skeleton: '누가 + 준다 + 누구에게 + 무엇을',
        focus: 'SVOO (4형식) / 수여동사',
        card: {
          achieve: '이걸 익히면 "누가 누구에게 무엇을 준다"(그가 나에게 선물을 준다)를 말할 수 있어요. 덩어리가 두 개 붙어요.',
          howto: '주다·보내다·사주다·보여주다 같은 동사는 뒤에 덩어리가 둘 : 누구에게 + 무엇을. 영어 순서는 준다 → 누구에게 → 무엇을. gives me a book — "누구에게"가 먼저, "무엇을"이 나중.',
          demo: {
            ko: [
              '선생님이',
              '나에게',
              '책을',
              '주신다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '선생님이',
                en: 'The teacher'
              },
              {
                q: '준다?',
                ko: '주신다',
                en: 'gives'
              },
              {
                q: '누구에게?',
                ko: '나에게',
                en: 'me'
              },
              {
                q: '무엇을?',
                ko: '책을',
                en: 'a book'
              }
            ],
            answer: 'The teacher gives me a book.',
            tip: '순서만 지키면 긴 문장도 척척. 준다 → 누구에게 → 무엇을.'
          }
        },
        practice: [
          {
            ko: '엄마가 나에게 돈을 주신다',
            steps: [
              {
                q: '누가?',
                en: 'My mom'
              },
              {
                q: '준다?',
                en: 'gives',
                hint: '한 명 → gives'
              },
              {
                q: '누구에게?',
                en: 'me'
              },
              {
                q: '무엇을?',
                en: 'money'
              }
            ],
            answer: 'My mom gives me money.'
          },
          {
            ko: '그가 그녀에게 편지를 보낸다',
            steps: [
              {
                q: '누가?',
                en: 'He'
              },
              {
                q: '보낸다?',
                en: 'sends'
              },
              {
                q: '누구에게?',
                en: 'her'
              },
              {
                q: '무엇을?',
                en: 'a letter'
              }
            ],
            answer: 'He sends her a letter.'
          },
          {
            ko: '그녀가 나에게 책을 준다',
            steps: [
              {
                q: '누가?',
                en: 'She'
              },
              {
                q: '준다?',
                en: 'gives',
                hint: '한 명 → gives'
              },
              {
                q: '누구에게?',
                en: 'me'
              },
              {
                q: '무엇을?',
                en: 'a book'
              }
            ],
            answer: 'She gives me a book.'
          }
        ],
        challenges: [
          {
            ko: '친구가 나에게 선물을 준다.',
            answer: 'My friend gives me a gift.',
            verb: {
              base: 'give',
              s: 'gives'
            },
            chunks: [
              {
                lab: '누가',
                ko: '친구가'
              },
              {
                lab: '준다',
                ko: '준다'
              },
              {
                lab: '누구에게',
                ko: '나에게'
              },
              {
                lab: '무엇을',
                ko: '선물을'
              }
            ]
          },
          {
            ko: '그가 그녀에게 편지를 보낸다.',
            answer: 'He sends her a letter.',
            verb: {
              base: 'send',
              s: 'sends'
            }
          },
          {
            ko: '선생님이 우리에게 숙제를 주신다.',
            answer: 'The teacher gives us homework.',
            verb: {
              base: 'give',
              s: 'gives'
            }
          },
          {
            ko: '그가 나에게 공을 준다.',
            answer: 'He gives me a ball.',
            verb: {
              base: 'give',
              s: 'gives'
            }
          },
          {
            ko: '엄마가 그에게 물을 주신다.',
            answer: 'My mom gives him water.',
            verb: {
              base: 'give',
              s: 'gives'
            }
          }
        ],
        similar: [
          {
            ko: '그녀가 나에게 꽃을 준다.',
            answer: 'She gives me flowers.',
            verb: {
              base: 'give',
              s: 'gives'
            }
          },
          {
            ko: '나는 그에게 카드를 보낸다.',
            answer: 'I send him a card.'
          }
        ],
      },
      {
        id: 'L1-5',
        title: '무엇을 + 어떤 상태로',
        tagline: '무엇을 어떤 상태로 만든다/부른다를 말해요',
        skeleton: '누가 + 만든다 + 무엇을 + 어떤 상태로',
        focus: 'SVOC (5형식) / make·call·name',
        card: {
          achieve: '이걸 익히면 "누가 무엇을 어떤 상태로 만든다/부른다"(그 노래가 나를 행복하게 만든다)를 말할 수 있어요.',
          howto: 'make(만들다)·call(부르다)·name(이름 붙이다) 같은 동사는 뒤에 무엇을 + 어떤 상태로 두 덩어리를 붙여요. makes me happy — "무엇을"이 먼저, "어떤 상태로"가 나중.',
          demo: {
            ko: [
              '그 노래가',
              '나를',
              '행복하게',
              '만든다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '그 노래가',
                en: 'The song'
              },
              {
                q: '만든다?',
                ko: '만든다',
                en: 'makes'
              },
              {
                q: '무엇을?',
                ko: '나를',
                en: 'me'
              },
              {
                q: '어떤 상태로?',
                ko: '행복하게',
                en: 'happy'
              }
            ],
            answer: 'The song makes me happy.',
            tip: '"나를 행복하게"를 한 덩어리로 묶지 말고, "나를(me) / 행복하게(happy)" 두 조각으로.'
          }
        },
        practice: [
          {
            ko: '그 영화가 나를 슬프게 만든다',
            steps: [
              {
                q: '누가?',
                en: 'The movie'
              },
              {
                q: '만든다?',
                en: 'makes',
                hint: '하나 → makes'
              },
              {
                q: '무엇을?',
                en: 'me'
              },
              {
                q: '어떤 상태로?',
                en: 'sad'
              }
            ],
            answer: 'The movie makes me sad.'
          },
          {
            ko: '사람들은 그를 천재라고 부른다',
            steps: [
              {
                q: '누가?',
                en: 'People'
              },
              {
                q: '부른다?',
                en: 'call'
              },
              {
                q: '무엇을?',
                en: 'him'
              },
              {
                q: '어떤 상태로?',
                en: 'a genius'
              }
            ],
            answer: 'People call him a genius.'
          },
          {
            ko: '그 소식이 나를 행복하게 만든다',
            steps: [
              {
                q: '누가?',
                en: 'The news'
              },
              {
                q: '만든다?',
                en: 'makes',
                hint: '하나 → makes'
              },
              {
                q: '무엇을?',
                en: 'me'
              },
              {
                q: '어떤 상태로?',
                en: 'happy'
              }
            ],
            answer: 'The news makes me happy.'
          }
        ],
        challenges: [
          {
            ko: '그 게임이 나를 신나게 만든다.',
            answer: 'The game makes me excited.',
            verb: {
              base: 'make',
              s: 'makes'
            },
            chunks: [
              {
                lab: '누가',
                ko: '그 게임이'
              },
              {
                lab: '만든다',
                ko: '만든다'
              },
              {
                lab: '무엇을',
                ko: '나를'
              },
              {
                lab: '어떤 상태로',
                ko: '신나게'
              }
            ]
          },
          {
            ko: '그 영화가 나를 슬프게 만든다.',
            answer: 'The movie makes me sad.',
            verb: {
              base: 'make',
              s: 'makes'
            }
          },
          {
            ko: '사람들은 그를 천재라고 부른다.',
            answer: 'People call him a genius.'
          },
          {
            ko: '음악이 그녀를 편안하게 만든다.',
            answer: 'Music makes her calm.',
            verb: {
              base: 'make',
              s: 'makes'
            }
          },
          {
            ko: '사람들은 그녀를 여왕이라 부른다.',
            answer: 'People call her a queen.'
          }
        ],
        similar: [
          {
            ko: '그 책이 나를 지루하게 만든다.',
            answer: 'The book makes me bored.',
            verb: {
              base: 'make',
              s: 'makes'
            }
          },
          {
            ko: '우리는 그를 대장이라고 부른다.',
            answer: 'We call him the boss.'
          }
        ],
      },
      {
        id: 'L1-6',
        title: '~이 있다',
        tagline: '무엇이 (어디에) 있다를 말해요',
        skeleton: 'There is/are + 무엇이 + 어디에',
        focus: 'There is / There are 구문',
        card: {
          achieve: '이걸 익히면 "무엇이 (어디에) 있다"(책상 위에 사과가 있다)를 말할 수 있어요.',
          howto: '한국어 "~이 있다"는 영어에서 There is / There are로 시작해요. 순서가 완전히 뒤집혀요. 하나면 There is, 여럿이면 There are. 순서 : There is/are → 무엇이 → 어디에.',
          demo: {
            ko: [
              '탁자 위에',
              '사과가',
              '있다'
            ],
            steps: [
              {
                q: '있다?',
                ko: '있다',
                en: 'There is'
              },
              {
                q: '무엇이?',
                ko: '사과가',
                en: 'an apple'
              },
              {
                q: '어디에?',
                ko: '탁자 위에',
                en: 'on the table'
              }
            ],
            answer: 'There is an apple on the table.',
            tip: '한국어 끝에 있던 \'있다\'를 영어에선 맨 앞으로 끌어온다.'
          }
        },
        practice: [
          {
            ko: '방에 침대가 있다',
            steps: [
              {
                q: '있다?',
                en: 'There is',
                hint: '하나 → is'
              },
              {
                q: '무엇이?',
                en: 'a bed'
              },
              {
                q: '어디에?',
                en: 'in the room'
              }
            ],
            answer: 'There is a bed in the room.'
          },
          {
            ko: '책상 위에 책 두 권이 있다',
            steps: [
              {
                q: '있다?',
                en: 'There are',
                hint: '둘 → are'
              },
              {
                q: '무엇이?',
                en: 'two books'
              },
              {
                q: '어디에?',
                en: 'on the desk'
              }
            ],
            answer: 'There are two books on the desk.'
          },
          {
            ko: '접시에 사과가 있다',
            steps: [
              {
                q: '있다?',
                en: 'There is',
                hint: '하나 → is'
              },
              {
                q: '무엇이?',
                en: 'an apple'
              },
              {
                q: '어디에?',
                en: 'on the plate'
              }
            ],
            answer: 'There is an apple on the plate.'
          }
        ],
        challenges: [
          {
            ko: '교실에 학생들이 있다.',
            answer: 'There are students in the classroom.',
            chunks: [
              {
                lab: '있다',
                ko: '있다 → 여럿이니 are'
              },
              {
                lab: '무엇이',
                ko: '학생들이'
              },
              {
                lab: '어디에',
                ko: '교실에'
              }
            ]
          },
          {
            ko: '방에 침대가 있다.',
            answer: 'There is a bed in the room.'
          },
          {
            ko: '책상 위에 책 두 권이 있다.',
            answer: 'There are two books on the desk.'
          },
          {
            ko: '벽에 시계가 있다.',
            answer: 'There is a clock on the wall.'
          },
          {
            ko: '공원에 나무가 있다.',
            answer: 'There is a tree in the park.'
          }
        ],
        similar: [
          {
            ko: '가방 안에 펜이 있다.',
            answer: 'There is a pen in the bag.'
          },
          {
            ko: '하늘에 별들이 있다.',
            answer: 'There are stars in the sky.'
          }
        ],
      },
    ],

    /* ── L1 총정리 시험 : 6골격 섞기 / 10문제 중 8개 이상 → L2 해금 ── */
    exam: {
      passScore: RULES.EXAM_PASS,   // 18개 이상 (2개 이하 오답)
      total: RULES.EXAM_TOTAL,      // 20문제
      // 아래 questions[]는 AI 실패 시 폴백용. 실전에선 AI가 매번 20문제 새로 출제.
      questions: [
        { ko: '새가 난다.',                     answer: 'The bird flies.',              from: 'L1-1', verb: { base: 'fly', s: 'flies' } },
        { ko: '그녀는 친절하다.',               answer: 'She is kind.',                 from: 'L1-2' },
        { ko: '나는 음악을 좋아한다.',          answer: 'I like music.',                from: 'L1-3' },
        { ko: '선생님이 우리에게 숙제를 주신다.', answer: 'The teacher gives us homework.', from: 'L1-4', verb: { base: 'give', s: 'gives' } },
        { ko: '그 소식이 나를 놀라게 만든다.',  answer: 'The news makes me surprised.', from: 'L1-5', verb: { base: 'make', s: 'makes' } },
        { ko: '공원에 나무가 있다.',            answer: 'There is a tree in the park.', from: 'L1-6' },
        { ko: '그가 달린다.',                   answer: 'He runs.',                     from: 'L1-1', verb: { base: 'run', s: 'runs' } },
        { ko: '그들은 바쁘다.',                 answer: 'They are busy.',               from: 'L1-2' },
        { ko: '우리는 영화를 본다.',            answer: 'We watch movies.',             from: 'L1-3' },
        { ko: '그가 나에게 공을 준다.',         answer: 'He gives me a ball.',          from: 'L1-4', verb: { base: 'give', s: 'gives' } },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════════════
   * LEVEL 2 ~ 12 · 골격만 (집필 대기)
   * 위 L1과 같은 스키마로 card / practice / challenges / similar / exam 을
   * 채워 넣으면 된다. isLevelReady(n) 이 집필 완료 여부를 알려준다.
   * ════════════════════════════════════════════════════════════════════ */

  {
    level: 2, threshold: 1, stage: '기초', bookLabel: '1차 임계점',
    theme: { ink:'#241f3d', accent:'#4f46e5', soft:'#eef0ff' },
    title: '기본 시제', skill: '시제 쌉가능',
    skillDesc: 'L2 클리어! 이제 같은 문장을 늘·어제·내일·지금으로 시간을 바꿔 말할 수 있어요. 다음은 조동사로 뉘앙스를 얹을 차례예요.',
    nextHint: 'LEVEL 3 · 기본 조동사',
    units: [

      /* ---------------------------------------------------------------- */
      {
        id: 'L2-1',
        title: '현재 (늘·습관)',
        tagline: '현재시제 — 늘·항상·매일 하는 일을 말해요',
        skeleton: '누가 + 늘 한다',
        focus: '단순현재 / 반복·습관 · 3인칭 -s',
        card: {
          achieve: '이걸 익히면 "늘·항상·매일 하는 일"을 영어로 말할 수 있어요. 습관, 사실, 반복되는 일이 여기예요.',
          howto: '늘 하는 일은 동사를 <b>그대로(현재형)</b> 써요. L1에서 배운 그대로, 누가가 <b>한 명·하나</b>면 동사에 <b>-s</b>를 붙여요. "매일 / 항상 / 보통" 같은 말이 붙으면 거의 현재형이에요.',
          demo: {
            ko: [
              '나는',
              '매일',
              '학교에 간다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '나는',
                en: 'I'
              },
              {
                q: '한다?',
                ko: '간다 (늘)',
                en: 'go'
              },
              {
                q: '어디에?',
                ko: '학교에',
                en: 'to school'
              },
              {
                q: '언제?',
                ko: '매일',
                en: 'every day'
              }
            ],
            answer: 'I go to school every day.',
            tip: '늘 하는 일이라 go 그대로. "매일"은 맨 뒤에.'
          }
        },
        practice: [
          {
            ko: '그녀는 매일 운동한다',
            steps: [
              {
                q: '누가?',
                en: 'She'
              },
              {
                q: '한다?',
                en: 'exercises',
                hint: '한 명 → exercises'
              },
              {
                q: '언제?',
                en: 'every day'
              }
            ],
            answer: 'She exercises every day.'
          },
          {
            ko: '우리는 보통 집에서 저녁을 먹는다',
            steps: [
              {
                q: '누가?',
                en: 'We'
              },
              {
                q: '한다?',
                en: 'eat',
                hint: '여럿 → 그대로 eat'
              },
              {
                q: '무엇을?',
                en: 'dinner'
              },
              {
                q: '어디서?',
                en: 'at home'
              }
            ],
            answer: 'We usually eat dinner at home.'
          },
          {
            ko: '그는 항상 늦게 잔다',
            steps: [
              {
                q: '누가?',
                en: 'He'
              },
              {
                q: '한다?',
                en: 'sleeps',
                hint: '한 명 → sleeps'
              },
              {
                q: '언제?',
                en: 'late'
              }
            ],
            answer: 'He always sleeps late.'
          }
        ],
        challenges: [
          {
            ko: '나는 매일 아침 커피를 마신다.',
            answer: 'I drink coffee every morning.',
            chunks: [
              {
                lab: '누가',
                ko: '나는'
              },
              {
                lab: '한다',
                ko: '마신다 (늘)'
              },
              {
                lab: '무엇을',
                ko: '커피를'
              },
              {
                lab: '언제',
                ko: '매일 아침'
              }
            ]
          },
          {
            ko: '그는 항상 일찍 일어난다.',
            answer: 'He always gets up early.',
            verb: {
              base: 'get',
              s: 'gets'
            }
          },
          {
            ko: '그녀는 학교에서 영어를 가르친다.',
            answer: 'She teaches English at school.',
            verb: {
              base: 'teach',
              s: 'teaches'
            }
          },
          {
            ko: '나는 매일 물을 마신다.',
            answer: 'I drink water every day.'
          },
          {
            ko: '그는 보통 버스를 탄다.',
            answer: 'He usually takes the bus.',
            verb: {
              base: 'take',
              s: 'takes'
            }
          }
        ],
        similar: [
          {
            ko: '우리는 주말마다 축구를 한다.',
            answer: 'We play soccer every weekend.'
          },
          {
            ko: '그녀는 매일 책을 읽는다.',
            answer: 'She reads a book every day.',
            verb: {
              base: 'read',
              s: 'reads'
            }
          }
        ],
      },
      {
        id: 'L2-2',
        title: '과거',
        tagline: '과거시제 — 어제·아까·지난주에 한 일을 말해요',
        skeleton: '누가 + 했다',
        focus: '단순과거 / 규칙(-ed)·불규칙',
        card: {
          achieve: '이걸 익히면 "어제·아까·지난주에 한 일"을 영어로 말할 수 있어요. 이미 끝난 일이에요.',
          howto: '지난 일은 동사를 <b>과거형</b>으로 바꿔요. 대부분은 뒤에 <b>-ed</b>를 붙여요 (play→played). 그런데 자주 쓰는 동사는 모양이 <b>통째로 바뀌어요</b> (go→went, eat→ate). 이건 규칙이 없어서 <b>그냥 외우는</b> 거예요. 과거엔 누가가 누구든 -s 걱정 없어요.',
          demo: {
            ko: [
              '나는',
              '어제',
              '축구를 했다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '나는',
                en: 'I'
              },
              {
                q: '했다?',
                ko: '했다',
                en: 'played'
              },
              {
                q: '무엇을?',
                ko: '축구를',
                en: 'soccer'
              },
              {
                q: '언제?',
                ko: '어제',
                en: 'yesterday'
              }
            ],
            answer: 'I played soccer yesterday.',
            tip: 'play는 규칙 → played. "어제"가 있으면 거의 과거형.'
          }
        },
        practice: [
          {
            ko: '나는 어제 영화를 봤다',
            steps: [
              {
                q: '누가?',
                en: 'I'
              },
              {
                q: '했다?',
                en: 'watched',
                hint: '규칙 → watch+ed'
              },
              {
                q: '무엇을?',
                en: 'a movie'
              },
              {
                q: '언제?',
                en: 'yesterday'
              }
            ],
            answer: 'I watched a movie yesterday.'
          },
          {
            ko: '그녀는 지난주에 서울에 갔다',
            steps: [
              {
                q: '누가?',
                en: 'She'
              },
              {
                q: '했다?',
                en: 'went',
                hint: '불규칙! go → went (외우기)'
              },
              {
                q: '어디에?',
                en: 'to Seoul'
              },
              {
                q: '언제?',
                en: 'last week'
              }
            ],
            answer: 'She went to Seoul last week.'
          },
          {
            ko: '우리는 어제 축구를 했다',
            steps: [
              {
                q: '누가?',
                en: 'We'
              },
              {
                q: '했다?',
                en: 'played',
                hint: '규칙 → play+ed'
              },
              {
                q: '무엇을?',
                en: 'soccer'
              },
              {
                q: '언제?',
                en: 'yesterday'
              }
            ],
            answer: 'We played soccer yesterday.'
          }
        ],
        challenges: [
          {
            ko: '나는 어제 방을 청소했다.',
            answer: 'I cleaned my room yesterday.',
            chunks: [
              {
                lab: '누가',
                ko: '나는'
              },
              {
                lab: '했다',
                ko: '청소했다 → clean+ed'
              },
              {
                lab: '무엇을',
                ko: '방을'
              },
              {
                lab: '언제',
                ko: '어제'
              }
            ]
          },
          {
            ko: '우리는 아침을 먹었다.',
            answer: 'We ate breakfast.',
            past: {
              base: 'eat',
              ed: 'ate'
            }
          },
          {
            ko: '그는 그 책을 읽었다.',
            answer: 'He read the book.',
            note: 'read 과거형은 철자는 같고 발음만 달라져요'
          },
          {
            ko: '나는 손을 씻었다.',
            answer: 'I washed my hands.'
          },
          {
            ko: '그녀는 편지를 썼다.',
            answer: 'She wrote a letter.',
            past: {
              base: 'write',
              ed: 'wrote'
            }
          }
        ],
        similar: [
          {
            ko: '그들은 집에 머물렀다.',
            answer: 'They stayed home.'
          },
          {
            ko: '나는 어제 그를 만났다.',
            answer: 'I met him yesterday.',
            past: {
              base: 'meet',
              ed: 'met'
            }
          }
        ],
      },
      {
        id: 'L2-3',
        title: '미래 (will · be going to)',
        tagline: '미래시제 — 내일·다음에 할 일을 말해요',
        skeleton: '누가 + 할 것이다',
        focus: '미래 표현 / will · be going to',
        card: {
          achieve: '이걸 익히면 "앞으로 할 일·계획"을 영어로 말할 수 있어요. 내일, 다음에 할 일이에요.',
          howto: '앞으로 할 일은 동사 앞에 <b>will</b>을 붙이면 끝이에요. will 뒤엔 동사를 <b>그대로</b> 써요 (will go, will eat). 이미 정해둔 계획이면 <b>be going to</b>도 써요 (I am going to ~). 둘 다 "할 거다"예요.',
          demo: {
            ko: [
              '나는',
              '내일',
              '그를 만날 것이다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '나는',
                en: 'I'
              },
              {
                q: '할 것이다?',
                ko: '만날 것이다',
                en: 'will meet'
              },
              {
                q: '누구를?',
                ko: '그를',
                en: 'him'
              },
              {
                q: '언제?',
                ko: '내일',
                en: 'tomorrow'
              }
            ],
            answer: 'I will meet him tomorrow.',
            tip: 'will 뒤엔 동사 그대로 meet. (will meets 아님!)'
          }
        },
        practice: [
          {
            ko: '나는 내일 도서관에 갈 것이다',
            steps: [
              {
                q: '누가?',
                en: 'I'
              },
              {
                q: '할 것이다?',
                en: 'will go',
                hint: 'will + 동사 그대로 go'
              },
              {
                q: '어디에?',
                en: 'to the library'
              },
              {
                q: '언제?',
                en: 'tomorrow'
              }
            ],
            answer: 'I will go to the library tomorrow.'
          },
          {
            ko: '우리는 주말에 영화를 볼 것이다',
            steps: [
              {
                q: '누가?',
                en: 'We'
              },
              {
                q: '할 것이다?',
                en: 'will watch',
                hint: 'will + watch'
              },
              {
                q: '무엇을?',
                en: 'a movie'
              },
              {
                q: '언제?',
                en: 'this weekend'
              }
            ],
            answer: 'We will watch a movie this weekend.'
          },
          {
            ko: '그녀는 내일 나를 도와줄 것이다',
            steps: [
              {
                q: '누가?',
                en: 'She'
              },
              {
                q: '할 것이다?',
                en: 'will help',
                hint: 'will + help (will helps 아님)'
              },
              {
                q: '누구를?',
                en: 'me'
              },
              {
                q: '언제?',
                en: 'tomorrow'
              }
            ],
            answer: 'She will help me tomorrow.'
          }
        ],
        challenges: [
          {
            ko: '나는 내일 그녀에게 전화할 것이다.',
            answer: 'I will call her tomorrow.',
            chunks: [
              {
                lab: '누가',
                ko: '나는'
              },
              {
                lab: '할 것이다',
                ko: '전화할 것이다 → will call'
              },
              {
                lab: '누구에게',
                ko: '그녀에게'
              },
              {
                lab: '언제',
                ko: '내일'
              }
            ]
          },
          {
            ko: '그는 다음 주에 시험을 볼 것이다.',
            answer: 'He will take a test next week.'
          },
          {
            ko: '우리는 파티를 열 것이다.',
            answer: 'We will have a party.'
          },
          {
            ko: '나는 열심히 공부할 것이다.',
            answer: 'I will study hard.'
          },
          {
            ko: '그녀는 곧 도착할 것이다.',
            answer: 'She will arrive soon.'
          }
        ],
        similar: [
          {
            ko: '우리는 내년에 일본에 갈 것이다.',
            answer: 'We will go to Japan next year.'
          },
          {
            ko: '나는 그것을 끝낼 것이다.',
            answer: 'I will finish it.'
          }
        ],
      },
      {
        id: 'L2-4',
        title: '현재진행 (지금 ~하는 중)',
        tagline: '현재진행 — 바로 지금 하고 있는 일을 말해요',
        skeleton: '누가 + 하고 있다',
        focus: '현재진행 / be + -ing',
        card: {
          achieve: '이걸 익히면 "바로 지금 하고 있는 일"을 영어로 말할 수 있어요. 말하는 이 순간 진행 중인 일이에요.',
          howto: '지금 하는 중인 일은 <b>be동사(am·is·are) + 동사-ing</b>로 써요. "지금 / 현재"라는 뜻이 담겨요. am/is/are는 L1에서 배운 그대로 누가에 맞춰 골라요.',
          demo: {
            ko: [
              '나는',
              '지금',
              '숙제를 하고 있다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '나는',
                en: 'I'
              },
              {
                q: '하고 있다?',
                ko: '하고 있다 (지금)',
                en: 'am doing'
              },
              {
                q: '무엇을?',
                ko: '숙제를',
                en: 'my homework'
              }
            ],
            answer: 'I am doing my homework.',
            tip: 'am + doing. "하고 있다"엔 be동사가 꼭 필요해요.'
          }
        },
        practice: [
          {
            ko: '그녀는 지금 음악을 듣고 있다',
            steps: [
              {
                q: '누가?',
                en: 'She'
              },
              {
                q: '하고 있다?',
                en: 'is listening',
                hint: '한 명 → is + listening'
              },
              {
                q: '무엇을?',
                en: 'to music'
              }
            ],
            answer: 'She is listening to music.'
          },
          {
            ko: '아이들이 밖에서 놀고 있다',
            steps: [
              {
                q: '누가?',
                en: 'The children'
              },
              {
                q: '하고 있다?',
                en: 'are playing',
                hint: '여럿 → are + playing'
              },
              {
                q: '어디서?',
                en: 'outside'
              }
            ],
            answer: 'The children are playing outside.'
          },
          {
            ko: '나는 지금 점심을 먹고 있다',
            steps: [
              {
                q: '누가?',
                en: 'I'
              },
              {
                q: '하고 있다?',
                en: 'am eating',
                hint: 'I → am + eating'
              },
              {
                q: '무엇을?',
                en: 'lunch'
              }
            ],
            answer: 'I am eating lunch now.'
          }
        ],
        challenges: [
          {
            ko: '나는 지금 책을 읽고 있다.',
            answer: 'I am reading a book.',
            chunks: [
              {
                lab: '누가',
                ko: '나는'
              },
              {
                lab: '하고 있다',
                ko: '읽고 있다 → am reading'
              },
              {
                lab: '무엇을',
                ko: '책을'
              }
            ]
          },
          {
            ko: '그는 지금 자고 있다.',
            answer: 'He is sleeping.'
          },
          {
            ko: '우리는 저녁을 만들고 있다.',
            answer: 'We are making dinner.'
          },
          {
            ko: '그녀는 울고 있다.',
            answer: 'She is crying.'
          },
          {
            ko: '그들은 축구를 하고 있다.',
            answer: 'They are playing soccer.'
          }
        ],
        similar: [
          {
            ko: '비가 오고 있다.',
            answer: 'It is raining.'
          },
          {
            ko: '나는 지금 공부하고 있다.',
            answer: 'I am studying now.'
          }
        ],
      },
      {
        id: 'L2-5',
        title: '과거진행 (그때 ~하는 중이었다)',
        tagline: '과거진행 — 그때 하고 있던 일을 말해요',
        skeleton: '누가 + 하고 있었다',
        focus: '과거진행 / was·were + -ing',
        card: {
          achieve: '이걸 익히면 "과거의 어느 순간에 하고 있던 일"을 영어로 말할 수 있어요. 어제 그때 진행 중이던 일이에요.',
          howto: '현재진행의 be동사만 <b>과거(was·were)</b>로 바꾸면 돼요. <b>was/were + 동사-ing</b>. 한 명·하나면 <b>was</b>, 여럿이면 <b>were</b>. "그때 / ~할 때"와 자주 같이 나와요.',
          demo: {
            ko: [
              '나는',
              '그때',
              'TV를 보고 있었다'
            ],
            steps: [
              {
                q: '누가?',
                ko: '나는',
                en: 'I'
              },
              {
                q: '하고 있었다?',
                ko: '보고 있었다 (그때)',
                en: 'was watching'
              },
              {
                q: '무엇을?',
                ko: 'TV를',
                en: 'TV'
              }
            ],
            answer: 'I was watching TV.',
            tip: 'am watching → was watching. be동사만 과거로!'
          }
        },
        practice: [
          {
            ko: '그녀는 그때 요리하고 있었다',
            steps: [
              {
                q: '누가?',
                en: 'She'
              },
              {
                q: '하고 있었다?',
                en: 'was cooking',
                hint: '한 명 → was + cooking'
              },
              {
                q: '언제?',
                en: 'then'
              }
            ],
            answer: 'She was cooking then.'
          },
          {
            ko: '우리는 공원에서 걷고 있었다',
            steps: [
              {
                q: '누가?',
                en: 'We'
              },
              {
                q: '하고 있었다?',
                en: 'were walking',
                hint: '여럿 → were + walking'
              },
              {
                q: '어디서?',
                en: 'in the park'
              }
            ],
            answer: 'We were walking in the park.'
          },
          {
            ko: '나는 그때 숙제를 하고 있었다',
            steps: [
              {
                q: '누가?',
                en: 'I'
              },
              {
                q: '하고 있었다?',
                en: 'was doing',
                hint: 'I → was + doing'
              },
              {
                q: '무엇을?',
                en: 'my homework'
              }
            ],
            answer: 'I was doing my homework then.'
          }
        ],
        challenges: [
          {
            ko: '나는 그때 음악을 듣고 있었다.',
            answer: 'I was listening to music.',
            chunks: [
              {
                lab: '누가',
                ko: '나는'
              },
              {
                lab: '하고 있었다',
                ko: '듣고 있었다 → was listening'
              },
              {
                lab: '무엇을',
                ko: '음악을'
              }
            ]
          },
          {
            ko: '그는 책을 읽고 있었다.',
            answer: 'He was reading a book.'
          },
          {
            ko: '아이들이 자고 있었다.',
            answer: 'The children were sleeping.'
          },
          {
            ko: '그녀는 전화하고 있었다.',
            answer: 'She was talking on the phone.'
          },
          {
            ko: '그들은 게임을 하고 있었다.',
            answer: 'They were playing games.'
          }
        ],
        similar: [
          {
            ko: '비가 오고 있었다.',
            answer: 'It was raining.'
          },
          {
            ko: '우리는 TV를 보고 있었다.',
            answer: 'We were watching TV.'
          }
        ],
      },
    ],

    /* ── L2 총정리 : 5시제 섞기 / 10문제 중 8개 → L3 해금 ── */
    exam: {
      passScore: RULES.EXAM_PASS,   // 18개 이상 (2개 이하 오답)
      total: RULES.EXAM_TOTAL,      // 20문제
      // 아래 questions[]는 AI 실패 시 폴백용. 실전에선 AI가 매번 20문제 새로 출제.
      questions: [
        { ko:'나는 매일 학교에 간다.',        answer:'I go to school every day.',      from:'L2-1', verb:{ base:'go', s:'goes' } },
        { ko:'그는 항상 일찍 일어난다.',      answer:'He always gets up early.',       from:'L2-1', verb:{ base:'get', s:'gets' } },
        { ko:'나는 어제 축구를 했다.',        answer:'I played soccer yesterday.',     from:'L2-2' },
        { ko:'그녀는 지난주에 서울에 갔다.',  answer:'She went to Seoul last week.',   from:'L2-2', past:{ base:'go', ed:'went' } },
        { ko:'나는 내일 그를 만날 것이다.',   answer:'I will meet him tomorrow.',      from:'L2-3' },
        { ko:'우리는 파티를 열 것이다.',      answer:'We will have a party.',          from:'L2-3' },
        { ko:'나는 지금 책을 읽고 있다.',     answer:'I am reading a book.',           from:'L2-4' },
        { ko:'그는 지금 자고 있다.',          answer:'He is sleeping.',                from:'L2-4' },
        { ko:'나는 그때 TV를 보고 있었다.',   answer:'I was watching TV.',             from:'L2-5' },
        { ko:'아이들이 자고 있었다.',         answer:'The children were sleeping.',    from:'L2-5' },
      ],
    },
  },
  {
    level: 3, threshold: 1, stage: '기초', bookLabel: '1차 임계점',
    theme: { ink:'#241f3d', accent:'#4f46e5', soft:'#eef0ff' },
    title: '기본 조동사', skill: '표현 쌉가능',
    skillDesc: 'L3 클리어! 이제 "할 수 있다·해야 한다·안 한다·하니?"까지 말할 수 있어요. 다음은 문장을 길게 늘이고 잇는 법이에요.',
    nextHint: 'LEVEL 4 · 늘이고 잇기',
    units: [

      /* ---------------------------------------------------------------- */
      {
        id: 'L3-1',
        title: 'can (할 수 있다)',
        tagline: '능력·가능 — 할 수 있는 일을 말해요',
        skeleton: '누가 + can + 한다',
        focus: 'can / 능력·가능 · 뒤 동사원형',
        card: {
          achieve: '이걸 익히면 "~할 수 있다"를 영어로 말할 수 있어요. 할 줄 아는 것, 가능한 것이에요.',
          howto: '동사 앞에 <b>can</b>만 넣으면 "할 수 있다"가 돼요. 제일 중요한 규칙 하나 — <b>can 뒤 동사는 항상 그대로(원형)</b>예요. 누가가 한 명이어도 <b>-s를 붙이지 않아요</b>. (can swims ❌ → can swim ⭕)',
          demo: {
            ko: ['그녀는', '수영을', '할 수 있다'],
            steps: [
              { q: '누가?',        ko: '그녀는',      en: 'She' },
              { q: '할 수 있다?',  ko: '할 수 있다',  en: 'can swim' },
            ],
            answer: 'She can swim.',
            tip: 'can 뒤엔 swim 그대로. (한 명이어도 can swims 아님!)',
          },
        },
        practice: [
          { ko: '나는 피아노를 칠 수 있다',
            steps: [{ q:'누가?', en:'I' }, { q:'할 수 있다?', en:'can play', hint:'can + 동사 그대로 play' }, { q:'무엇을?', en:'the piano' }],
            answer: 'I can play the piano.' },
          { ko: '그는 빨리 달릴 수 있다',
            steps: [{ q:'누가?', en:'He' }, { q:'할 수 있다?', en:'can run', hint:'한 명이어도 can run (can runs 아님)' }, { q:'어떻게?', en:'fast' }],
            answer: 'He can run fast.' },
          { ko: '우리는 영어를 말할 수 있다',
            steps: [{ q:'누가?', en:'We' }, { q:'할 수 있다?', en:'can speak', hint:'can + speak' }, { q:'무엇을?', en:'English' }],
            answer: 'We can speak English.' },
        ],
        challenges: [
          { ko:'나는 자전거를 탈 수 있다.', answer:'I can ride a bike.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'할 수 있다', ko:'탈 수 있다 → can ride' }, { lab:'무엇을', ko:'자전거를' }] },
          { ko:'그녀는 중국어를 할 수 있다.', answer:'She can speak Chinese.' },
          { ko:'그는 높이 뛸 수 있다.', answer:'He can jump high.' },
          { ko:'우리는 그것을 끝낼 수 있다.', answer:'We can finish it.' },
          { ko:'너는 지금 갈 수 있다.', answer:'You can go now.' },
        ],
        similar: [
          { ko:'나는 기타를 칠 수 있다.', answer:'I can play the guitar.' },
          { ko:'그들은 수영을 할 수 있다.', answer:'They can swim.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L3-2',
        title: 'should · had better',
        tagline: '충고 — 하는 게 좋다고 말해요',
        skeleton: '누가 + should + 한다',
        focus: 'should · had better / 충고 · 뒤 동사원형',
        card: {
          achieve: '이걸 익히면 "~하는 게 좋겠다"는 충고를 영어로 말할 수 있어요. 권하거나 조언할 때예요.',
          howto: '동사 앞에 <b>should</b>를 넣으면 "~하는 게 좋다"예요. 더 센 충고("안 그러면 큰일 나")는 <b>had better</b>를 써요. 둘 다 <b>뒤 동사는 원형 그대로</b>예요.',
          demo: {
            ko: ['너는', '좀 쉬는', '게 좋겠다'],
            steps: [
              { q: '누가?',       ko: '너는',       en: 'You' },
              { q: '하는 게 좋다?', ko: '쉬는 게 좋다', en: 'should rest' },
            ],
            answer: 'You should rest.',
            tip: 'should 뒤엔 rest 그대로. "~하는 게 좋겠어"는 대부분 should.',
          },
        },
        practice: [
          { ko: '너는 물을 많이 마시는 게 좋겠다',
            steps: [{ q:'누가?', en:'You' }, { q:'하는 게 좋다?', en:'should drink', hint:'should + 동사 그대로 drink' }, { q:'무엇을?', en:'a lot of water' }],
            answer: 'You should drink a lot of water.' },
          { ko: '우리는 일찍 자는 게 좋겠다',
            steps: [{ q:'누가?', en:'We' }, { q:'하는 게 좋다?', en:'should go', hint:'should + go' }, { q:'어디에?', en:'to bed early' }],
            answer: 'We should go to bed early.' },
          { ko: '너는 지금 떠나는 게 좋겠다',
            steps: [{ q:'누가?', en:'You' }, { q:'하는 게 좋다?', en:'had better leave', hint:'센 충고 → had better + leave' }, { q:'언제?', en:'now' }],
            answer: 'You had better leave now.' },
        ],
        challenges: [
          { ko:'너는 좀 쉬는 게 좋겠다.', answer:'You should take a rest.',
            chunks:[{ lab:'누가', ko:'너는' }, { lab:'하는 게 좋다', ko:'쉬는 게 좋다 → should take' }, { lab:'무엇을', ko:'휴식을' }] },
          { ko:'우리는 열심히 공부하는 게 좋겠다.', answer:'We should study hard.' },
          { ko:'너는 의사를 만나보는 게 좋겠다.', answer:'You should see a doctor.' },
          { ko:'그는 좀 더 조심하는 게 좋겠다.', answer:'He should be more careful.' },
          { ko:'너는 지금 자는 게 좋겠다.', answer:'You had better sleep now.' },
        ],
        similar: [
          { ko:'너는 아침을 먹는 게 좋겠다.', answer:'You should eat breakfast.' },
          { ko:'우리는 서두르는 게 좋겠다.', answer:'We had better hurry.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L3-3',
        title: 'have to · must (해야 한다)',
        tagline: '의무 — 꼭 해야 하는 일을 말해요',
        skeleton: '누가 + have to / must + 한다',
        focus: 'have to · must / 의무 · 뒤 동사원형',
        card: {
          achieve: '이걸 익히면 "꼭 ~해야 한다"는 의무를 영어로 말할 수 있어요. 반드시 해야 하는 일이에요.',
          howto: '"해야 한다"는 <b>have to</b> 또는 <b>must</b>를 동사 앞에 써요. 한 명·하나면 <b>has to</b>로 바뀌어요 (must는 안 바뀜). 뒤 동사는 <b>원형 그대로</b>예요.',
          demo: {
            ko: ['나는', '지금', '가야 한다'],
            steps: [
              { q: '누가?',      ko: '나는',    en: 'I' },
              { q: '해야 한다?', ko: '가야 한다', en: 'have to go' },
              { q: '언제?',      ko: '지금',    en: 'now' },
            ],
            answer: 'I have to go now.',
            tip: 'have to + go 그대로. 한 명이면 has to (He has to go).',
          },
        },
        practice: [
          { ko: '나는 숙제를 해야 한다',
            steps: [{ q:'누가?', en:'I' }, { q:'해야 한다?', en:'have to do', hint:'have to + 동사 그대로 do' }, { q:'무엇을?', en:'my homework' }],
            answer: 'I have to do my homework.' },
          { ko: '그는 일찍 일어나야 한다',
            steps: [{ q:'누가?', en:'He' }, { q:'해야 한다?', en:'has to get up', hint:'한 명 → has to' }, { q:'언제?', en:'early' }],
            answer: 'He has to get up early.' },
          { ko: '너는 규칙을 지켜야 한다',
            steps: [{ q:'누가?', en:'You' }, { q:'해야 한다?', en:'must follow', hint:'must + 동사 그대로 (강한 의무)' }, { q:'무엇을?', en:'the rules' }],
            answer: 'You must follow the rules.' },
        ],
        challenges: [
          { ko:'나는 지금 집에 가야 한다.', answer:'I have to go home now.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'해야 한다', ko:'가야 한다 → have to go' }, { lab:'어디에', ko:'집에' }, { lab:'언제', ko:'지금' }] },
          { ko:'그녀는 열심히 일해야 한다.', answer:'She has to work hard.' },
          { ko:'우리는 서둘러야 한다.', answer:'We have to hurry.' },
          { ko:'너는 조용히 해야 한다.', answer:'You must be quiet.' },
          { ko:'그는 약을 먹어야 한다.', answer:'He has to take medicine.' },
        ],
        similar: [
          { ko:'나는 그것을 끝내야 한다.', answer:'I have to finish it.' },
          { ko:'너는 손을 씻어야 한다.', answer:'You must wash your hands.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L3-4',
        title: '부정문 (안 한다)',
        tagline: '부정문 — 안 하는 것을 말해요',
        skeleton: '누가 + don\'t/doesn\'t + 한다',
        focus: '부정문 / don\'t · doesn\'t · didn\'t',
        card: {
          achieve: '이걸 익히면 "~하지 않는다"를 영어로 말할 수 있어요. 안 하는 것, 아닌 것이에요.',
          howto: '동사 앞에 <b>don\'t</b>를 넣으면 "안 한다"예요. 한 명·하나면 <b>doesn\'t</b>, 지난 일이면 <b>didn\'t</b>. 중요 규칙 — <b>don\'t/doesn\'t/didn\'t 뒤 동사는 원형 그대로</b>예요. (doesn\'t likes ❌ → doesn\'t like ⭕)',
          demo: {
            ko: ['그는', '커피를', '안 마신다'],
            steps: [
              { q: '누가?',      ko: '그는',     en: 'He' },
              { q: '안 한다?',   ko: '안 마신다', en: "doesn't drink" },
              { q: '무엇을?',    ko: '커피를',   en: 'coffee' },
            ],
            answer: "He doesn't drink coffee.",
            tip: '한 명이라 doesn\'t. 뒤엔 drink 그대로 (drinks 아님!).',
          },
        },
        practice: [
          { ko: '나는 고기를 안 먹는다',
            steps: [{ q:'누가?', en:'I' }, { q:'안 한다?', en:"don't eat", hint:"I·여럿 → don't + 동사원형" }, { q:'무엇을?', en:'meat' }],
            answer: "I don't eat meat." },
          { ko: '그녀는 TV를 안 본다',
            steps: [{ q:'누가?', en:'She' }, { q:'안 한다?', en:"doesn't watch", hint:"한 명 → doesn't + watch 그대로" }, { q:'무엇을?', en:'TV' }],
            answer: "She doesn't watch TV." },
          { ko: '우리는 어제 안 갔다',
            steps: [{ q:'누가?', en:'We' }, { q:'안 했다?', en:"didn't go", hint:"과거 → didn't + go 그대로" }, { q:'언제?', en:'yesterday' }],
            answer: "We didn't go yesterday." },
        ],
        challenges: [
          { ko:'나는 우유를 안 좋아한다.', answer:"I don't like milk.",
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'안 한다', ko:'안 좋아한다 → don\'t like' }, { lab:'무엇을', ko:'우유를' }] },
          { ko:'그는 담배를 안 피운다.', answer:"He doesn't smoke." },
          { ko:'그녀는 아침을 안 먹는다.', answer:"She doesn't eat breakfast." },
          { ko:'우리는 그것을 몰랐다.', answer:"We didn't know that." },
          { ko:'나는 축구를 안 한다.', answer:"I don't play soccer." },
        ],
        similar: [
          { ko:'그들은 영어를 안 쓴다.', answer:"They don't speak English." },
          { ko:'그는 어제 안 왔다.', answer:"He didn't come yesterday." },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L3-5',
        title: '의문문 (하니?)',
        tagline: '의문문 — 물어보는 말을 만들어요',
        skeleton: 'Do/Does + 누가 + 한다?',
        focus: '의문문 / Do · Does · Did',
        card: {
          achieve: '이걸 익히면 "~하니?"라고 영어로 물어볼 수 있어요. 질문을 만드는 거예요.',
          howto: '물어볼 땐 <b>Do</b>를 맨 앞에 꺼내요. 한 명·하나면 <b>Does</b>, 지난 일이면 <b>Did</b>. 순서가 뒤집혀요: <b>Do + 누가 + 동사원형?</b> 뒤 동사는 <b>원형 그대로</b>고, 끝에 물음표를 붙여요.',
          demo: {
            ko: ['너는', '커피를', '마시니?'],
            steps: [
              { q: '물어보기?', ko: '~하니 →',  en: 'Do' },
              { q: '누가?',     ko: '너는',     en: 'you' },
              { q: '한다?',     ko: '마시다',    en: 'drink' },
              { q: '무엇을?',   ko: '커피를',    en: 'coffee?' },
            ],
            answer: 'Do you drink coffee?',
            tip: 'Do가 맨 앞으로. 뒤엔 drink 그대로, 끝에 물음표!',
          },
        },
        practice: [
          { ko: '너는 영어를 하니?',
            steps: [{ q:'물어보기?', en:'Do' }, { q:'누가?', en:'you' }, { q:'한다?', en:'speak', hint:'Do + you + 동사원형' }, { q:'무엇을?', en:'English?' }],
            answer: 'Do you speak English?' },
          { ko: '그는 축구를 좋아하니?',
            steps: [{ q:'물어보기?', en:'Does', hint:'한 명 → Does' }, { q:'누가?', en:'he' }, { q:'한다?', en:'like', hint:'뒤 동사 원형 like (likes 아님)' }, { q:'무엇을?', en:'soccer?' }],
            answer: 'Does he like soccer?' },
          { ko: '너는 어제 그를 봤니?',
            steps: [{ q:'물어보기?', en:'Did', hint:'과거 → Did' }, { q:'누가?', en:'you' }, { q:'했니?', en:'see', hint:'Did + 동사원형 see' }, { q:'누구를?', en:'him?' }],
            answer: 'Did you see him?' },
        ],
        challenges: [
          { ko:'너는 우유를 좋아하니?', answer:'Do you like milk?',
            chunks:[{ lab:'물어보기', ko:'~하니 → Do' }, { lab:'누가', ko:'너는' }, { lab:'한다', ko:'좋아하다 → like' }, { lab:'무엇을', ko:'우유를?' }] },
          { ko:'그녀는 여기 사니?', answer:'Does she live here?' },
          { ko:'너는 그 답을 아니?', answer:'Do you know the answer?' },
          { ko:'그는 매일 운동하니?', answer:'Does he exercise every day?' },
          { ko:'너는 어제 공부했니?', answer:'Did you study yesterday?' },
        ],
        similar: [
          { ko:'너는 개를 키우니?', answer:'Do you have a dog?' },
          { ko:'그녀는 커피를 마시니?', answer:'Does she drink coffee?' },
        ],
      },
    ],

    /* ── L3 총정리 : 조동사·부정·의문 섞기 (AI가 20문제 새로 출제. 아래는 폴백) ── */
    exam: {
      passScore: RULES.EXAM_PASS,
      total: RULES.EXAM_TOTAL,
      questions: [
        { ko:'나는 자전거를 탈 수 있다.',       answer:'I can ride a bike.',        from:'L3-1' },
        { ko:'그녀는 중국어를 할 수 있다.',     answer:'She can speak Chinese.',    from:'L3-1' },
        { ko:'너는 좀 쉬는 게 좋겠다.',         answer:'You should take a rest.',   from:'L3-2' },
        { ko:'너는 의사를 만나보는 게 좋겠다.', answer:'You should see a doctor.',  from:'L3-2' },
        { ko:'나는 지금 가야 한다.',            answer:'I have to go now.',         from:'L3-3' },
        { ko:'그녀는 열심히 일해야 한다.',      answer:'She has to work hard.',     from:'L3-3' },
        { ko:'나는 우유를 안 좋아한다.',        answer:"I don't like milk.",        from:'L3-4' },
        { ko:'그는 담배를 안 피운다.',          answer:"He doesn't smoke.",         from:'L3-4' },
        { ko:'너는 영어를 하니?',               answer:'Do you speak English?',     from:'L3-5' },
        { ko:'그녀는 여기 사니?',               answer:'Does she live here?',       from:'L3-5' },
      ],
    },
  },
  {
    level: 4, threshold: 1, stage: '기초', bookLabel: '1차 임계점',
    theme: { ink:'#241f3d', accent:'#4f46e5', soft:'#eef0ff' },
    title: '늘이고 잇기', skill: '연결 쌉가능',
    skillDesc: '1차 임계점 완성! 이제 짧은 뼈대에 살을 붙이고 문장을 이어 긴 문장을 만들 수 있어요. "문장을 만들 수 있다"를 해냈어요. 다음은 문장을 정교하게 다듬는 2차 임계점이에요.',
    nextHint: 'LEVEL 5 · 시제 심화 (2차 임계점 시작)',
    units: [

      /* ---------------------------------------------------------------- */
      {
        id: 'L4-1',
        title: '형용사·부사로 꾸미기',
        tagline: '꾸미기 — 더 자세하게 말해요 (큰 개 · 빨리 달린다)',
        skeleton: '누가 + 한다  (+ 꾸밈말)',
        focus: '형용사(명사 꾸밈) · 부사(동사 꾸밈)',
        card: {
          achieve: '이걸 익히면 밋밋한 문장에 꾸밈말을 붙여 더 자세하게 말할 수 있어요. "개"가 아니라 "큰 개", "달린다"가 아니라 "빨리 달린다"처럼요.',
          howto: '명사(이름)를 꾸미는 말은 <b>명사 앞</b>에 붙여요 : a <b>big</b> dog (큰 개). 동사(한다)를 꾸미는 말은 보통 <b>동사 뒤·문장 끝</b>에 붙여요 : run <b>fast</b> (빨리 달린다). 뼈대는 그대로, 꾸밈말만 얹는 거예요.',
          demo: {
            ko: ['큰', '개가', '빨리', '달린다'],
            steps: [
              { q: '누가?',   ko: '개가 (큰)',   en: 'A big dog' },
              { q: '한다?',   ko: '달린다',      en: 'runs' },
              { q: '어떻게?', ko: '빨리',        en: 'fast' },
            ],
            answer: 'A big dog runs fast.',
            tip: '꾸밈말 big은 개 앞에, fast는 문장 끝에.',
          },
        },
        practice: [
          { ko: '예쁜 꽃이 정원에 있다',
            steps: [{ q:'있다?', en:'There is', hint:'하나 → is' }, { q:'무엇이?', en:'a pretty flower', hint:'꾸밈말 pretty는 꽃 앞에' }, { q:'어디에?', en:'in the garden' }],
            answer: 'There is a pretty flower in the garden.' },
          { ko: '그는 열심히 공부한다',
            steps: [{ q:'누가?', en:'He' }, { q:'한다?', en:'studies', hint:'한 명 → studies' }, { q:'어떻게?', en:'hard', hint:'꾸밈말 hard는 문장 끝에' }],
            answer: 'He studies hard.' },
          { ko: '나는 재미있는 책을 읽는다',
            steps: [{ q:'누가?', en:'I' }, { q:'한다?', en:'read' }, { q:'무엇을?', en:'an interesting book', hint:'꾸밈말 interesting은 책 앞에' }],
            answer: 'I read an interesting book.' },
        ],
        challenges: [
          { ko:'작은 고양이가 조용히 잔다.', answer:'A small cat sleeps quietly.',
            chunks:[{ lab:'누가', ko:'고양이가 (작은)' }, { lab:'한다', ko:'잔다' }, { lab:'어떻게', ko:'조용히' }] },
          { ko:'그녀는 아름다운 노래를 부른다.', answer:'She sings a beautiful song.' },
          { ko:'그는 천천히 걷는다.', answer:'He walks slowly.' },
          { ko:'나는 새 신발을 샀다.', answer:'I bought new shoes.' },
          { ko:'우리는 열심히 일한다.', answer:'We work hard.' },
        ],
        similar: [
          { ko:'큰 개가 크게 짖는다.', answer:'A big dog barks loudly.' },
          { ko:'그녀는 빨리 말한다.', answer:'She speaks fast.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L4-2',
        title: '전치사구 (언제·어디서)',
        tagline: '시간·장소 — 언제·어디서를 붙여요 (아침에 · 학교에서)',
        skeleton: '누가 + 한다  (+ 어디서 + 언제)',
        focus: '전치사구 / in·on·at (시간·장소)',
        card: {
          achieve: '이걸 익히면 "언제·어디서"를 문장에 붙일 수 있어요. "공부한다"가 아니라 "아침에 도서관에서 공부한다"처럼 구체적으로요.',
          howto: '시간·장소는 <b>in·on·at</b> 같은 말과 함께 <b>문장 뒤</b>에 붙여요. 보통 순서는 <b>어디서 → 언제</b>예요. in the morning(아침에), at school(학교에서), on Monday(월요일에). 뼈대 뒤에 덩어리로 이어 붙이는 거예요.',
          demo: {
            ko: ['나는', '아침에', '공원에서', '달린다'],
            steps: [
              { q: '누가?',   ko: '나는',     en: 'I' },
              { q: '한다?',   ko: '달린다',   en: 'run' },
              { q: '어디서?', ko: '공원에서', en: 'in the park' },
              { q: '언제?',   ko: '아침에',   en: 'in the morning' },
            ],
            answer: 'I run in the park in the morning.',
            tip: '어디서(공원에서) 먼저, 언제(아침에) 나중.',
          },
        },
        practice: [
          { ko: '우리는 학교에서 영어를 배운다',
            steps: [{ q:'누가?', en:'We' }, { q:'한다?', en:'learn' }, { q:'무엇을?', en:'English' }, { q:'어디서?', en:'at school', hint:'학교에서 → at school' }],
            answer: 'We learn English at school.' },
          { ko: '그는 밤에 일한다',
            steps: [{ q:'누가?', en:'He' }, { q:'한다?', en:'works', hint:'한 명 → works' }, { q:'언제?', en:'at night', hint:'밤에 → at night' }],
            answer: 'He works at night.' },
          { ko: '나는 월요일에 그를 만난다',
            steps: [{ q:'누가?', en:'I' }, { q:'한다?', en:'meet' }, { q:'누구를?', en:'him' }, { q:'언제?', en:'on Monday', hint:'월요일에 → on Monday' }],
            answer: 'I meet him on Monday.' },
        ],
        challenges: [
          { ko:'나는 아침에 학교에 간다.', answer:'I go to school in the morning.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'한다', ko:'간다' }, { lab:'어디에', ko:'학교에' }, { lab:'언제', ko:'아침에' }] },
          { ko:'그녀는 집에서 요리한다.', answer:'She cooks at home.' },
          { ko:'우리는 여름에 수영한다.', answer:'We swim in summer.' },
          { ko:'그는 도서관에서 공부한다.', answer:'He studies in the library.' },
          { ko:'나는 저녁에 TV를 본다.', answer:'I watch TV in the evening.' },
        ],
        similar: [
          { ko:'우리는 주말에 축구를 한다.', answer:'We play soccer on weekends.' },
          { ko:'그는 카페에서 커피를 마신다.', answer:'He drinks coffee at the cafe.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L4-3',
        title: 'and · but · so',
        tagline: '잇기 — 문장 두 개를 이어요 (그리고 · 그러나 · 그래서)',
        skeleton: '문장 + and/but/so + 문장',
        focus: '등위접속사 / and · but · so',
        card: {
          achieve: '이걸 익히면 문장 두 개를 하나로 이을 수 있어요. "나는 피곤하다. 나는 잔다" 대신 "나는 피곤해서 잔다"처럼요.',
          howto: '두 문장 사이에 이음말을 넣어요. <b>and</b>(그리고·나열), <b>but</b>(그러나·반대), <b>so</b>(그래서·결과). 각 문장은 <b>뼈대(누가 한다)를 그대로 갖춘 채</b> 이어져요.',
          demo: {
            ko: ['나는', '피곤하다', '그래서', '잔다'],
            steps: [
              { q: '문장 1',  ko: '나는 피곤하다', en: 'I am tired' },
              { q: '이음말?', ko: '그래서',        en: 'so' },
              { q: '문장 2',  ko: '나는 잔다',     en: 'I sleep' },
            ],
            answer: 'I am tired, so I sleep.',
            tip: 'so(그래서)로 두 문장을 이었어요. 각 문장은 뼈대를 그대로.',
          },
        },
        practice: [
          { ko: '나는 사과와 바나나를 좋아한다',
            steps: [{ q:'누가?', en:'I' }, { q:'한다?', en:'like' }, { q:'무엇을?', en:'apples and bananas', hint:'and로 둘을 나열' }],
            answer: 'I like apples and bananas.' },
          { ko: '그는 똑똑하지만 게으르다',
            steps: [{ q:'문장 1', en:'He is smart' }, { q:'이음말?', en:'but', hint:'반대 → but' }, { q:'문장 2', en:'he is lazy' }],
            answer: 'He is smart, but he is lazy.' },
          { ko: '비가 왔다 그래서 우리는 집에 있었다',
            steps: [{ q:'문장 1', en:'It rained' }, { q:'이음말?', en:'so', hint:'결과 → so' }, { q:'문장 2', en:'we stayed home' }],
            answer: 'It rained, so we stayed home.' },
        ],
        challenges: [
          { ko:'나는 배고파서 밥을 먹었다.', answer:'I was hungry, so I ate.',
            chunks:[{ lab:'문장 1', ko:'나는 배고팠다' }, { lab:'이음말', ko:'그래서 → so' }, { lab:'문장 2', ko:'나는 먹었다' }] },
          { ko:'그녀는 노래하고 춤춘다.', answer:'She sings and dances.' },
          { ko:'나는 열심히 공부했지만 시험에 떨어졌다.', answer:'I studied hard, but I failed the test.' },
          { ko:'그는 아팠다 그래서 학교에 안 갔다.', answer:"He was sick, so he didn't go to school." },
          { ko:'우리는 축구와 야구를 한다.', answer:'We play soccer and baseball.' },
        ],
        similar: [
          { ko:'나는 차와 커피를 마신다.', answer:'I drink tea and coffee.' },
          { ko:'그것은 작지만 비싸다.', answer:'It is small, but it is expensive.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L4-4',
        title: 'because · when · if',
        tagline: '이유·때·조건 — ~때문에 · ~할 때 · ~하면',
        skeleton: '문장 + because/when/if + 문장',
        focus: '종속접속사 / because · when · if',
        card: {
          achieve: '이걸 익히면 이유·때·조건을 붙여 말할 수 있어요. "~하기 때문에", "~할 때", "~하면"처럼 문장에 까닭과 상황을 담아요.',
          howto: '<b>because</b>(~때문에·이유), <b>when</b>(~할 때·시간), <b>if</b>(~하면·조건)를 두 문장 사이에 넣어요. 각 문장은 <b>뼈대를 그대로</b> 갖춰요. 이 이음말이 앞에 오면 <b>쉼표(,)</b>로 두 문장을 나눠요.',
          demo: {
            ko: ['나는', '피곤하다', '왜냐면', '늦게 잤기 때문에'],
            steps: [
              { q: '문장 1',  ko: '나는 피곤하다',       en: 'I am tired' },
              { q: '이음말?', ko: '~때문에',            en: 'because' },
              { q: '문장 2',  ko: '나는 늦게 잤다',      en: 'I slept late' },
            ],
            answer: 'I am tired because I slept late.',
            tip: 'because로 이유를 붙였어요. 뒤 문장이 까닭이에요.',
          },
        },
        practice: [
          { ko: '비가 오면 나는 집에 있는다',
            steps: [{ q:'이음말?', en:'If', hint:'조건 → If (문장 앞)' }, { q:'문장 1', en:'it rains' }, { q:'문장 2', en:'I stay home', hint:'앞에 오면 쉼표로 나눠요' }],
            answer: 'If it rains, I stay home.' },
          { ko: '나는 어렸을 때 시골에 살았다',
            steps: [{ q:'이음말?', en:'When', hint:'~할 때 → When' }, { q:'문장 1', en:'I was young' }, { q:'문장 2', en:'I lived in the country' }],
            answer: 'When I was young, I lived in the country.' },
          { ko: '나는 배고프기 때문에 밥을 먹는다',
            steps: [{ q:'문장 1', en:'I eat' }, { q:'이음말?', en:'because', hint:'이유 → because' }, { q:'문장 2', en:'I am hungry' }],
            answer: 'I eat because I am hungry.' },
        ],
        challenges: [
          { ko:'나는 아파서 병원에 갔다.', answer:'I went to the hospital because I was sick.',
            chunks:[{ lab:'문장 1', ko:'나는 병원에 갔다' }, { lab:'이음말', ko:'~때문에 → because' }, { lab:'문장 2', ko:'나는 아팠다' }] },
          { ko:'네가 원하면 우리는 갈 수 있다.', answer:'If you want, we can go.' },
          { ko:'나는 행복할 때 노래한다.', answer:'I sing when I am happy.' },
          { ko:'열심히 공부하면 너는 통과할 것이다.', answer:'If you study hard, you will pass.' },
          { ko:'비가 왔기 때문에 우리는 집에 있었다.', answer:'We stayed home because it rained.' },
        ],
        similar: [
          { ko:'나는 그를 볼 때 웃는다.', answer:'I smile when I see him.' },
          { ko:'서두르면 너는 그것을 잡을 수 있다.', answer:'If you hurry, you can catch it.' },
        ],
      },
    ],

    /* ── L4 총정리 : 꾸밈·전치사구·접속사 섞기 (AI가 20문제 출제. 아래는 폴백) ── */
    exam: {
      passScore: RULES.EXAM_PASS,
      total: RULES.EXAM_TOTAL,
      questions: [
        { ko:'작은 고양이가 조용히 잔다.',       answer:'A small cat sleeps quietly.',       from:'L4-1' },
        { ko:'그는 천천히 걷는다.',              answer:'He walks slowly.',                  from:'L4-1' },
        { ko:'나는 아침에 학교에 간다.',         answer:'I go to school in the morning.',    from:'L4-2' },
        { ko:'그녀는 집에서 요리한다.',          answer:'She cooks at home.',                from:'L4-2' },
        { ko:'그녀는 노래하고 춤춘다.',          answer:'She sings and dances.',             from:'L4-3' },
        { ko:'그것은 작지만 비싸다.',            answer:'It is small, but it is expensive.', from:'L4-3' },
        { ko:'나는 행복할 때 노래한다.',         answer:'I sing when I am happy.',           from:'L4-4' },
        { ko:'네가 원하면 우리는 갈 수 있다.',   answer:'If you want, we can go.',           from:'L4-4' },
        { ko:'그는 도서관에서 공부한다.',        answer:'He studies in the library.',        from:'L4-2' },
        { ko:'나는 배고파서 밥을 먹었다.',       answer:'I was hungry, so I ate.',           from:'L4-3' },
      ],
    },
  },
  {
    level: 5, threshold: 2, stage: '정교', bookLabel: '2차 임계점',
    theme: { ink:'#251c3f', accent:'#7c3aed', soft:'#f3edff' },
    title: '시제 심화', skill: '시간 쌉가능',
    nextHint: 'LEVEL 6 · 무생물 주어',
    units: [
      { id: 'L5-1', title: '현재완료', focus: 'have p.p.' },
      { id: 'L5-2', title: '현재완료진행', focus: 'have been -ing' },
      { id: 'L5-3', title: '과거완료', focus: 'had p.p.' },
      { id: 'L5-4', title: '미래완료·미래진행', focus: 'will have p.p.' },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 6, threshold: 2, stage: '정교', bookLabel: '2차 임계점',
    theme: { ink:'#251c3f', accent:'#7c3aed', soft:'#f3edff' },
    title: '무생물 주어', skill: '주어 쌉가능',
    nextHint: 'LEVEL 7 · 수동태',
    units: [
      { id: 'L6-1', title: '사물 주어로 말하기 1', focus: '무생물 주어' },
      { id: 'L6-2', title: '사물 주어로 말하기 2', focus: '무생물 주어 심화' },
      { id: 'L6-3', title: '주어-동사 수 일치', focus: '수 일치' },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 7, threshold: 2, stage: '정교', bookLabel: '2차 임계점',
    theme: { ink:'#251c3f', accent:'#7c3aed', soft:'#f3edff' },
    title: '수동태', skill: '수동 쌉가능',
    nextHint: 'LEVEL 8 · 준동사 + 다듬기',
    units: [
      { id: 'L7-1', title: '수동태 기본 (be + p.p.)', focus: '수동태' },
      { id: 'L7-2', title: '시제와 만난 수동태', focus: '시제별 수동태' },
      { id: 'L7-3', title: 'get 수동태 · 굳어진 표현', focus: 'get p.p.' },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 8, threshold: 2, stage: '정교', bookLabel: '2차 임계점',
    theme: { ink:'#251c3f', accent:'#7c3aed', soft:'#f3edff' },
    title: '준동사 + 다듬기', skill: '정교 쌉가능',
    nextHint: 'LEVEL 9 · 뉘앙스 조동사',
    units: [
      { id: 'L8-1', title: 'to부정사 (~하는 것 / ~하려고)', focus: 'to부정사' },
      { id: 'L8-2', title: '동명사', focus: '동명사' },
      { id: 'L8-3', title: '분사 (~하는 · ~된)', focus: '현재·과거분사' },
      { id: 'L8-4', title: '의문사 의문문 · 다양한 부정', focus: 'wh-의문문' },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 9, threshold: 3, stage: '세련', bookLabel: '3차 임계점',
    theme: { ink:'#2e1830', accent:'#db2777', soft:'#fdf2f8' },
    title: '뉘앙스 조동사', skill: '뉘앙스 쌉가능',
    nextHint: 'LEVEL 10 · 비교 + 관계사 진입',
    units: [
      { id: 'L9-1', title: 'used to (예전엔 ~했다)', focus: 'used to' },
      { id: 'L9-2', title: 'would (공손·추측)', focus: 'would' },
      { id: 'L9-3', title: 'might · could · must have p.p.', focus: '추측 조동사' },
      { id: 'L9-4', title: 'would have p.p. (후회)', focus: '후회 표현' },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 10, threshold: 3, stage: '세련', bookLabel: '3차 임계점',
    theme: { ink:'#2e1830', accent:'#db2777', soft:'#fdf2f8' },
    title: '비교 + 관계사 진입', skill: '비교 쌉가능',
    nextHint: 'LEVEL 11 · 관계사 심화 + 분사구문',
    units: [
      { id: 'L10-1', title: '비교급 · 최상급', focus: '비교' },
      { id: 'L10-2', title: 'as ~ as (~만큼 …한)', focus: '원급 비교' },
      { id: 'L10-3', title: '관계대명사 (who · which · that)', focus: '관계대명사' },
      { id: 'L10-4', title: '관계부사 · 계속적 용법', focus: '관계부사' },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 11, threshold: 3, stage: '세련', bookLabel: '3차 임계점',
    theme: { ink:'#2e1830', accent:'#db2777', soft:'#fdf2f8' },
    title: '관계사 심화 + 분사구문', skill: '구조 쌉가능',
    nextHint: 'LEVEL 12 · 가정법 + 재구성',
    units: [
      { id: 'L11-1', title: '복합관계사 (whoever · whatever …)', focus: '복합관계사' },
      { id: 'L11-2', title: '분사구문 (~하면서 · ~한 채)', focus: '분사구문' },
      { id: 'L11-3', title: '독립분사구문 · with + 명사 + 분사', focus: '독립분사구문' },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 12, threshold: 3, stage: '세련', bookLabel: '3차 임계점',
    theme: { ink:'#2e1830', accent:'#db2777', soft:'#fdf2f8' },
    title: '가정법 + 재구성 (만렙)', skill: '영어 쌉가능',
    skillDesc: '만렙! 이제 문장을 만드는 걸 넘어, 뉘앙스까지 골라 쓸 수 있어요.',
    nextHint: null,
    units: [
      { id: 'L12-1', title: '가정법 과거 (현재 반대)', focus: '가정법 과거' },
      { id: 'L12-2', title: '가정법 과거완료 · 혼합', focus: '가정법 과거완료' },
      { id: 'L12-3', title: '공손 · 완곡 (정중한 요청)', focus: '완곡 표현' },
      { id: 'L12-4', title: '문장 재구성 (더 매끄럽게)', focus: '문장 재구성' },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
];

/* ── 헬퍼 (index.html 이 그대로 호출) ─────────────────────────────────── */

/** 레벨 객체 */
function getLevel(n){ return CURRICULUM.find(l => l.level === n); }

/** 유닛 목록 (구버전 호환: 챕터 개념이 없어져 units 를 그대로 반환) */
function flattenUnits(level){
  const lv = getLevel(level);
  return lv ? lv.units : [];
}

/** 유닛 하나 */
function getUnit(level, unitId){
  return flattenUnits(level).find(u => u.id === unitId);
}

/** 임계점 정보 */
function getThreshold(level){
  return THRESHOLDS.find(t => t.levels.includes(level));
}

/** 이 레벨의 콘텐츠가 집필 완료되었나? (card 유무로 판단) */
function isLevelReady(level){
  const us = flattenUnits(level);
  return us.length > 0 && !!us[0].card;
}

/** 반 편성용: 배치 결과 레벨 → 반 이름 */
function classFor(level){
  if(level <= 4)  return '기초반';
  if(level <= 8)  return '중급반';
  if(level <= 10) return '상급반';
  return '최상위반';
}
