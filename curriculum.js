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
    theme:{ ink:'#8F4000', accent:'#B25000', soft:'#FDF1E5' } },
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
    theme: { ink:'#1D1D1F', accent:'#5856D6', soft:'#EEEEFB' },
    title: '시제 심화', skill: '시간 쌉가능',
    skillDesc: 'L5 클리어! 이제 "지금까지 이어지는 시간"을 말할 수 있어요. 과거로 끝난 일과 지금까지 이어진 일을 구별해서 씁니다.',
    nextHint: 'LEVEL 6 · 무생물 주어',
    units: [

      /* ---------------------------------------------------------------- */
      {
        id: 'L5-1',
        title: '현재완료 ① 경험·결과',
        tagline: '현재완료 — "해 본 적 있다 · 이미 해버렸다"를 말해요',
        skeleton: '누가 + have/has + p.p.',
        focus: '현재완료 / 경험·결과 · have·has + p.p.',
        card: {
          achieve: '이걸 익히면 "~해 본 적 있다 / 한 번도 안 해봤다 / 방금 해버렸다"를 영어로 말할 수 있어요.',
          howto: '동사를 <b>have + p.p.(과거분사)</b>로 바꿔요. 누가가 한 명·하나면 <b>has</b>. 한국어에 <b>"~해 본 적 있다·없다", "방금·이미 ~해버렸다"</b>가 보이면 <b>현재완료 신호</b>예요. 경험엔 <b>never·ever</b>, 결과엔 <b>just·already</b>를 have와 p.p. 사이에 끼워요.',
          demo: {
            ko: ['나는', '제주도에', '가 본 적이 있다'],
            steps: [
              { q: '누가?',        ko: '나는',          en: 'I' },
              { q: '해 본 적?',    ko: '가 본 적 있다',  en: 'have been' },
              { q: '어디에?',      ko: '제주도에',      en: 'to Jeju' },
            ],
            answer: 'I have been to Jeju.',
            tip: '"가 본 적 있다"는 have been to. 경험을 말하는 현재완료예요.',
          },
        },
        practice: [
          { ko: '나는 그 영화를 본 적이 있다',
            steps: [{ q:'누가?', en:'I' }, { q:'해 본 적?', en:'have seen', hint:'경험 → have + p.p. (see→seen)' }, { q:'무엇을?', en:'the movie' }],
            answer: 'I have seen the movie.' },
          { ko: '그는 한 번도 초밥을 먹어 본 적이 없다',
            steps: [{ q:'누가?', en:'He' }, { q:'한 적 없다?', en:'has never eaten', hint:'한 명 → has · 한 번도 → never를 사이에' }, { q:'무엇을?', en:'sushi' }],
            answer: 'He has never eaten sushi.' },
          { ko: '나는 이미 숙제를 끝냈다',
            steps: [{ q:'누가?', en:'I' }, { q:'이미 해버렸다?', en:'have already finished', hint:'결과 → already를 사이에' }, { q:'무엇을?', en:'my homework' }],
            answer: 'I have already finished my homework.' },
        ],
        challenges: [
          { ko:'나는 그 책을 읽어 본 적이 있다.', answer:'I have read the book.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'해 본 적', ko:'읽어 본 적 있다 → have read' }, { lab:'무엇을', ko:'그 책을' }] },
          { ko:'그녀는 한 번도 해외에 가 본 적이 없다.', answer:'She has never been abroad.' },
          { ko:'우리는 이미 점심을 먹었다.', answer:'We have already had lunch.' },
          { ko:'그는 방금 집에 도착했다.', answer:'He has just arrived home.' },
          { ko:'나는 그를 만나 본 적이 있다.', answer:'I have met him.' },
        ],
        similar: [
          { ko:'나는 한 번도 그 노래를 들어 본 적이 없다.', answer:'I have never heard the song.' },
          { ko:'그녀는 이미 그것을 끝냈다.', answer:'She has already finished it.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L5-2',
        title: '현재완료 ② 계속',
        tagline: '현재완료 — "계속 ~해 왔다 · ~한 지 N년 됐다"를 말해요',
        skeleton: '누가 + have/has + p.p. + for/since',
        focus: '현재완료 / 계속 · for · since',
        card: {
          achieve: '이걸 익히면 "예전부터 지금까지 계속 해온 일"을 영어로 말할 수 있어요. "~한 지 3년 됐다"가 여기예요.',
          howto: '모양은 똑같이 <b>have/has + p.p.</b>예요. 여기에 기간을 붙여요 — <b>for + 얼마 동안</b>(for three years), <b>since + 언제부터</b>(since 2020). 한국어 <b>"계속 ~해 왔다", "~한 지 …됐다"</b>가 신호예요.',
          demo: {
            ko: ['나는', '서울에서', '3년째', '살고 있다'],
            steps: [
              { q: '누가?',       ko: '나는',        en: 'I' },
              { q: '계속 해왔다?', ko: '살아 왔다',   en: 'have lived' },
              { q: '어디서?',     ko: '서울에서',    en: 'in Seoul' },
              { q: '얼마 동안?',  ko: '3년째',       en: 'for three years' },
            ],
            answer: 'I have lived in Seoul for three years.',
            tip: '"3년째 산다"는 과거형이 아니라 현재완료! 지금도 살고 있으니까요.',
          },
        },
        practice: [
          { ko: '나는 그를 5년 동안 알고 지냈다',
            steps: [{ q:'누가?', en:'I' }, { q:'계속 해왔다?', en:'have known', hint:'know → known' }, { q:'누구를?', en:'him' }, { q:'얼마 동안?', en:'for five years', hint:'기간 → for' }],
            answer: 'I have known him for five years.' },
          { ko: '그녀는 2020년부터 영어를 공부해 왔다',
            steps: [{ q:'누가?', en:'She' }, { q:'계속 해왔다?', en:'has studied', hint:'한 명 → has' }, { q:'무엇을?', en:'English' }, { q:'언제부터?', en:'since 2020', hint:'시작점 → since' }],
            answer: 'She has studied English since 2020.' },
          { ko: '우리는 오랫동안 기다려 왔다',
            steps: [{ q:'누가?', en:'We' }, { q:'계속 해왔다?', en:'have waited' }, { q:'얼마 동안?', en:'for a long time' }],
            answer: 'We have waited for a long time.' },
        ],
        challenges: [
          { ko:'나는 이 학교에 2년째 다니고 있다.', answer:'I have attended this school for two years.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'계속 해왔다', ko:'다녀 왔다 → have attended' }, { lab:'무엇을', ko:'이 학교를' }, { lab:'얼마 동안', ko:'2년째 → for two years' }] },
          { ko:'그는 어릴 때부터 피아노를 쳐 왔다.', answer:'He has played the piano since he was young.' },
          { ko:'우리는 10년 동안 친구였다.', answer:'We have been friends for ten years.' },
          { ko:'그녀는 아침부터 일해 왔다.', answer:'She has worked since morning.' },
          { ko:'나는 그 도시에 오래 살아 왔다.', answer:'I have lived in the city for a long time.' },
        ],
        similar: [
          { ko:'나는 3년 동안 기타를 배워 왔다.', answer:'I have learned the guitar for three years.' },
          { ko:'그는 2019년부터 여기서 일해 왔다.', answer:'He has worked here since 2019.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L5-3',
        title: '현재완료 vs 과거',
        tagline: '갈라 쓰기 — 시점이 박히면 과거, 아니면 현재완료',
        skeleton: '어제 → 과거 / 해 본 적 → 현재완료',
        focus: '현재완료와 과거 구별 / 시점 표현',
        card: {
          achieve: '이걸 익히면 같은 한국어라도 <b>과거형과 현재완료를 갈라</b> 쓸 수 있어요. L5에서 가장 중요한 유닛이에요.',
          howto: '딱 하나만 기억해요. <b>"어제 · 지난주 · 3년 전 · ~했을 때"처럼 시점이 못 박히면 → 무조건 과거형</b>이에요. 현재완료는 <b>시점을 말하지 않을 때</b> 써요. 그래서 <span class="ko">I have gone yesterday</span>는 <b>틀린 문장</b>이에요 (yesterday가 있으니 <b>I went</b>).',
          demo: {
            ko: ['같은 "그 영화 봤어"도', '두 가지로 갈려요'],
            steps: [
              { q: '어제 봤어?',   ko: '시점이 박힘',      en: 'I watched it yesterday.' },
              { q: '본 적 있어?',  ko: '시점 없음 · 경험',  en: 'I have watched it.' },
            ],
            answer: '시점이 있으면 과거, 없으면 현재완료',
            tip: 'yesterday·last week·ago·in 2020 → 전부 과거형 신호예요.',
          },
        },
        practice: [
          { ko: '나는 어제 그를 만났다 (시점 있음)',
            steps: [{ q:'누가?', en:'I' }, { q:'했다?', en:'met', hint:'yesterday가 있으니 과거형!' }, { q:'누구를?', en:'him' }, { q:'언제?', en:'yesterday' }],
            answer: 'I met him yesterday.' },
          { ko: '나는 그를 만나 본 적이 있다 (시점 없음)',
            steps: [{ q:'누가?', en:'I' }, { q:'해 본 적?', en:'have met', hint:'시점이 없으니 현재완료' }, { q:'누구를?', en:'him' }],
            answer: 'I have met him.' },
          { ko: '그녀는 2020년에 일본에 갔다',
            steps: [{ q:'누가?', en:'She' }, { q:'했다?', en:'went', hint:'in 2020 → 시점이 박힘 → 과거형' }, { q:'어디에?', en:'to Japan' }, { q:'언제?', en:'in 2020' }],
            answer: 'She went to Japan in 2020.' },
        ],
        challenges: [
          { ko:'나는 지난주에 그 책을 읽었다.', answer:'I read the book last week.',
            chunks:[{ lab:'신호', ko:'지난주 → 시점 박힘 → 과거형' }, { lab:'누가', ko:'나는' }, { lab:'했다', ko:'읽었다 → read' }] },
          { ko:'나는 그 책을 읽어 본 적이 있다.', answer:'I have read the book.' },
          { ko:'그는 3년 전에 그 도시를 떠났다.', answer:'He left the city three years ago.' },
          { ko:'그는 그 도시를 떠난 적이 있다.', answer:'He has left the city.' },
          { ko:'우리는 어제 저녁을 먹었다.', answer:'We had dinner yesterday.' },
        ],
        similar: [
          { ko:'나는 작년에 그녀를 봤다.', answer:'I saw her last year.' },
          { ko:'나는 그녀를 본 적이 있다.', answer:'I have seen her.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L5-4',
        title: '현재완료진행',
        tagline: '현재완료진행 — "계속 해왔고 지금도 하는 중"을 말해요',
        skeleton: '누가 + have/has been + -ing',
        focus: '현재완료진행 / have·has been + -ing',
        card: {
          achieve: '이걸 익히면 "아까부터 계속 하고 있고 지금 이 순간도 하는 중"을 영어로 말할 수 있어요.',
          howto: '<b>have/has been + 동사-ing</b>예요. 현재완료(계속)에 <b>"지금도 하는 중"</b>을 더한 느낌이에요. L2의 진행형(be + -ing)이 여기서 다시 나와요. 기간은 똑같이 <b>for·since</b>로 붙여요.',
          demo: {
            ko: ['나는', '두 시간째', '공부하고 있다'],
            steps: [
              { q: '누가?',          ko: '나는',            en: 'I' },
              { q: '계속 하는 중?',  ko: '공부해 오고 있다',  en: 'have been studying' },
              { q: '얼마 동안?',     ko: '두 시간째',        en: 'for two hours' },
            ],
            answer: 'I have been studying for two hours.',
            tip: 'have been + studying. 아까부터 지금까지 쭉 하는 중이에요.',
          },
        },
        practice: [
          { ko: '그는 한 시간째 기다리고 있다',
            steps: [{ q:'누가?', en:'He' }, { q:'계속 하는 중?', en:'has been waiting', hint:'한 명 → has been + -ing' }, { q:'얼마 동안?', en:'for an hour' }],
            answer: 'He has been waiting for an hour.' },
          { ko: '우리는 아침부터 일하고 있다',
            steps: [{ q:'누가?', en:'We' }, { q:'계속 하는 중?', en:'have been working' }, { q:'언제부터?', en:'since morning' }],
            answer: 'We have been working since morning.' },
          { ko: '그녀는 오랫동안 영어를 배우고 있다',
            steps: [{ q:'누가?', en:'She' }, { q:'계속 하는 중?', en:'has been learning' }, { q:'무엇을?', en:'English' }, { q:'얼마 동안?', en:'for a long time' }],
            answer: 'She has been learning English for a long time.' },
        ],
        challenges: [
          { ko:'나는 세 시간째 책을 읽고 있다.', answer:'I have been reading a book for three hours.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'계속 하는 중', ko:'읽어 오고 있다 → have been reading' }, { lab:'무엇을', ko:'책을' }, { lab:'얼마 동안', ko:'세 시간째' }] },
          { ko:'그는 아침부터 달리고 있다.', answer:'He has been running since morning.' },
          { ko:'우리는 오랫동안 그것을 기다리고 있다.', answer:'We have been waiting for it for a long time.' },
          { ko:'그녀는 두 시간째 요리하고 있다.', answer:'She has been cooking for two hours.' },
          { ko:'비가 어제부터 내리고 있다.', answer:'It has been raining since yesterday.' },
        ],
        similar: [
          { ko:'나는 한 시간째 그를 기다리고 있다.', answer:'I have been waiting for him for an hour.' },
          { ko:'그들은 계속 이야기하고 있다.', answer:'They have been talking.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L5-5',
        title: '과거완료',
        tagline: '과거완료 — "그보다 더 전에 이미"를 말해요',
        skeleton: '누가 + had + p.p.',
        focus: '과거완료 / had + p.p.',
        card: {
          achieve: '이걸 익히면 "과거의 그 시점보다 더 전에 있었던 일"을 영어로 말할 수 있어요. 과거 안의 과거예요.',
          howto: '<b>had + p.p.</b>예요. have가 <b>had</b>로 바뀐 것뿐이에요. 과거 이야기를 하다가 <b>"그전에 이미 ~했었다"</b>를 말할 때 써요. 보통 <b>과거 문장과 짝</b>으로 나와요 — "내가 도착했을 때(과거), 그는 이미 떠난 뒤였다(과거완료)".',
          demo: {
            ko: ['내가 도착했을 때', '그는 이미', '떠난 뒤였다'],
            steps: [
              { q: '언제?',        ko: '내가 도착했을 때',  en: 'When I arrived' },
              { q: '누가?',        ko: '그는',             en: 'he' },
              { q: '더 전에 이미?', ko: '떠난 뒤였다',      en: 'had already left' },
            ],
            answer: 'When I arrived, he had already left.',
            tip: '도착(과거)보다 떠난 게 더 먼저 → had left.',
          },
        },
        practice: [
          { ko: '내가 갔을 때 그녀는 이미 밥을 먹은 뒤였다',
            steps: [{ q:'언제?', en:'When I went' }, { q:'누가?', en:'she' }, { q:'더 전에 이미?', en:'had already eaten', hint:'더 먼저 일어난 일 → had + p.p.' }],
            answer: 'When I went, she had already eaten.' },
          { ko: '내가 도착하기 전에 기차는 떠나 있었다',
            steps: [{ q:'누가?', en:'The train' }, { q:'더 전에 이미?', en:'had left', hint:'had + left' }, { q:'언제?', en:'before I arrived' }],
            answer: 'The train had left before I arrived.' },
          { ko: '나는 그를 전에 만난 적이 있었다',
            steps: [{ q:'누가?', en:'I' }, { q:'더 전에 이미?', en:'had met' }, { q:'누구를?', en:'him before' }],
            answer: 'I had met him before.' },
        ],
        challenges: [
          { ko:'내가 도착했을 때 영화는 이미 시작했다.', answer:'When I arrived, the movie had already started.',
            chunks:[{ lab:'언제', ko:'내가 도착했을 때 (과거)' }, { lab:'누가', ko:'영화는' }, { lab:'더 전에 이미', ko:'시작했었다 → had started' }] },
          { ko:'그가 왔을 때 우리는 이미 떠난 뒤였다.', answer:'When he came, we had already left.' },
          { ko:'나는 그 책을 전에 읽은 적이 있었다.', answer:'I had read the book before.' },
          { ko:'그녀는 내가 전화하기 전에 잠들어 있었다.', answer:'She had fallen asleep before I called.' },
          { ko:'우리가 도착했을 때 비가 그쳐 있었다.', answer:'When we arrived, the rain had stopped.' },
        ],
        similar: [
          { ko:'내가 왔을 때 그는 이미 나간 뒤였다.', answer:'When I came, he had already gone out.' },
          { ko:'나는 그곳에 전에 가 본 적이 있었다.', answer:'I had been there before.' },
        ],
      },
    ],

    /* ── L5 총정리 (AI가 20문제 새로 출제. 아래는 폴백) ── */
    exam: {
      passScore: RULES.EXAM_PASS,
      total: RULES.EXAM_TOTAL,
      questions: [
        { ko:'나는 그 책을 읽어 본 적이 있다.',        answer:'I have read the book.',                    from:'L5-1' },
        { ko:'그녀는 한 번도 해외에 가 본 적이 없다.', answer:'She has never been abroad.',               from:'L5-1' },
        { ko:'그는 방금 집에 도착했다.',               answer:'He has just arrived home.',                from:'L5-1' },
        { ko:'우리는 10년 동안 친구였다.',             answer:'We have been friends for ten years.',      from:'L5-2' },
        { ko:'그는 2019년부터 여기서 일해 왔다.',      answer:'He has worked here since 2019.',           from:'L5-2' },
        { ko:'나는 지난주에 그 책을 읽었다.',          answer:'I read the book last week.',               from:'L5-3' },
        { ko:'나는 작년에 그녀를 봤다.',               answer:'I saw her last year.',                     from:'L5-3' },
        { ko:'그는 3년 전에 그 도시를 떠났다.',        answer:'He left the city three years ago.',        from:'L5-3' },
        { ko:'그는 아침부터 달리고 있다.',             answer:'He has been running since morning.',       from:'L5-4' },
        { ko:'내가 도착했을 때 그는 이미 떠났다.',     answer:'When I arrived, he had already left.',     from:'L5-5' },
      ],
    },
  },
  {
    level: 6, threshold: 2, stage: '정교', bookLabel: '2차 임계점',
    theme: { ink:'#1D1D1F', accent:'#5856D6', soft:'#EEEEFB' },
    title: '무생물 주어', skill: '주어 쌉가능',
    skillDesc: 'L6 클리어! 이제 사람이 아닌 것도 주어로 세워 영어답게 말할 수 있어요. 한국어를 뒤집어 영어 어순으로 옮기는 힘이 붙었어요.',
    nextHint: 'LEVEL 7 · 수동태',
    units: [

      /* ---------------------------------------------------------------- */
      {
        id: 'L6-1',
        title: '사물이 주어가 된다',
        tagline: '무생물 주어 — "그것이 나를 ~하게 했다"로 뒤집어 말해요',
        skeleton: '사물 + 한다 + 사람을',
        focus: '무생물 주어 기본 / make · give · help',
        card: {
          achieve: '이걸 익히면 사람이 아니라 <b>사물·일·상황</b>을 주어로 세워 영어답게 말할 수 있어요. 영어가 훨씬 자연스러워져요.',
          howto: '한국어는 <b>사람</b>을 주어로 말해요("나는 그 소식에 놀랐다"). 영어는 <b>사물</b>을 주어로 자주 말해요("그 소식이 나를 놀라게 했다"). 그래서 <b>한국어를 먼저 뒤집어</b> 놓고 옮기면 돼요. 뼈대는 L1 그대로 — <b>누가(사물) + 한다 + 누구를</b>.',
          demo: {
            ko: ['나는', '그 소식을 듣고', '놀랐다'],
            steps: [
              { q: '뒤집기!',  ko: '→ 그 소식이 나를 놀라게 했다', en: '' },
              { q: '누가?',    ko: '그 소식이',   en: 'The news' },
              { q: '한다?',    ko: '놀라게 했다',  en: 'surprised' },
              { q: '누구를?',  ko: '나를',        en: 'me' },
            ],
            answer: 'The news surprised me.',
            tip: '한국어를 뒤집는 게 첫 단추. 사물을 앞으로 꺼내요.',
          },
        },
        practice: [
          { ko: '나는 그 영화를 보고 울었다 (→ 그 영화가 나를 울게 했다)',
            steps: [{ q:'누가?', en:'The movie', hint:'사물을 주어로' }, { q:'한다?', en:'made', hint:'~하게 만들다 → make' }, { q:'누구를?', en:'me' }, { q:'어떤 상태로?', en:'cry' }],
            answer: 'The movie made me cry.' },
          { ko: '그 책 덕분에 나는 많이 배웠다 (→ 그 책이 나에게 많이 가르쳐 줬다)',
            steps: [{ q:'누가?', en:'The book' }, { q:'한다?', en:'taught', hint:'teach → taught' }, { q:'누구에게?', en:'me' }, { q:'무엇을?', en:'a lot' }],
            answer: 'The book taught me a lot.' },
          { ko: '이 약을 먹으면 기분이 나아질 거야 (→ 이 약이 너를 낫게 할 거야)',
            steps: [{ q:'누가?', en:'This medicine' }, { q:'할 것이다?', en:'will make', hint:'will + 동사원형' }, { q:'누구를?', en:'you' }, { q:'어떤 상태로?', en:'feel better' }],
            answer: 'This medicine will make you feel better.' },
        ],
        challenges: [
          { ko:'그 음악이 나를 행복하게 한다.', answer:'The music makes me happy.',
            chunks:[{ lab:'누가', ko:'그 음악이 (사물!)' }, { lab:'한다', ko:'~하게 만든다 → makes' }, { lab:'누구를', ko:'나를' }, { lab:'어떤 상태로', ko:'행복하게' }] },
          { ko:'그 소식이 우리를 놀라게 했다.', answer:'The news surprised us.' },
          { ko:'이 앱이 나에게 영어를 가르쳐 준다.', answer:'This app teaches me English.' },
          { ko:'그 사고가 그를 다치게 했다.', answer:'The accident hurt him.' },
          { ko:'따뜻한 날씨가 우리를 기분 좋게 한다.', answer:'The warm weather makes us feel good.' },
        ],
        similar: [
          { ko:'그 이야기가 나를 웃게 했다.', answer:'The story made me laugh.' },
          { ko:'이 사진이 나에게 그날을 떠올리게 한다.', answer:'This photo reminds me of that day.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L6-2',
        title: '시간·상황이 주어',
        tagline: '무생물 주어 — 시간·이유·상황도 주어로 세워요',
        skeleton: '시간/상황 + 한다',
        focus: '무생물 주어 심화 / 시간·이유·장소 주어',
        card: {
          achieve: '이걸 익히면 <b>시간·이유·상황</b>까지 주어로 세울 수 있어요. "왜냐하면~" 없이도 이유를 말할 수 있게 돼요.',
          howto: '사물뿐 아니라 <b>시간(오늘·5분), 이유(비·교통), 장소(이 도시)</b>도 주어가 돼요. 특히 <b>"~때문에 …했다"</b>는 영어로 <b>"그것이 …하게 했다"</b>로 자주 뒤집혀요. 자주 쓰는 동사 — <b>take</b>(시간이 걸리다), <b>cause</b>(~을 일으키다), <b>allow</b>(~하게 해주다), <b>keep</b>(~하게 유지하다).',
          demo: {
            ko: ['학교까지', '20분', '걸린다'],
            steps: [
              { q: '누가?',   ko: '그것이 (시간)',  en: 'It' },
              { q: '한다?',   ko: '걸린다',        en: 'takes' },
              { q: '얼마나?', ko: '20분',         en: '20 minutes' },
              { q: '어디까지?', ko: '학교까지',    en: 'to get to school' },
            ],
            answer: 'It takes 20 minutes to get to school.',
            tip: '"걸린다"는 It takes. 시간이 주어처럼 앞에 서요.',
          },
        },
        practice: [
          { ko: '비 때문에 우리는 집에 있었다 (→ 비가 우리를 집에 있게 했다)',
            steps: [{ q:'누가?', en:'The rain', hint:'이유를 주어로' }, { q:'한다?', en:'kept', hint:'keep → kept (유지하다)' }, { q:'누구를?', en:'us' }, { q:'어디에?', en:'at home' }],
            answer: 'The rain kept us at home.' },
          { ko: '그 일은 세 시간이 걸렸다',
            steps: [{ q:'누가?', en:'The work' }, { q:'했다?', en:'took', hint:'take → took (시간이 걸리다)' }, { q:'얼마나?', en:'three hours' }],
            answer: 'The work took three hours.' },
          { ko: '이 앱 덕분에 나는 쉽게 공부할 수 있다 (→ 이 앱이 나를 쉽게 공부하게 해준다)',
            steps: [{ q:'누가?', en:'This app' }, { q:'한다?', en:'allows', hint:'allow (~하게 해주다)' }, { q:'누구를?', en:'me' }, { q:'무엇을?', en:'to study easily' }],
            answer: 'This app allows me to study easily.' },
        ],
        challenges: [
          { ko:'집까지 한 시간이 걸린다.', answer:'It takes an hour to get home.',
            chunks:[{ lab:'누가', ko:'It (시간)' }, { lab:'한다', ko:'걸린다 → takes' }, { lab:'얼마나', ko:'한 시간' }] },
          { ko:'눈 때문에 학교가 문을 닫았다.', answer:'The snow closed the school.' },
          { ko:'그 실수가 문제를 일으켰다.', answer:'The mistake caused a problem.' },
          { ko:'운동이 나를 건강하게 유지해 준다.', answer:'Exercise keeps me healthy.' },
          { ko:'그 시험이 나를 긴장하게 만들었다.', answer:'The test made me nervous.' },
        ],
        similar: [
          { ko:'교통 때문에 우리는 늦었다.', answer:'The traffic made us late.' },
          { ko:'그 책을 읽는 데 일주일이 걸렸다.', answer:'It took a week to read the book.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L6-3',
        title: '한국어식 vs 영어식',
        tagline: '갈라 쓰기 — 사람이 주어일 때 · 사물이 주어일 때',
        skeleton: '나는 ~했다  /  그것이 나를 ~하게 했다',
        focus: '주어 선택 / 사람 주어와 무생물 주어 비교',
        card: {
          achieve: '이걸 익히면 <b>언제 사람을 주어로 쓰고 언제 사물을 주어로 쓸지</b> 고를 수 있어요. L6에서 가장 중요한 유닛이에요.',
          howto: '둘 다 맞는 문장이에요. 다만 느낌이 달라요. <b>사람 주어</b>는 "내가 그렇게 했다"에 초점, <b>사물 주어</b>는 "그것 때문에 그렇게 됐다"에 초점이에요. 한국어에 <b>"~때문에 / ~덕분에 / ~를 보고(듣고)"</b>가 있으면 <b>사물 주어로 뒤집으면 영어다워져요</b>. 단, <b>내가 직접 한 행동</b>은 그냥 사람 주어로 써요.',
          demo: {
            ko: ['같은 뜻도', '두 가지로 말할 수 있어요'],
            steps: [
              { q: '사람 주어',  ko: '나는 그 소식에 놀랐다',      en: 'I was surprised at the news.' },
              { q: '사물 주어',  ko: '그 소식이 나를 놀라게 했다',  en: 'The news surprised me.' },
            ],
            answer: '둘 다 맞아요 — 무엇에 초점을 두느냐의 차이',
            tip: '"~때문에·덕분에"가 보이면 사물 주어로 뒤집어 보세요.',
          },
        },
        practice: [
          { ko: '나는 매일 아침 운동한다 (내가 직접 한 행동)',
            steps: [{ q:'누가?', en:'I', hint:'직접 한 행동 → 사람 주어 그대로' }, { q:'한다?', en:'exercise' }, { q:'언제?', en:'every morning' }],
            answer: 'I exercise every morning.' },
          { ko: '그 사진 덕분에 나는 그날이 떠올랐다 (→ 뒤집기)',
            steps: [{ q:'누가?', en:'The photo', hint:'"덕분에" → 사물 주어로 뒤집기' }, { q:'한다?', en:'reminds' }, { q:'누구를?', en:'me' }, { q:'무엇을?', en:'of that day' }],
            answer: 'The photo reminds me of that day.' },
          { ko: '나는 그 결과에 실망했다 (사람 주어)',
            steps: [{ q:'누가?', en:'I' }, { q:'어떠했다?', en:'was disappointed', hint:'감정 상태 → 사람 주어도 자연스러워요' }, { q:'무엇에?', en:'at the result' }],
            answer: 'I was disappointed at the result.' },
        ],
        challenges: [
          { ko:'나는 매일 학교에 걸어간다.', answer:'I walk to school every day.',
            chunks:[{ lab:'판단', ko:'직접 한 행동 → 사람 주어' }, { lab:'누가', ko:'나는' }, { lab:'한다', ko:'걸어간다' }] },
          { ko:'그 노래가 나를 슬프게 했다.', answer:'The song made me sad.' },
          { ko:'나는 어제 그 책을 샀다.', answer:'I bought the book yesterday.' },
          { ko:'그의 말이 나를 화나게 했다.', answer:'His words made me angry.' },
          { ko:'좋은 날씨가 우리를 밖으로 나가게 했다.', answer:'The nice weather made us go out.' },
        ],
        similar: [
          { ko:'나는 아침에 커피를 마신다.', answer:'I drink coffee in the morning.' },
          { ko:'그 결과가 그를 놀라게 했다.', answer:'The result surprised him.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L6-4',
        title: '주어-동사 수 일치',
        tagline: '수 일치 — 진짜 주어를 찾아 동사를 맞춰요',
        skeleton: '(긴) 주어 + 맞는 동사',
        focus: '수 일치 / 긴 주어의 핵심 찾기',
        card: {
          achieve: '이걸 익히면 <b>주어가 길어져도</b> 동사를 틀리지 않아요. 무생물 주어를 쓰면 주어가 길어지는데, 거기서 제일 많이 틀려요.',
          howto: '주어가 길면 <b>맨 앞 핵심 명사</b>를 찾아 거기에 동사를 맞춰요. <b>바로 앞 명사에 속으면 안 돼요.</b> "The books <u>on the desk</u>"에서 진짜 주어는 <b>books</b>(여럿) → <b>are</b>. desk를 보고 is를 쓰면 틀려요. <b>-ing로 시작하는 주어</b>(Studying~)는 <b>하나</b>로 봐서 <b>is</b>를 써요.',
          demo: {
            ko: ['책상 위의', '책들이', '오래됐다'],
            steps: [
              { q: '핵심 주어?', ko: '책들이 (여럿!)',     en: 'The books' },
              { q: '꾸밈말',     ko: '책상 위의',          en: 'on the desk' },
              { q: '동사 맞추기', ko: '여럿 → are',        en: 'are old' },
            ],
            answer: 'The books on the desk are old.',
            tip: 'desk(하나)에 속지 마세요. 진짜 주어는 books!',
          },
        },
        practice: [
          { ko: '그 방 안의 학생들이 조용하다',
            steps: [{ q:'핵심 주어?', en:'The students', hint:'여럿!' }, { q:'꾸밈말', en:'in the room' }, { q:'동사?', en:'are quiet', hint:'여럿 → are (room에 속지 않기)' }],
            answer: 'The students in the room are quiet.' },
          { ko: '매일 영어를 공부하는 것은 중요하다',
            steps: [{ q:'핵심 주어?', en:'Studying English every day', hint:'-ing 주어 → 하나로 봐요' }, { q:'동사?', en:'is important', hint:'하나 → is' }],
            answer: 'Studying English every day is important.' },
          { ko: '내 친구들 중 한 명이 캐나다에 산다',
            steps: [{ q:'핵심 주어?', en:'One of my friends', hint:'핵심은 One (하나!)' }, { q:'동사?', en:'lives', hint:'하나 → lives (friends에 속지 않기)' }, { q:'어디에?', en:'in Canada' }],
            answer: 'One of my friends lives in Canada.' },
        ],
        challenges: [
          { ko:'탁자 위의 사과들이 신선하다.', answer:'The apples on the table are fresh.',
            chunks:[{ lab:'핵심 주어', ko:'사과들이 (여럿)' }, { lab:'꾸밈말', ko:'탁자 위의' }, { lab:'동사', ko:'여럿 → are' }] },
          { ko:'책을 읽는 것은 재미있다.', answer:'Reading books is fun.' },
          { ko:'내 가방 안의 그 책은 새것이다.', answer:'The book in my bag is new.' },
          { ko:'그 학생들 중 한 명이 늦었다.', answer:'One of the students was late.' },
          { ko:'공원에 있는 아이들이 놀고 있다.', answer:'The children in the park are playing.' },
        ],
        similar: [
          { ko:'상자 안의 물건들이 무겁다.', answer:'The things in the box are heavy.' },
          { ko:'매일 걷는 것은 건강에 좋다.', answer:'Walking every day is good for health.' },
        ],
      },
    ],

    /* ── L6 총정리 (AI가 20문제 새로 출제. 아래는 폴백) ── */
    exam: {
      passScore: RULES.EXAM_PASS,
      total: RULES.EXAM_TOTAL,
      questions: [
        { ko:'그 음악이 나를 행복하게 한다.',      answer:'The music makes me happy.',            from:'L6-1' },
        { ko:'그 소식이 우리를 놀라게 했다.',      answer:'The news surprised us.',               from:'L6-1' },
        { ko:'그 이야기가 나를 웃게 했다.',        answer:'The story made me laugh.',             from:'L6-1' },
        { ko:'집까지 한 시간이 걸린다.',           answer:'It takes an hour to get home.',        from:'L6-2' },
        { ko:'운동이 나를 건강하게 유지해 준다.',  answer:'Exercise keeps me healthy.',           from:'L6-2' },
        { ko:'나는 매일 학교에 걸어간다.',         answer:'I walk to school every day.',          from:'L6-3' },
        { ko:'그의 말이 나를 화나게 했다.',        answer:'His words made me angry.',             from:'L6-3' },
        { ko:'탁자 위의 사과들이 신선하다.',       answer:'The apples on the table are fresh.',   from:'L6-4' },
        { ko:'책을 읽는 것은 재미있다.',           answer:'Reading books is fun.',                from:'L6-4' },
        { ko:'공원에 있는 아이들이 놀고 있다.',    answer:'The children in the park are playing.',from:'L6-4' },
      ],
    },
  },
  {
    level: 7, threshold: 2, stage: '정교', bookLabel: '2차 임계점',
    theme: { ink:'#1D1D1F', accent:'#5856D6', soft:'#EEEEFB' },
    title: '수동태', skill: '수동 쌉가능',
    skillDesc: 'L7 클리어! 이제 뼈대를 뒤집어 "당한 쪽"을 주인공으로 세울 수 있어요. 누가 했는지보다 무엇이 됐는지를 말하는 힘이 붙었어요.',
    nextHint: 'LEVEL 8 · 준동사 + 다듬기',
    units: [

      /* ---------------------------------------------------------------- */
      {
        id: 'L7-1',
        title: '수동태 기본 (be + p.p.)',
        tagline: '수동태 — "누가 했는지"보다 "무엇이 됐는지"를 말해요',
        skeleton: '무엇이 + ~된다 (be + p.p.)',
        focus: '수동태 기본 / be + p.p.',
        card: {
          achieve: '이걸 익히면 <b>당하는 쪽을 주인공</b>으로 세워 말할 수 있어요. <b>누가 했는지 모르거나, 중요하지 않을 때</b> 영어는 이렇게 말해요.',
          howto: '한국어에 <b>"~된다 / ~당했다 / ~받았다"</b>가 보이면 수동태 신호예요. 만들기는 두 조각 — <b>be동사 + p.p.</b> p.p.는 L5 현재완료(have p.p.)에서 만난 그 모습 그대로예요. 단, <b>p.p.만 덜렁 쓰면 안 돼요</b> — be동사가 꼭 앞에 서요. 그리고 <b>"~에 의해(by)"는 꼭 필요할 때만</b> 붙여요.',
          demo: {
            ko: ['그 방은', '매일', '청소된다'],
            steps: [
              { q: '무엇이?',  ko: '그 방은 (당하는 쪽!)', en: 'The room' },
              { q: '~된다?',   ko: '청소된다',            en: 'is cleaned' },
              { q: '언제?',    ko: '매일',                en: 'every day' },
            ],
            answer: 'The room is cleaned every day.',
            tip: '"~된다"가 신호. be동사 + p.p. 두 조각을 붙여요.',
          },
        },
        practice: [
          { ko: '영어는 전 세계에서 사용된다',
            steps: [{ q:'무엇이?', en:'English', hint:'당하는 쪽을 주어로' }, { q:'~된다?', en:'is used', hint:'하나 → is + p.p.' }, { q:'어디에서?', en:'all over the world' }],
            answer: 'English is used all over the world.' },
          { ko: '그 다리는 1990년에 지어졌다',
            steps: [{ q:'무엇이?', en:'The bridge' }, { q:'~되었다?', en:'was built', hint:'지나간 일 → was + p.p. (build → built)' }, { q:'언제?', en:'in 1990' }],
            answer: 'The bridge was built in 1990.' },
          { ko: '이 쿠키들은 우리 할머니에 의해 만들어졌다',
            steps: [{ q:'무엇이?', en:'These cookies', hint:'여럿!' }, { q:'~되었다?', en:'were made', hint:'여럿 + 과거 → were + p.p.' }, { q:'누구에 의해?', en:'by my grandmother', hint:'만든 사람을 밝히고 싶을 때만 by' }],
            answer: 'These cookies were made by my grandmother.' },
        ],
        challenges: [
          { ko:'그 문은 밤에 잠긴다.', answer:'The door is locked at night.',
            chunks:[{ lab:'무엇이', ko:'그 문은 (당하는 쪽)' }, { lab:'~된다', ko:'잠긴다 → is locked' }, { lab:'언제', ko:'밤에' }] },
          { ko:'그 편지는 어제 보내졌다.', answer:'The letter was sent yesterday.' },
          { ko:'이 노래는 많은 사람들에게 사랑받는다.', answer:'This song is loved by many people.' },
          { ko:'그 창문이 어제 깨졌다.', answer:'The window was broken yesterday.' },
          { ko:'저녁은 7시에 제공된다.', answer:'Dinner is served at 7.' },
        ],
        similar: [
          { ko:'그 케이크는 오늘 아침에 구워졌다.', answer:'The cake was baked this morning.' },
          { ko:'이 책은 한국어로 쓰여 있다.', answer:'This book is written in Korean.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L7-2',
        title: '시제와 만난 수동태',
        tagline: '시제별 수동태 — be동사만 옷을 갈아입어요',
        skeleton: 'be(시제 변신) + p.p.(그대로)',
        focus: '시제별 수동태 / will be · being · have been + p.p.',
        card: {
          achieve: '이걸 익히면 수동태를 <b>모든 시제</b>로 말할 수 있어요. "~될 것이다, ~되고 있다, ~되어 있다"까지 자유로워져요.',
          howto: '규칙은 하나 — <b>p.p.는 그대로, be동사만 시제 옷을 갈아입어요.</b> 미래는 <b>will be + p.p.</b>, 지금 되는 중이면 <b>is being + p.p.</b>(L2 진행형 소환), 이미 다 되어 있으면 <b>has been + p.p.</b>(L5 현재완료 소환). 그리고 L5의 울타리 그대로 — <b>어제·지난주처럼 시점이 박히면 무조건 was/were + p.p.</b>',
          demo: {
            ko: ['그 도로는', '지금', '수리되고 있다'],
            steps: [
              { q: '무엇이?',   ko: '그 도로는',      en: 'The road' },
              { q: '되는 중?',  ko: '수리되고 있다',   en: 'is being repaired' },
              { q: '언제?',     ko: '지금',           en: 'now' },
            ],
            answer: 'The road is being repaired now.',
            tip: '"~되고 있다" = 진행 + 수동 → is being + p.p.',
          },
        },
        practice: [
          { ko: '그 다리는 내년에 완공될 것이다',
            steps: [{ q:'무엇이?', en:'The bridge' }, { q:'~될 것이다?', en:'will be finished', hint:'미래 → will be + p.p.' }, { q:'언제?', en:'next year' }],
            answer: 'The bridge will be finished next year.' },
          { ko: '내 자전거는 지금 수리되고 있다',
            steps: [{ q:'무엇이?', en:'My bike' }, { q:'되는 중?', en:'is being repaired', hint:'"~되고 있다" → is being + p.p.' }, { q:'언제?', en:'now' }],
            answer: 'My bike is being repaired now.' },
          { ko: '그 방은 방금 청소되었다 (완료)',
            steps: [{ q:'무엇이?', en:'The room' }, { q:'다 된 상태?', en:'has just been cleaned', hint:'막 끝난 일 → has been + p.p. (just는 has 뒤에)' }],
            answer: 'The room has just been cleaned.' },
        ],
        challenges: [
          { ko:'그 케이크는 내일 배달될 것이다.', answer:'The cake will be delivered tomorrow.',
            chunks:[{ lab:'무엇이', ko:'그 케이크는' }, { lab:'~될 것이다', ko:'미래 → will be delivered' }, { lab:'언제', ko:'내일' }] },
          { ko:'새 학교가 지금 지어지고 있다.', answer:'A new school is being built now.' },
          { ko:'그 문제는 이미 해결되었다.', answer:'The problem has already been solved.' },
          { ko:'그 창문들은 어제 닦였다.', answer:'The windows were cleaned yesterday.' },
          { ko:'그 티켓들은 온라인에서 판매된다.', answer:'The tickets are sold online.' },
        ],
        similar: [
          { ko:'그 벽은 다음 주에 페인트칠될 것이다.', answer:'The wall will be painted next week.' },
          { ko:'그의 차는 지금 세차되고 있다.', answer:'His car is being washed now.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L7-3',
        title: 'get 수동태 · 굳어진 표현',
        tagline: 'get · 굳어진 표현 — 일상에서 더 자연스러운 수동태',
        skeleton: 'get + p.p.  /  be + p.p. 굳은 표현',
        focus: 'get p.p. / be born · be interested in · be asked to',
        card: {
          achieve: '이걸 익히면 일상 대화에서 <b>더 자연스러운 수동태</b>를 쓸 수 있어요. 원어민이 매일 쓰는 <b>굳어진 표현</b>도 손에 들어와요.',
          howto: '<b>예상 못 한 일·사고</b>는 be 대신 <b>get + p.p.</b>로 말해요 — <b>get hurt</b>(다치다), <b>get stolen</b>(도난당하다), <b>get caught</b>(잡히다). 그리고 아예 수동태로 <b>굳어진 표현</b>들은 통째로 외워요 — <b>be born</b>(태어나다), <b>be interested in</b>(관심 있다), <b>be surprised at</b>(놀라다), <b>be asked/told to</b>(~하라고 요청받다/지시받다).',
          demo: {
            ko: ['그는', '축구를 하다가', '다쳤다'],
            steps: [
              { q: '누가?',    ko: '그는',            en: 'He' },
              { q: '당했다?',  ko: '다쳤다 (사고!)',   en: 'got hurt' },
              { q: '언제?',    ko: '축구를 하다가',    en: 'while playing soccer' },
            ],
            answer: 'He got hurt while playing soccer.',
            tip: '예상 못 한 사고 → be 대신 get이 더 자연스러워요.',
          },
        },
        practice: [
          { ko: '내 우산을 지하철에서 도난당했다',
            steps: [{ q:'무엇이?', en:'My umbrella', hint:'당한 물건을 주어로' }, { q:'당했다?', en:'got stolen', hint:'예상 못 한 일 → got + p.p.' }, { q:'어디에서?', en:'on the subway' }],
            answer: 'My umbrella got stolen on the subway.' },
          { ko: '나는 2012년에 태어났다',
            steps: [{ q:'누가?', en:'I' }, { q:'태어났다?', en:'was born', hint:'굳어진 표현 — 통째로!' }, { q:'언제?', en:'in 2012' }],
            answer: 'I was born in 2012.' },
          { ko: '우리는 조용히 하라고 지시받았다',
            steps: [{ q:'누가?', en:'We' }, { q:'지시받았다?', en:'were told', hint:'be told to ~ (지시받다)' }, { q:'무엇을 하라고?', en:'to be quiet' }],
            answer: 'We were told to be quiet.' },
        ],
        challenges: [
          { ko:'그의 전화기가 어제 도난당했다.', answer:'His phone got stolen yesterday.',
            chunks:[{ lab:'무엇이', ko:'그의 전화기가' }, { lab:'당했다', ko:'예상 못 한 일 → got stolen' }, { lab:'언제', ko:'어제' }] },
          { ko:'나는 역사에 관심이 있다.', answer:'I am interested in history.' },
          { ko:'그녀는 서울에서 태어났다.', answer:'She was born in Seoul.' },
          { ko:'그는 경기 중에 다쳤다.', answer:'He got hurt during the game.' },
          { ko:'나는 창문을 닫으라고 요청받았다.', answer:'I was asked to close the window.' },
        ],
        similar: [
          { ko:'나는 그 소식에 놀랐다.', answer:'I was surprised at the news.' },
          { ko:'그 도둑은 경찰에게 잡혔다.', answer:'The thief got caught by the police.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L7-4',
        title: '능동 vs 수동',
        tagline: '갈라 쓰기 — 한 사람이 주인공이면 능동, 당한 쪽이 주인공이면 수동',
        skeleton: '누가 + 한다  /  무엇이 + ~된다',
        focus: '태 선택 / 능동태와 수동태 비교',
        card: {
          achieve: '이걸 익히면 <b>언제 능동으로 쓰고 언제 수동으로 쓸지</b> 고를 수 있어요. L7에서 가장 중요한 유닛이에요.',
          howto: '둘 다 맞는 문장이에요. <b>행동한 사람이 주인공</b>이면 능동, <b>누가 했는지 모르거나 당한 쪽이 주인공</b>이면 수동이에요. 한국어가 알려줘요 — <b>"~했다"면 능동, "~됐다/~당했다/~받았다"면 수동.</b> 울타리 하나 — <b>happen(일어나다)처럼 스스로 벌어지는 일은 수동태로 쓰지 않아요.</b> "사고가 일어났다"는 The accident happened. 그대로예요.',
          demo: {
            ko: ['같은 일도', '두 가지로 말할 수 있어요'],
            steps: [
              { q: '능동',  ko: '우리 엄마가 이 쿠키를 만들었다',        en: 'My mom made these cookies.' },
              { q: '수동',  ko: '이 쿠키는 우리 엄마에 의해 만들어졌다',  en: 'These cookies were made by my mom.' },
            ],
            answer: '둘 다 맞아요 — 주인공을 누구로 세우느냐의 차이',
            tip: '"~했다"는 능동, "~됐다·당했다"는 수동. 한국어가 알려줘요.',
          },
        },
        practice: [
          { ko: '나는 어제 그 창문을 깼다 (한 사람이 분명!)',
            steps: [{ q:'누가?', en:'I', hint:'"~했다" → 능동 그대로' }, { q:'했다?', en:'broke' }, { q:'무엇을?', en:'the window' }, { q:'언제?', en:'yesterday' }],
            answer: 'I broke the window yesterday.' },
          { ko: '그 창문은 어제 깨졌다 (누가 했는지 모름)',
            steps: [{ q:'무엇이?', en:'The window', hint:'"~됐다" → 수동으로' }, { q:'~되었다?', en:'was broken' }, { q:'언제?', en:'yesterday' }],
            answer: 'The window was broken yesterday.' },
          { ko: '그 사고는 지난밤에 일어났다',
            steps: [{ q:'무엇이?', en:'The accident' }, { q:'일어났다?', en:'happened', hint:'happen은 스스로 벌어지는 일 → 수동태 금지!' }, { q:'언제?', en:'last night' }],
            answer: 'The accident happened last night.' },
        ],
        challenges: [
          { ko:'그 도둑은 어젯밤에 잡혔다.', answer:'The thief was caught last night.',
            chunks:[{ lab:'판단', ko:'"잡혔다" → 수동' }, { lab:'무엇이', ko:'그 도둑은' }, { lab:'~되었다', ko:'was caught' }] },
          { ko:'경찰이 그 도둑을 잡았다.', answer:'The police caught the thief.' },
          { ko:'그 콘서트는 취소되었다.', answer:'The concert was canceled.' },
          { ko:'그 사고는 오늘 아침에 일어났다.', answer:'The accident happened this morning.' },
          { ko:'쌀은 한국에서 재배된다.', answer:'Rice is grown in Korea.' },
        ],
        similar: [
          { ko:'그녀가 어제 저녁을 요리했다.', answer:'She cooked dinner yesterday.' },
          { ko:'그 경기는 비 때문에 취소되었다.', answer:'The game was canceled because of the rain.' },
        ],
      },
    ],

    /* ── L7 총정리 (AI가 20문제 새로 출제. 아래는 폴백) ── */
    exam: {
      passScore: RULES.EXAM_PASS,
      total: RULES.EXAM_TOTAL,
      questions: [
        { ko:'그 문은 밤에 잠긴다.',                 answer:'The door is locked at night.',          from:'L7-1' },
        { ko:'그 편지는 어제 보내졌다.',             answer:'The letter was sent yesterday.',        from:'L7-1' },
        { ko:'이 노래는 많은 사람들에게 사랑받는다.', answer:'This song is loved by many people.',    from:'L7-1' },
        { ko:'그 케이크는 내일 배달될 것이다.',       answer:'The cake will be delivered tomorrow.',  from:'L7-2' },
        { ko:'새 학교가 지금 지어지고 있다.',         answer:'A new school is being built now.',      from:'L7-2' },
        { ko:'그 문제는 이미 해결되었다.',            answer:'The problem has already been solved.',  from:'L7-2' },
        { ko:'그의 전화기가 어제 도난당했다.',        answer:'His phone got stolen yesterday.',       from:'L7-3' },
        { ko:'그녀는 서울에서 태어났다.',             answer:'She was born in Seoul.',                from:'L7-3' },
        { ko:'경찰이 그 도둑을 잡았다.',              answer:'The police caught the thief.',          from:'L7-4' },
        { ko:'그 사고는 오늘 아침에 일어났다.',       answer:'The accident happened this morning.',   from:'L7-4' },
      ],
    },
  },
  {
    level: 8, threshold: 2, stage: '정교', bookLabel: '2차 임계점',
    theme: { ink:'#1D1D1F', accent:'#5856D6', soft:'#EEEEFB' },
    title: '준동사 + 다듬기', skill: '정교 쌉가능',
    skillDesc: 'L8 클리어 — 2차 임계점 완주! 동사 두 개가 나와도 겁나지 않고, 묻고·꾸미고·다듬는 것까지 정교해졌어요.',
    nextHint: 'LEVEL 9 · 뉘앙스 조동사',
    units: [

      /* ---------------------------------------------------------------- */
      {
        id: 'L8-1',
        title: 'to부정사 (~하는 것 / ~하려고)',
        tagline: 'to부정사 — 진짜 동사는 하나, 뒤 동사엔 to 옷을 입혀요',
        skeleton: '누가 + 한다 + to 동사원형',
        focus: 'to부정사 / want·decide·hope to · 목적의 to',
        card: {
          achieve: '이걸 익히면 한 문장에 <b>동사가 두 개</b> 나와도 만들 수 있어요. "~하고 싶다, ~하기로 했다, ~하려고"가 전부 열려요.',
          howto: '"나는 <b>원한다</b> + <b>마시는 것을</b>"처럼 동사가 두 개면 — <b>진짜 동사는 하나</b>예요. 뒤 동사에는 <b>to 옷</b>을 입혀요. 한국어 신호는 둘: <b>"~하는 것을/~하기로"</b>(want to·decide to·hope to), <b>"~하려고/~하기 위해"</b>(목적). 울타리 — <b>to 뒤는 무조건 동사원형</b>이에요 (to went ❌, to going ❌).',
          demo: {
            ko: ['나는', '의사가 되는 것을', '원한다'],
            steps: [
              { q: '누가?',    ko: '나는',                    en: 'I' },
              { q: '한다?',    ko: '원한다 (진짜 동사!)',       en: 'want' },
              { q: '무엇을?',  ko: '의사가 되는 것을 (to 옷)',  en: 'to be a doctor' },
            ],
            answer: 'I want to be a doctor.',
            tip: '동사 두 개 → 뒤 동사에 to 옷. "~하는 것을"이 신호예요.',
          },
        },
        practice: [
          { ko: '나는 영어를 배우기로 결심했다',
            steps: [{ q:'누가?', en:'I' }, { q:'했다?', en:'decided', hint:'진짜 동사는 decided 하나' }, { q:'무엇을?', en:'to learn English', hint:'"~하기로" → to + 동사원형' }],
            answer: 'I decided to learn English.' },
          { ko: '그녀는 가수가 되기를 희망한다',
            steps: [{ q:'누가?', en:'She' }, { q:'한다?', en:'hopes', hint:'한 명 → hopes' }, { q:'무엇을?', en:'to become a singer' }],
            answer: 'She hopes to become a singer.' },
          { ko: '나는 책을 사려고 서점에 갔다',
            steps: [{ q:'누가?', en:'I' }, { q:'했다?', en:'went' }, { q:'어디에?', en:'to the bookstore' }, { q:'왜?', en:'to buy a book', hint:'"~하려고" → 목적의 to' }],
            answer: 'I went to the bookstore to buy a book.' },
        ],
        challenges: [
          { ko:'나는 물을 마시고 싶다.', answer:'I want to drink water.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'한다', ko:'원한다 (진짜 동사)' }, { lab:'무엇을', ko:'마시는 것을 → to drink' }, { lab:'무엇을2', ko:'물을' }] },
          { ko:'우리는 일찍 떠나기로 결정했다.', answer:'We decided to leave early.' },
          { ko:'그는 시험에 합격하기를 희망한다.', answer:'He hopes to pass the exam.' },
          { ko:'나는 표를 사려고 줄을 섰다.', answer:'I stood in line to buy a ticket.' },
          { ko:'그녀는 살을 빼기 위해 매일 운동한다.', answer:'She exercises every day to lose weight.' },
        ],
        similar: [
          { ko:'나는 좀 쉬는 것이 필요하다.', answer:'I need to take a rest.' },
          { ko:'그는 나를 도와주려고 왔다.', answer:'He came to help me.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L8-2',
        title: '동명사 (-ing)',
        tagline: '동명사 — 동사에 -ing 옷을 입히면 명사가 돼요',
        skeleton: '~하는 것(-ing) + 은/을',
        focus: '동명사 / 주어 자리 · enjoy·finish 뒤 · 전치사 뒤',
        card: {
          achieve: '이걸 익히면 <b>"~하는 것"을 -ing로도</b> 만들 수 있어요. 주어 자리에도, 동사 뒤에도, 전치사 뒤에도 쓸 수 있어요.',
          howto: '동사에 <b>-ing 옷</b>을 입히면 명사가 돼요. 자리는 셋 — ① <b>주어 자리</b>(Reading books is fun — L6에서 배운 대로 <b>-ing 주어는 하나 취급 → is</b>), ② <b>enjoy·finish·keep 뒤</b>, ③ <b>전치사 뒤</b>(good at swimming). 울타리 — <b>전치사 뒤에는 to 동사원형 금지, 무조건 -ing</b>예요 (good at to swim ❌).',
          demo: {
            ko: ['나는', '음악 듣는 것을', '즐긴다'],
            steps: [
              { q: '누가?',    ko: '나는',                       en: 'I' },
              { q: '한다?',    ko: '즐긴다 (진짜 동사!)',          en: 'enjoy' },
              { q: '무엇을?',  ko: '음악 듣는 것을 (-ing 옷)',     en: 'listening to music' },
            ],
            answer: 'I enjoy listening to music.',
            tip: 'enjoy 뒤에는 -ing 옷. "~하는 것을"을 -ing로 만들어요.',
          },
        },
        practice: [
          { ko: '영어를 공부하는 것은 재미있다',
            steps: [{ q:'무엇이?', en:'Studying English', hint:'-ing 주어 (하나 취급!)' }, { q:'어떠하다?', en:'is fun', hint:'L6 수 일치 — -ing 주어 → is' }],
            answer: 'Studying English is fun.' },
          { ko: '그는 숙제 하는 것을 끝냈다',
            steps: [{ q:'누가?', en:'He' }, { q:'했다?', en:'finished', hint:'finish 뒤엔 -ing' }, { q:'무엇을?', en:'doing his homework' }],
            answer: 'He finished doing his homework.' },
          { ko: '그녀는 그림 그리기를 잘한다',
            steps: [{ q:'누가?', en:'She' }, { q:'어떠하다?', en:'is good at', hint:'잘한다 → be good at' }, { q:'무엇을?', en:'drawing', hint:'전치사 at 뒤 → 무조건 -ing' }],
            answer: 'She is good at drawing.' },
        ],
        challenges: [
          { ko:'나는 요리하는 것을 즐긴다.', answer:'I enjoy cooking.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'한다', ko:'즐긴다' }, { lab:'무엇을', ko:'요리하는 것을 → cooking' }] },
          { ko:'아침에 걷는 것은 건강에 좋다.', answer:'Walking in the morning is good for health.' },
          { ko:'그는 방 청소하는 것을 끝냈다.', answer:'He finished cleaning his room.' },
          { ko:'나는 수영을 잘한다.', answer:'I am good at swimming.' },
          { ko:'내 취미는 사진 찍는 것이다.', answer:'My hobby is taking pictures.' },
        ],
        similar: [
          { ko:'나는 노래 부르는 것을 즐긴다.', answer:'I enjoy singing.' },
          { ko:'그녀는 요리를 잘한다.', answer:'She is good at cooking.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L8-3',
        title: 'to파 vs -ing파',
        tagline: '갈라 쓰기 — 어느 옷을 입힐지는 앞 동사가 정해요',
        skeleton: 'want류 + to ~  /  enjoy류 + -ing',
        focus: '준동사 선택 / 동사 궁합 (want to vs enjoy -ing)',
        card: {
          achieve: '이걸 익히면 <b>to를 입힐지 -ing를 입힐지</b> 고를 수 있어요. L8에서 가장 중요한 유닛이에요.',
          howto: '내가 고르는 게 아니라 <b>앞 동사가 정해요 (궁합!)</b>. <b>to파</b> — want·hope·decide·plan·need (앞으로 할 일 느낌). <b>-ing파</b> — enjoy·finish·keep·give up (하던 일 느낌). <b>둘 다 파</b> — like·love·start·begin (뜻 차이 거의 없음). 울타리 — <b>enjoy to ❌, want -ing ❌.</b> 궁합이 틀리면 문장이 무너져요.',
          demo: {
            ko: ['같은 "축구"도', '앞 동사 따라 옷이 달라요'],
            steps: [
              { q: 'to파',    ko: '나는 축구 하기를 원한다',      en: 'I want to play soccer.' },
              { q: '-ing파',  ko: '나는 축구 하는 것을 즐긴다',    en: 'I enjoy playing soccer.' },
            ],
            answer: '앞 동사가 옷을 정해요 — want는 to파, enjoy는 -ing파',
            tip: 'to파: want·hope·decide·plan / -ing파: enjoy·finish·keep',
          },
        },
        practice: [
          { ko: '나는 유학 가기로 계획했다',
            steps: [{ q:'누가?', en:'I' }, { q:'했다?', en:'planned', hint:'plan은 to파!' }, { q:'무엇을?', en:'to study abroad' }],
            answer: 'I planned to study abroad.' },
          { ko: '그는 계속 웃었다',
            steps: [{ q:'누가?', en:'He' }, { q:'했다?', en:'kept', hint:'keep은 -ing파! (keep → kept)' }, { q:'무엇을?', en:'laughing' }],
            answer: 'He kept laughing.' },
          { ko: '아기가 울기 시작했다',
            steps: [{ q:'누가?', en:'The baby' }, { q:'했다?', en:'started', hint:'start는 둘 다 파 — to cry도 crying도 OK' }, { q:'무엇을?', en:'to cry' }],
            answer: 'The baby started to cry.' },
        ],
        challenges: [
          { ko:'나는 새 자전거를 사기를 원한다.', answer:'I want to buy a new bike.',
            chunks:[{ lab:'판단', ko:'want → to파' }, { lab:'누가', ko:'나는' }, { lab:'한다', ko:'원한다' }, { lab:'무엇을', ko:'사는 것을 → to buy' }] },
          { ko:'그녀는 피아노 치는 것을 즐긴다.', answer:'She enjoys playing the piano.' },
          { ko:'우리는 내일 만나기로 계획했다.', answer:'We planned to meet tomorrow.' },
          { ko:'그는 게임하는 것을 포기했다.', answer:'He gave up playing games.' },
          { ko:'눈이 내리기 시작했다.', answer:'It started to snow.' },
        ],
        similar: [
          { ko:'나는 밤에 공부하기로 결심했다.', answer:'I decided to study at night.' },
          { ko:'그녀는 계속 이야기했다.', answer:'She kept talking.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L8-4',
        title: '분사 (~하는 · ~된)',
        tagline: '분사 — 동사에 옷을 입혀 꾸밈말로 써요',
        skeleton: '-ing/p.p. + 명사  /  명사 + -ing/p.p. 덩어리',
        focus: '현재분사·과거분사 / 명사 꾸미기',
        card: {
          achieve: '이걸 익히면 <b>동사로 명사를 꾸밀 수</b> 있어요. "울고 있는 아기, 깨진 창문"처럼 그림이 살아나는 꾸미기예요.',
          howto: '동사에 옷을 입혀 꾸밈말을 만들어요. 판단은 <b>L7 방식 그대로</b> — 그 명사가 <b>하는 쪽이면 -ing</b>(울고 있는 아기), <b>당하는 쪽이면 p.p.</b>(깨진 창문). 자리는 <b>L4 꾸미기 규칙 그대로</b> — <b>한 단어면 명사 앞</b>(the crying baby), <b>덩어리면 명사 뒤</b>(the girl singing on the stage).',
          demo: {
            ko: ['잠자고 있는', '아기를', '봐'],
            steps: [
              { q: '꾸밈말?',  ko: '잠자고 있는 (하는 쪽 → -ing)', en: 'sleeping' },
              { q: '무엇을?',  ko: '아기를',                      en: 'the sleeping baby' },
              { q: '한다?',    ko: '봐',                          en: 'Look at' },
            ],
            answer: 'Look at the sleeping baby.',
            tip: '하는 쪽 → -ing, 당하는 쪽 → p.p. 한 단어면 명사 앞!',
          },
        },
        practice: [
          { ko: '무대에서 노래하고 있는 그 소녀는 내 친구다',
            steps: [{ q:'핵심 주어?', en:'The girl', hint:'꾸밈 덩어리는 뒤로' }, { q:'꾸밈 덩어리?', en:'singing on the stage', hint:'하는 쪽 → -ing' }, { q:'어떠하다?', en:'is my friend', hint:'주어는 girl 하나 → is' }],
            answer: 'The girl singing on the stage is my friend.' },
          { ko: '그는 깨진 창문을 고쳤다',
            steps: [{ q:'누가?', en:'He' }, { q:'했다?', en:'fixed' }, { q:'무엇을?', en:'the broken window', hint:'당하는 쪽 → p.p. (한 단어 → 명사 앞)' }],
            answer: 'He fixed the broken window.' },
          { ko: '나는 영어로 쓰인 책을 읽었다',
            steps: [{ q:'누가?', en:'I' }, { q:'했다?', en:'read' }, { q:'무엇을?', en:'a book written in English', hint:'덩어리 → 명사 뒤 (당하는 쪽 → written)' }],
            answer: 'I read a book written in English.' },
        ],
        challenges: [
          { ko:'저 울고 있는 아기를 봐.', answer:'Look at the crying baby.',
            chunks:[{ lab:'판단', ko:'아기가 하는 쪽 → -ing' }, { lab:'꾸밈말', ko:'울고 있는 → crying' }, { lab:'자리', ko:'한 단어 → 명사 앞' }] },
          { ko:'그는 삶은 달걀을 먹었다.', answer:'He ate a boiled egg.' },
          { ko:'벤치에 앉아 있는 그 남자는 우리 아빠다.', answer:'The man sitting on the bench is my dad.' },
          { ko:'나는 중고차를 샀다.', answer:'I bought a used car.' },
          { ko:'프랑스에서 만들어진 그 가방은 비싸다.', answer:'The bag made in France is expensive.' },
        ],
        similar: [
          { ko:'떨어지는 나뭇잎들을 봐.', answer:'Look at the falling leaves.' },
          { ko:'그녀는 도난당한 지갑을 찾았다.', answer:'She found the stolen wallet.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L8-5',
        title: '의문사 의문문 · 다양한 부정',
        tagline: '다듬기 — 뭐가·어디서·왜까지 묻고, 부정도 골라 써요',
        skeleton: '의문사 + (L3 물음 뼈대)  /  never · not always',
        focus: 'wh-의문문 / never · 부분부정',
        card: {
          achieve: '이걸 익히면 Yes/No를 넘어 <b>"뭐? 어디서? 언제? 왜?"</b>까지 물을 수 있고, 부정도 <b>"한 번도 안 / 항상 ~인 건 아냐"</b>로 세밀해져요.',
          howto: '만들기는 간단 — <b>궁금한 것(의문사)을 맨 앞에</b> 세우고, 뒤는 <b>L3 의문문 뼈대 그대로</b>예요 (What + do you like?). 울타리 — <b>did를 썼으면 동사는 원형</b>(When did she left ❌). 부정 다듬기 — <b>never</b>(한 번도 안, not 없이 혼자 씀), <b>not always</b>(항상 ~인 건 아니야).',
          demo: {
            ko: ['너는', '무엇을', '원하니?'],
            steps: [
              { q: '궁금한 것?',  ko: '무엇을 → 맨 앞으로!',  en: 'What' },
              { q: '물음 뼈대?',  ko: 'L3 그대로',           en: 'do you' },
              { q: '한다?',      ko: '원하다',              en: 'want' },
            ],
            answer: 'What do you want?',
            tip: '의문사 먼저, 나머지는 L3 의문문 그대로 이어요.',
          },
        },
        practice: [
          { ko: '너는 왜 영어를 공부하니?',
            steps: [{ q:'궁금한 것?', en:'Why', hint:'이유 → Why 맨 앞' }, { q:'물음 뼈대?', en:'do you' }, { q:'한다?', en:'study English' }],
            answer: 'Why do you study English?' },
          { ko: '그녀는 언제 떠났니?',
            steps: [{ q:'궁금한 것?', en:'When' }, { q:'물음 뼈대?', en:'did she', hint:'과거 물음 → did' }, { q:'한다?', en:'leave', hint:'did를 썼으니 원형! (left ❌)' }],
            answer: 'When did she leave?' },
          { ko: '나는 아침을 한 번도 거르지 않는다',
            steps: [{ q:'누가?', en:'I' }, { q:'한 번도 안?', en:'never skip', hint:'never는 동사 앞, not 없이 혼자!' }, { q:'무엇을?', en:'breakfast' }],
            answer: 'I never skip breakfast.' },
        ],
        challenges: [
          { ko:'너는 어디에 사니?', answer:'Where do you live?',
            chunks:[{ lab:'궁금한 것', ko:'어디 → Where 맨 앞' }, { lab:'물음 뼈대', ko:'do you' }, { lab:'한다', ko:'살다' }] },
          { ko:'그는 언제 도착했니?', answer:'When did he arrive?' },
          { ko:'너는 어떻게 학교에 가니?', answer:'How do you go to school?' },
          { ko:'나는 그 영화를 한 번도 본 적이 없다.', answer:'I have never seen the movie.' },
          { ko:'그녀는 항상 바쁜 것은 아니다.', answer:'She is not always busy.' },
        ],
        similar: [
          { ko:'너는 왜 늦었니?', answer:'Why were you late?' },
          { ko:'너는 무엇을 먹고 싶니?', answer:'What do you want to eat?' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L8-6',
        title: '간접의문문 (돌려서 정중하게)',
        tagline: '다듬기 — 물음을 문장 안에 넣어 정중하게 물어요',
        skeleton: 'Could you tell me / Do you know + 의문사 + 주어 + 동사',
        focus: '간접의문문 어순 / 정중한 질문',
        card: {
          achieve: '이걸 익히면 같은 질문을 <b>툭 던지지 않고 정중하게</b> 물을 수 있어요. 처음 보는 사람, 선생님, 가게 직원에게 쓰는 말투예요.',
          howto: '진입로 — 앞에 <b>Could you tell me</b>(알려 주실 수 있나요) 또는 <b>Do you know</b>(아세요)를 머리로 붙이고, 원래 질문을 뒤에 이어요. 핵심 — 질문이 <b>문장 안으로 들어가면 물음 뼈대(do·does·did)가 사라지고</b> 다시 평서문 어순이 돼요. 울타리 — <b>where is he ❌ / where he is ⭕</b>, <b>did를 쓰던 건 동사를 과거형으로</b>(where did he go → where he went). 의문사가 없는 Yes/No 질문이면 의문사 자리에 <b>if</b>를 넣어요.',
          demo: {
            ko: ['그가', '어디 사는지', '아세요?'],
            steps: [
              { q: '정중한 머리?', ko: '아세요',                    en: 'Do you know' },
              { q: '궁금한 것?',  ko: '어디',                      en: 'where' },
              { q: '누가 한다?',  ko: '그가 산다 — 평서문 어순으로!', en: 'he lives' },
            ],
            answer: 'Do you know where he lives?',
            tip: '머리를 붙이는 순간 뒤는 물음이 아니라 평서문이 됩니다.',
          },
        },
        practice: [
          { ko: '화장실이 어디인지 알려 주실 수 있나요?',
            steps: [{ q:'정중한 머리?', en:'Could you tell me' }, { q:'궁금한 것?', en:'where' }, { q:'누가 한다?', en:'the bathroom is', hint:'is가 뒤로! where is the bathroom ❌' }],
            answer: 'Could you tell me where the bathroom is?' },
          { ko: '그녀가 언제 도착했는지 아세요?',
            steps: [{ q:'정중한 머리?', en:'Do you know' }, { q:'궁금한 것?', en:'when' }, { q:'누가 한다?', en:'she arrived', hint:'did가 사라지고 동사가 과거형! when did she arrive ❌' }],
            answer: 'Do you know when she arrived?' },
          { ko: '그가 한국인인지 아세요?',
            steps: [{ q:'정중한 머리?', en:'Do you know' }, { q:'의문사가 없으면?', en:'if', hint:'Yes/No 질문이면 if를 그 자리에' }, { q:'누가 한다?', en:'he is Korean' }],
            answer: 'Do you know if he is Korean?' },
        ],
        challenges: [
          { ko:'(처음 보는 가게 직원에게) 이게 얼마인지 알려 주실 수 있나요?', answer:'Could you tell me how much this is?',
            chunks:[{ lab:'정중한 머리', ko:'알려 주실 수 있나요' }, { lab:'궁금한 것', ko:'얼마' }, { lab:'누가 한다', ko:'이것이 ~이다 (평서문 어순)' }] },
          { ko:'그가 어디에 갔는지 아세요?', answer:'Do you know where he went?' },
          { ko:'역이 어디인지 알려 주실 수 있나요?', answer:'Could you tell me where the station is?' },
          { ko:'그녀가 무엇을 원하는지 아세요?', answer:'Do you know what she wants?' },
          { ko:'그가 올지 아세요?', answer:'Do you know if he will come?' },
        ],
        similar: [
          { ko:'수업이 언제 시작하는지 알려 주실 수 있나요?', answer:'Could you tell me when the class starts?' },
          { ko:'그것이 사실인지 아세요?', answer:'Do you know if it is true?' },
        ],
      },
    ],

    /* ── L8 총정리 (AI가 20문제 새로 출제. 아래는 폴백) ── */
    exam: {
      passScore: RULES.EXAM_PASS,
      total: RULES.EXAM_TOTAL,
      questions: [
        { ko:'나는 물을 마시고 싶다.',             answer:'I want to drink water.',                 from:'L8-1' },
        { ko:'그녀는 살을 빼기 위해 매일 운동한다.', answer:'She exercises every day to lose weight.', from:'L8-1' },
        { ko:'나는 요리하는 것을 즐긴다.',          answer:'I enjoy cooking.',                       from:'L8-2' },
        { ko:'나는 수영을 잘한다.',                answer:'I am good at swimming.',                 from:'L8-2' },
        { ko:'우리는 내일 만나기로 계획했다.',      answer:'We planned to meet tomorrow.',           from:'L8-3' },
        { ko:'그는 게임하는 것을 포기했다.',        answer:'He gave up playing games.',              from:'L8-3' },
        { ko:'그는 삶은 달걀을 먹었다.',            answer:'He ate a boiled egg.',                   from:'L8-4' },
        { ko:'벤치에 앉아 있는 그 남자는 우리 아빠다.', answer:'The man sitting on the bench is my dad.', from:'L8-4' },
        { ko:'그는 언제 도착했니?',                answer:'When did he arrive?',                    from:'L8-5' },
        { ko:'나는 그 영화를 한 번도 본 적이 없다.', answer:'I have never seen the movie.',           from:'L8-5' },
        { ko:'그가 어디 사는지 아세요?',            answer:'Do you know where he lives?',            from:'L8-6' },
        { ko:'화장실이 어디인지 알려 주실 수 있나요?', answer:'Could you tell me where the bathroom is?', from:'L8-6' },
      ],
    },
  },
  {
    level: 9, threshold: 3, stage: '세련', bookLabel: '3차 임계점',
    theme: { ink:'#8F4000', accent:'#B25000', soft:'#FDF1E5' },
    title: '뉘앙스 조동사', skill: '뉘앙스 쌉가능',
    skillDesc: '같은 사실도 마음을 담아 말할 수 있어요. 여기부터는 틀림이 아니라 어울림이에요.',
    nextHint: 'LEVEL 10 · 비교로 정도 말하기',
    units: [
      /* ---------------------------------------------------------------- */
      {
        id: 'L9-1',
        title: 'used to (예전엔 ~했다)',
        tagline: '뉘앙스 — 지금은 아닌 옛날 일을 말해요',
        skeleton: '누가 + used to + 동사원형',
        focus: 'used to / 과거의 습관·상태',
        card: {
          achieve: '이걸 익히면 <b>"예전엔 그랬는데 지금은 아니야"</b>를 한 마디로 말할 수 있어요. 그냥 과거형과는 느낌이 달라요.',
          howto: '한국어 신호 — <b>"예전엔 ~했었다 / 옛날엔 ~였다"</b>가 보이면 used to. 만들기 — <b>used to 뒤엔 무조건 동사원형</b>이에요. 감각 — <b>I played soccer</b>는 그냥 옛날에 했다는 사실, <b>I used to play soccer</b>는 <b>"지금은 안 한다"</b>까지 담겨요. 울타리 — <b>used to played ❌</b>, 부정은 <b>didn\'t use to</b>(d가 빠져요), 상태는 <b>used to be</b>.',
          demo: {
            ko: ['나는', '예전엔', '커피를 마셨다 (지금은 아님)'],
            steps: [
              { q: '누가?',        ko: '나는',                    en: 'I' },
              { q: '예전엔 ~했다?', ko: '지금은 아니라는 신호!',     en: 'used to' },
              { q: '한다?',        ko: '마시다 — 원형 그대로',      en: 'drink coffee' },
            ],
            answer: 'I used to drink coffee.',
            tip: 'used to 뒤는 언제나 동사원형. drank ❌',
          },
        },
        practice: [
          { ko: '나는 예전에 매일 아침 조깅을 했다 (지금은 안 함)',
            steps: [{ q:'누가?', en:'I' }, { q:'예전엔 ~했다?', en:'used to', hint:'지금은 아니라는 신호' }, { q:'한다?', en:'jog every morning', hint:'원형! jogged ❌' }],
            answer: 'I used to jog every morning.' },
          { ko: '그녀는 예전에 수줍음이 많았다',
            steps: [{ q:'누가?', en:'She' }, { q:'예전엔 ~였다?', en:'used to be', hint:'상태는 used to be' }, { q:'어떤?', en:'shy' }],
            answer: 'She used to be shy.' },
          { ko: '우리는 예전엔 해외여행을 가지 않았다',
            steps: [{ q:'누가?', en:'We' }, { q:'예전엔 안 했다?', en:'didn\'t use to', hint:'부정은 use to — d가 빠져요!' }, { q:'한다?', en:'travel abroad' }],
            answer: 'We didn\'t use to travel abroad.' },
        ],
        challenges: [
          { ko:'나는 예전에 유튜브를 많이 봤다 (지금은 안 봄).', answer:'I used to watch YouTube a lot.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'예전엔', ko:'used to' }, { lab:'한다', ko:'보다 — 원형' }, { lab:'무엇을', ko:'유튜브를 많이' }] },
          { ko:'그는 예전에 이 근처에 살았다.', answer:'He used to live near here.' },
          { ko:'이곳은 예전에 학교였다.', answer:'This used to be a school.' },
          { ko:'나는 예전엔 채소를 좋아하지 않았다.', answer:'I didn\'t use to like vegetables.' },
          { ko:'우리는 예전에 매주 일요일에 만났다.', answer:'We used to meet every Sunday.' },
        ],
        similar: [
          { ko:'그녀는 예전에 피아노를 쳤다.', answer:'She used to play the piano.' },
          { ko:'나는 예전엔 뚱뚱했다.', answer:'I used to be fat.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L9-2',
        title: 'would · could (부드럽게 부탁하기)',
        tagline: '뉘앙스 — 한 칸 물러서면 정중해져요',
        skeleton: 'I would like to ~  /  Could you ~?  /  Would you like me to ~?',
        focus: '공손한 would · could / 정중한 요청',
        card: {
          achieve: '이걸 익히면 같은 부탁도 <b>부드럽게</b> 할 수 있어요. want를 would like로 바꾸는 것만으로 말투가 달라져요.',
          howto: '핵심 감각 — <b>과거형 조동사를 쓰면 한 칸 물러서서 정중해져요.</b> 세 가지만 익히면 됩니다. ① 내 바람: <b>I want to ❌ → I would like to ⭕</b> ② 상대에게 부탁: <b>Can you ~? → Could you ~?</b> ③ 내가 해 줄까 제안: <b>Would you like me to ~?</b>(제가 ~해 드릴까요?). 울타리 — <b>would like 뒤엔 to + 동사원형</b>, would like -ing ❌.',
          demo: {
            ko: ['저는', '예약을 하고', '싶습니다 (정중하게)'],
            steps: [
              { q: '누가?',        ko: '저는',                        en: 'I' },
              { q: '원한다?',      ko: 'want 대신 — 한 칸 물러서기',   en: 'would like' },
              { q: '무엇을?',      ko: '예약하는 것을',                en: 'to make a reservation' },
            ],
            answer: 'I would like to make a reservation.',
            tip: 'I want to = 편한 사이 / I would like to = 정중한 자리',
          },
        },
        practice: [
          { ko: '(식당에서) 저는 물 한 잔을 원합니다',
            steps: [{ q:'누가?', en:'I' }, { q:'원한다? (정중)', en:'would like', hint:'want ❌ — 처음 보는 사람에겐 would like' }, { q:'무엇을?', en:'a glass of water' }],
            answer: 'I would like a glass of water.' },
          { ko: '(선생님께) 이것 좀 도와주실 수 있나요?',
            steps: [{ q:'정중한 부탁?', en:'Could you', hint:'Can you보다 한 칸 물러선 Could you' }, { q:'한다?', en:'help me' }, { q:'무엇을?', en:'with this' }],
            answer: 'Could you help me with this?' },
          { ko: '(손님에게) 제가 그 예약을 확인해 드릴까요?',
            steps: [{ q:'제가 해 드릴까요?', en:'Would you like me to', hint:'내가 해 줄까 제안하는 정중한 틀' }, { q:'한다?', en:'confirm' }, { q:'무엇을?', en:'the reservation' }],
            answer: 'Would you like me to confirm the reservation?' },
        ],
        challenges: [
          { ko:'(카페에서 처음 보는 직원에게) 저는 아이스 아메리카노를 주문하고 싶습니다.', answer:'I would like to order an iced americano.',
            chunks:[{ lab:'누가', ko:'저는' }, { lab:'원한다(정중)', ko:'would like' }, { lab:'무엇을', ko:'주문하는 것을 → to order' }] },
          { ko:'(모르는 사람에게) 창문 좀 닫아 주실 수 있나요?', answer:'Could you close the window?' },
          { ko:'제가 자세한 내용을 이메일로 보내 드릴까요?', answer:'Would you like me to send you the details by email?' },
          { ko:'저는 이 재킷을 입어 보고 싶습니다.', answer:'I would like to try on this jacket.' },
          { ko:'(선생님께) 다시 한번 설명해 주실 수 있나요?', answer:'Could you explain it again?' },
        ],
        similar: [
          { ko:'저는 창가 자리에 앉고 싶습니다.', answer:'I would like to sit by the window.' },
          { ko:'제가 문을 열어 드릴까요?', answer:'Would you like me to open the door?' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L9-3',
        title: 'should have p.p. (후회)',
        tagline: '뉘앙스 — 안 해서 아쉬운 일을 말해요',
        skeleton: '누가 + should have + p.p.',
        focus: 'should have p.p. / 후회·자책',
        card: {
          achieve: '이걸 익히면 <b>"~했어야 했는데"</b>라는 후회를 말할 수 있어요. 지나간 일에 대한 아쉬움이에요.',
          howto: '한국어 신호 — <b>"~할걸 / ~했어야 했는데 / ~하지 말걸"</b>. 만들기 — <b>should have + 과거분사(p.p.)</b>, 세 덩어리를 통째로 외우세요. 감각 — <b>실제로는 안 했다</b>는 뜻이 항상 깔려 있어요 (I should have studied = 공부 안 했음). 반대는 <b>shouldn\'t have p.p.</b>(~하지 말걸 = 실제로는 했음). 울타리 — <b>should have studied ⭕ / should studied ❌ / should have study ❌</b>.',
          demo: {
            ko: ['나는', '더 일찍', '떠났어야 했는데 (안 떠났음)'],
            steps: [
              { q: '누가?',      ko: '나는',                        en: 'I' },
              { q: '했어야 했다?', ko: '후회 — 통째로',               en: 'should have' },
              { q: '한다?',      ko: '떠나다 → p.p.로',             en: 'left' },
            ],
            answer: 'I should have left earlier.',
            tip: '말하는 순간 이미 안 한 것. 그래서 후회입니다.',
          },
        },
        practice: [
          { ko: '나는 더 열심히 공부했어야 했는데 (안 했음)',
            steps: [{ q:'누가?', en:'I' }, { q:'했어야 했다?', en:'should have', hint:'후회 통째 덩어리' }, { q:'한다?', en:'studied harder', hint:'p.p.! study → studied' }],
            answer: 'I should have studied harder.' },
          { ko: '너는 나에게 말했어야 했어',
            steps: [{ q:'누가?', en:'You' }, { q:'했어야 했다?', en:'should have' }, { q:'한다?', en:'told me', hint:'tell → told (p.p.)' }],
            answer: 'You should have told me.' },
          { ko: '나는 그렇게 많이 먹지 말았어야 했는데 (실제로는 먹었음)',
            steps: [{ q:'누가?', en:'I' }, { q:'하지 말았어야 했다?', en:'shouldn\'t have', hint:'실제로는 했다는 뜻!' }, { q:'한다?', en:'eaten so much', hint:'eat → eaten (p.p.)' }],
            answer: 'I shouldn\'t have eaten so much.' },
        ],
        challenges: [
          { ko:'나는 그 표를 미리 샀어야 했는데.', answer:'I should have bought the ticket in advance.',
            chunks:[{ lab:'누가', ko:'나는' }, { lab:'했어야 했다', ko:'should have' }, { lab:'한다', ko:'사다 → bought (p.p.)' }, { lab:'무엇을', ko:'그 표를 미리' }] },
          { ko:'너는 그녀에게 사과했어야 했어.', answer:'You should have apologized to her.' },
          { ko:'우리는 더 일찍 출발했어야 했는데.', answer:'We should have started earlier.' },
          { ko:'나는 그렇게 말하지 말았어야 했는데.', answer:'I shouldn\'t have said that.' },
          { ko:'그는 우산을 가져왔어야 했는데.', answer:'He should have brought an umbrella.' },
        ],
        similar: [
          { ko:'나는 너의 말을 들었어야 했는데.', answer:'I should have listened to you.' },
          { ko:'나는 늦게 자지 말았어야 했는데.', answer:'I shouldn\'t have stayed up late.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L9-4',
        title: 'might · could · must have p.p. (과거 추측)',
        tagline: '뉘앙스 — 확신의 세기를 골라 말해요',
        skeleton: '누가 + might/could/must have + p.p.',
        focus: '과거 추측 / 확신의 정도',
        card: {
          achieve: '이걸 익히면 지나간 일을 <b>"~했을지도 몰라 / ~했을 수도 있어 / ~했음에 틀림없어"</b>로 세기를 조절해 말할 수 있어요.',
          howto: '틀은 하나예요 — <b>조동사 + have + p.p.</b>. 바뀌는 건 <b>앞의 조동사뿐</b>이고, 그게 <b>확신의 세기</b>를 정해요. <b>might have p.p.</b> = 약함(~했을지도 몰라) · <b>could have p.p.</b> = 중간(~했을 수도 있어) · <b>must have p.p.</b> = 강함(~했음에 틀림없어). 반대편 확신도 있어요 — <b>can\'t have p.p.</b>(~했을 리가 없어). 울타리 — <b>must be late</b>는 지금, <b>must have been late</b>는 과거예요.',
          demo: {
            ko: ['그는', '버스를', '놓쳤음에 틀림없다'],
            steps: [
              { q: '누가?',      ko: '그는',                      en: 'He' },
              { q: '확신 세기?',  ko: '틀림없다 → 가장 강함',       en: 'must have' },
              { q: '한다?',      ko: '놓치다 → p.p.로',           en: 'missed the bus' },
            ],
            answer: 'He must have missed the bus.',
            tip: 'might(약) → could(중) → must(강). 틀은 그대로, 앞만 바꿔요.',
          },
        },
        practice: [
          { ko: '그녀는 그것을 잊어버렸을지도 몰라 (약한 추측)',
            steps: [{ q:'누가?', en:'She' }, { q:'확신 세기?', en:'might have', hint:'~할지도 몰라 → 가장 약함' }, { q:'한다?', en:'forgotten it', hint:'forget → forgotten (p.p.)' }],
            answer: 'She might have forgotten it.' },
          { ko: '그는 열쇠를 잃어버렸음에 틀림없다 (강한 확신)',
            steps: [{ q:'누가?', en:'He' }, { q:'확신 세기?', en:'must have', hint:'틀림없다 → 가장 강함' }, { q:'한다?', en:'lost his key' }],
            answer: 'He must have lost his key.' },
          { ko: '그들이 이미 떠났을 수도 있어 (중간)',
            steps: [{ q:'누가?', en:'They' }, { q:'확신 세기?', en:'could have', hint:'~했을 수도 → 중간' }, { q:'한다?', en:'already left' }],
            answer: 'They could have already left.' },
        ],
        challenges: [
          { ko:'그는 그 소식을 못 들었을지도 몰라.', answer:'He might not have heard the news.',
            chunks:[{ lab:'누가', ko:'그는' }, { lab:'확신 세기', ko:'~할지도 몰라 → might' }, { lab:'과거 추측 틀', ko:'have + p.p.' }] },
          { ko:'너는 그것을 집에 두고 왔음에 틀림없어.', answer:'You must have left it at home.' },
          { ko:'그녀는 어제 아팠을 수도 있어.', answer:'She could have been sick yesterday.' },
          { ko:'그가 거짓말을 했을 리가 없어.', answer:'He can\'t have lied.' },
          { ko:'그들은 길을 잃었음에 틀림없다.', answer:'They must have gotten lost.' },
        ],
        similar: [
          { ko:'그녀는 버스를 놓쳤을지도 몰라.', answer:'She might have missed the bus.' },
          { ko:'너는 그것을 봤음에 틀림없어.', answer:'You must have seen it.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L9-5',
        title: '골라 쓰기 — 상황에 맞는 조동사',
        tagline: '골라 쓰기 — 둘 다 맞아요. 어울리는 걸 고르세요',
        skeleton: '상황(괄호) → 어울리는 조동사',
        focus: '조동사 선택 / 후회 vs 추측 vs 정중',
        card: {
          achieve: '이걸 익히면 <b>문법이 아니라 상황</b>을 보고 조동사를 고를 수 있어요. L9에서 가장 중요한 유닛이에요.',
          howto: '여기서는 <b>틀린 문장을 고치는 게 아니에요.</b> 둘 다 문법적으로 맞는데, <b>상황에 어울리는 쪽</b>을 고르는 훈련이에요. 그래서 문제마다 <b>괄호 안에 상황</b>이 붙어 있어요 — 그게 답을 정하는 신호입니다. 세 갈래만 구분하세요. <b>내 잘못이 아쉬우면</b> → should have p.p. · <b>남의 일을 짐작하면</b> → might/must have p.p. · <b>부탁이나 바람이면</b> → would like / Could you. 울타리 — <b>남을 나무랄 땐 should have를 피하세요</b>. 대신 <b>could have</b>를 쓰면 부드러워져요.',
          demo: {
            ko: ['같은 상황도', '마음에 따라', '조동사가 달라져요'],
            steps: [
              { q: '나를 탓하며', ko: '내가 더 일찍 나왔어야 했는데',  en: 'I should have left earlier.' },
              { q: '남을 짐작하며', ko: '그가 늦잠 잤나 보다',        en: 'He must have overslept.' },
              { q: '부드럽게 지적', ko: '조금 일찍 나올 수도 있었잖아', en: 'You could have left a little earlier.' },
            ],
            answer: '사실은 같아요. 다른 건 마음입니다.',
            tip: '괄호 안 상황을 먼저 읽으세요. 거기에 답이 있습니다.',
          },
        },
        practice: [
          { ko: '(지각한 친구를 나무라지 않고 부드럽게) 조금 일찍 나올 수도 있었잖아',
            steps: [{ q:'상황은?', en:'could have', hint:'나무라지 않음 → should have ❌, could have ⭕' }, { q:'누가?', en:'You' }, { q:'한다?', en:'left a little earlier' }],
            answer: 'You could have left a little earlier.' },
          { ko: '(약속에 늦은 나를 자책하며) 알람을 맞췄어야 했는데',
            steps: [{ q:'상황은?', en:'should have', hint:'내 잘못 + 아쉬움 → 후회' }, { q:'누가?', en:'I' }, { q:'한다?', en:'set an alarm' }],
            answer: 'I should have set an alarm.' },
          { ko: '(연락 없는 친구를 걱정하며 짐작) 그는 휴대폰을 잃어버렸을지도 몰라',
            steps: [{ q:'상황은?', en:'might have', hint:'짐작 + 확신 약함 → 추측' }, { q:'누가?', en:'He' }, { q:'한다?', en:'lost his phone' }],
            answer: 'He might have lost his phone.' },
        ],
        challenges: [
          { ko:'(처음 보는 가게 직원에게 정중하게) 저는 이것을 환불하고 싶습니다.', answer:'I would like to get a refund for this.',
            chunks:[{ lab:'상황', ko:'처음 보는 사람 + 정중 → would like' }, { lab:'누가', ko:'저는' }, { lab:'무엇을', ko:'환불받는 것을' }] },
          { ko:'(시험을 망친 나를 자책하며) 나는 더 열심히 공부했어야 했는데.', answer:'I should have studied harder.' },
          { ko:'(불 꺼진 친구 집을 보며 짐작) 그들은 이미 잠들었음에 틀림없어.', answer:'They must have already fallen asleep.' },
          { ko:'(선생님께 조심스럽게) 제출 기한을 하루만 미뤄 주실 수 있나요?', answer:'Could you push back the deadline by one day?' },
          { ko:'(실수한 동생을 다독이며) 누구나 그렇게 생각했을 수 있어.', answer:'Anyone could have thought so.' },
        ],
        similar: [
          { ko:'(나를 탓하며) 나는 그 말을 하지 말았어야 했는데.', answer:'I shouldn\'t have said that.' },
          { ko:'(정중하게 제안) 제가 도와드릴까요?', answer:'Would you like me to help you?' },
        ],
      },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 10, threshold: 3, stage: '세련', bookLabel: '3차 임계점',
    theme: { ink:'#8F4000', accent:'#B25000', soft:'#FDF1E5' },
    title: '비교로 정도 말하기', skill: '비교 쌉가능',
    skillDesc: '크다, 작다에서 멈추던 문장이 더 · 만큼 · 가장으로 정확해져요. 정도를 조절하는 단계예요.',
    nextHint: 'LEVEL 11 · 두 문장을 한 문장으로',
    units: [
      /* ---------------------------------------------------------------- */
      {
        id: 'L10-1',
        title: '비교급 · 최상급 (더 ~한 · 가장 ~한)',
        tagline: '비교 — 더 ~하다, 가장 ~하다를 만들어요',
        skeleton: '형용사/부사-er + than ~  /  the + 형용사/부사-est',
        focus: '비교급 · 최상급',
        card: {
          achieve: '지금까지는 <b>He is tall</b>까지만 말할 수 있었어요. 이제 <b>"~보다 더 크다"</b>, <b>"가장 크다"</b>까지 말할 수 있어요. 문장에 정도가 생깁니다.',
          howto: '한국어 신호 — <b>"더 ~한 …보다"</b>가 보이면 비교급 + than, <b>"가장 ~한"</b>이 보이면 the + 최상급. 만들기 — <b>짧은 말(1음절)은 -er / -est</b> (tall → taller → tallest), <b>긴 말(2음절 이상)은 more / most</b> (famous → more famous → most famous). 불규칙 세 개만 외우세요 — <b>good–better–best / bad–worse–worst / many·much–more–most</b>. 울타리 — <b>more taller ❌</b>(둘 중 하나만!), 최상급 앞엔 <b>the 필수</b>, 비교 대상은 <b>than 뒤</b>에.',
          demo: {
            ko: ['오늘이', '어제보다', '더 덥다'],
            steps: [
              { q: '무엇이?',    ko: '오늘이',                      en: 'Today' },
              { q: '어떤?',      ko: '더 더운 — hot에 -er',         en: 'is hotter' },
              { q: '무엇보다?',  ko: '어제보다 — than 뒤에',         en: 'than yesterday' },
            ],
            answer: 'Today is hotter than yesterday.',
            tip: '"더 ~한"은 -er, "가장 ~한"은 the -est. 긴 말이면 more / most.',
          },
        },
        practice: [
          { ko: '이 문제는 저 문제보다 더 쉽다',
            steps: [{ q:'무엇이?', en:'This question' }, { q:'어떤?', en:'is easier', hint:'easy → easier (y는 i로!)' }, { q:'무엇보다?', en:'than that one', hint:'반복되는 명사는 one으로' }],
            answer: 'This question is easier than that one.' },
          { ko: '그 영화는 그 책보다 더 흥미롭다',
            steps: [{ q:'무엇이?', en:'The movie' }, { q:'어떤?', en:'is more interesting', hint:'긴 형용사 → more + 원형. interestinger ❌' }, { q:'무엇보다?', en:'than the book' }],
            answer: 'The movie is more interesting than the book.' },
          { ko: '그는 우리 반에서 가장 빠른 학생이다',
            steps: [{ q:'누가?', en:'He' }, { q:'가장 ~한?', en:'is the fastest student', hint:'최상급 앞엔 the 필수!' }, { q:'어디에서?', en:'in my class' }],
            answer: 'He is the fastest student in my class.' },
        ],
        challenges: [
          { ko:'건강이 돈보다 더 중요하다.', answer:'Health is more important than money.',
            chunks:[{ lab:'무엇이', ko:'건강이' }, { lab:'어떤', ko:'더 중요한 — 긴 말이니 more' }, { lab:'무엇보다', ko:'돈보다 → than money' }] },
          { ko:'그녀는 나보다 더 일찍 일어난다.', answer:'She gets up earlier than me.' },
          { ko:'이것은 세상에서 가장 높은 건물이다.', answer:'This is the tallest building in the world.' },
          { ko:'내 점수는 지난번보다 더 나쁘다.', answer:'My score is worse than last time.' },
          { ko:'이것이 이 가게에서 가장 싼 가방이다.', answer:'This is the cheapest bag in this store.' },
        ],
        similar: [
          { ko:'서울은 부산보다 더 크다.', answer:'Seoul is bigger than Busan.' },
          { ko:'오늘은 내 인생에서 가장 행복한 날이다.', answer:'Today is the happiest day of my life.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L10-2',
        title: 'as ~ as (~만큼 …한)',
        tagline: '비교 — 만큼이라고 말하면 둘이 같아져요',
        skeleton: '누가 + 동사 + as 형용사/부사 as + 비교 대상',
        focus: '원급 비교',
        card: {
          achieve: '이걸 익히면 <b>"~만큼 …하다"</b>를 말할 수 있어요. 더도 덜도 아니고 <b>같은 정도</b>라고 말하는 틀이에요.',
          howto: '한국어 신호 — <b>"~만큼 …한/…하게"</b>. 만들기 — <b>as와 as 사이엔 원급</b>, 사전에 나오는 형태 그대로예요 (as tall as ⭕ / as taller as ❌). 부정 — <b>not as ~ as</b>는 "~만큼 …하지 않다", 즉 <b>비교 대상보다 덜하다</b>는 뜻이에요. 보너스 — <b>as ~ as possible</b> = "가능한 한 ~하게". 울타리 — as ~ as 사이에 <b>비교급 금지</b>, 뒤의 as를 than으로 바꾸지 마세요.',
          demo: {
            ko: ['내 동생은', '나만큼', '키가 크다'],
            steps: [
              { q: '누가?',      ko: '내 동생은',                       en: 'My brother' },
              { q: '만큼 ~한?',  ko: '큰 — 원형 그대로 as 사이에',       en: 'is as tall as' },
              { q: '누구만큼?',  ko: '나만큼',                          en: 'me' },
            ],
            answer: 'My brother is as tall as me.',
            tip: 'as ~ as 사이는 언제나 원급. taller ❌ tall ⭕',
          },
        },
        practice: [
          { ko: '이 가방은 저 가방만큼 무겁다',
            steps: [{ q:'무엇이?', en:'This bag' }, { q:'만큼 ~한?', en:'is as heavy as', hint:'원급 그대로! heavier ❌' }, { q:'무엇만큼?', en:'that one', hint:'반복되는 명사는 one' }],
            answer: 'This bag is as heavy as that one.' },
          { ko: '그녀는 가수만큼 노래를 잘한다',
            steps: [{ q:'누가?', en:'She' }, { q:'한다?', en:'sings' }, { q:'만큼 ~하게?', en:'as well as a singer', hint:'부사도 원급 그대로 — well' }],
            answer: 'She sings as well as a singer.' },
          { ko: '오늘은 어제만큼 춥지 않다',
            steps: [{ q:'무엇이?', en:'Today' }, { q:'만큼 ~하지 않다?', en:'is not as cold as', hint:'not as ~ as = 어제보다 덜 춥다는 뜻' }, { q:'무엇만큼?', en:'yesterday' }],
            answer: 'Today is not as cold as yesterday.' },
        ],
        challenges: [
          { ko:'축구는 야구만큼 인기 있다.', answer:'Soccer is as popular as baseball.',
            chunks:[{ lab:'무엇이', ko:'축구는' }, { lab:'만큼 ~한', ko:'as popular as — 원급!' }, { lab:'무엇만큼', ko:'야구만큼' }] },
          { ko:'나는 우리 형만큼 일찍 일어났다.', answer:'I got up as early as my brother.' },
          { ko:'이 문제는 보기만큼 쉽지 않다.', answer:'This question is not as easy as it looks.' },
          { ko:'그는 너만큼 바쁘다.', answer:'He is as busy as you.' },
          { ko:'가능한 한 빨리 나에게 전화해 줘.', answer:'Call me as soon as possible.' },
        ],
        similar: [
          { ko:'이 의자는 침대만큼 편하다.', answer:'This chair is as comfortable as a bed.' },
          { ko:'영어는 수학만큼 중요하다.', answer:'English is as important as math.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L10-3',
        title: '비교 강조 · 배수 · the 비교급',
        tagline: '비교 — 훨씬, 몇 배, ~할수록까지 말해요',
        skeleton: 'much + 비교급  /  배수 + as ~ as  /  The 비교급 ~, the 비교급 …',
        focus: '비교 다듬기',
        card: {
          achieve: '이걸 익히면 비교 문장이 세 방향으로 자라요 — <b>① 훨씬(much)</b> <b>② 두 배(twice as ~ as)</b> <b>③ 점점 · ~할수록(비교급 and 비교급 / The 비교급)</b>.',
          howto: '① 강조 — 비교급 앞에 <b>much / even / far</b>를 붙이면 "훨씬 더 ~한". <b>very는 못 써요</b> (very taller ❌ / much taller ⭕). ② 배수 — <b>twice / three times + as ~ as</b> = "두 배 / 세 배 ~한". ③ 점점 — <b>비교급 and 비교급</b> = "점점 더 ~한", <b>The 비교급 + 주어 + 동사, the 비교급 + 주어 + 동사</b> = "~할수록 더 …하다". 울타리 — 비교급 강조는 very ❌, 배수는 as ~ as <b>앞</b>에 붙여요.',
          demo: {
            ko: ['오늘은', '어제보다', '훨씬 더 춥다'],
            steps: [
              { q: '무엇이?',   ko: '오늘은',                          en: 'Today' },
              { q: '훨씬?',     ko: 'very ❌ — much로 강조',           en: 'is much' },
              { q: '더 추운?',  ko: '비교급 + than',                   en: 'colder than yesterday' },
            ],
            answer: 'Today is much colder than yesterday.',
            tip: '비교급을 강조할 땐 very가 아니라 much / even / far.',
          },
        },
        practice: [
          { ko: '이 가방이 저것보다 훨씬 더 싸다',
            steps: [{ q:'무엇이?', en:'This bag' }, { q:'훨씬 더 ~한?', en:'is much cheaper', hint:'강조는 much! very ❌' }, { q:'무엇보다?', en:'than that one' }],
            answer: 'This bag is much cheaper than that one.' },
          { ko: '그의 방은 내 방보다 두 배 크다',
            steps: [{ q:'무엇이?', en:'His room' }, { q:'두 배 ~한?', en:'is twice as big as', hint:'배수는 as ~ as 앞에 — twice as big as' }, { q:'무엇만큼?', en:'mine', hint:'my room = mine (내 것)' }],
            answer: 'His room is twice as big as mine.' },
          { ko: '날씨가 점점 더 더워지고 있다',
            steps: [{ q:'무엇이?', en:'It' }, { q:'~해지고 있다?', en:'is getting', hint:'"~한 상태가 되다"는 get + 형용사' }, { q:'점점 더 더운?', en:'hotter and hotter', hint:'점점 = 비교급 and 비교급' }],
            answer: 'It is getting hotter and hotter.' },
        ],
        challenges: [
          { ko:'네가 더 많이 연습할수록, 그것은 더 쉬워진다.', answer:'The more you practice, the easier it gets.',
            chunks:[{ lab:'틀', ko:'The 비교급 ~, the 비교급 …' }, { lab:'앞', ko:'더 많이 연습할수록 → The more you practice' }, { lab:'뒤', ko:'더 쉬워진다 → the easier it gets' }] },
          { ko:'이 영화가 그 책보다 훨씬 더 재미있다.', answer:'This movie is much more interesting than the book.' },
          { ko:'그 다리는 이 다리보다 세 배 길다.', answer:'That bridge is three times as long as this one.' },
          { ko:'점점 더 많은 사람들이 온라인으로 쇼핑한다.', answer:'More and more people shop online.' },
          { ko:'빠르면 빠를수록 좋다.', answer:'The sooner, the better.' },
        ],
        similar: [
          { ko:'그녀는 나보다 훨씬 더 바쁘다.', answer:'She is much busier than me.' },
          { ko:'더 높이 올라갈수록, 더 추워진다.', answer:'The higher you go, the colder it gets.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L10-4',
        title: '골라 쓰기 — 어느 비교가 어울릴까',
        tagline: '골라 쓰기 — 둘 다 맞아요. 어울리는 걸 고르세요',
        skeleton: '상황(괄호) → 어울리는 비교 표현',
        focus: '비교 표현 선택',
        card: {
          achieve: '이걸 익히면 <b>문법이 아니라 상황</b>을 보고 비교 표현을 고를 수 있어요. 같은 사실도 어느 틀에 담느냐로 그림이 달라져요.',
          howto: '여기서도 <b>틀린 문장을 고치는 게 아니에요.</b> 괄호 안 상황이 답을 정합니다. 네 갈래만 구분하세요. <b>차이를 말하고 싶으면</b> → 비교급 + than · <b>차이가 크다고 강조하면</b> → much + 비교급 · <b>같다고 말하고 싶으면</b> → as ~ as · <b>최고라고 말하면</b> → the 최상급. 울타리 — <b>남을 깎아 말해야 할 땐 worse than을 피하세요.</b> 대신 <b>not as ~ as</b>(~만큼 …하지 않다)를 쓰면 부드러워져요.',
          demo: {
            ko: ['같은 사실도', '고르는 틀에 따라', '그림이 달라져요'],
            steps: [
              { q: '차이를 강조하며', ko: '오늘이 어제보다 훨씬 낫다',      en: 'Today is much better than yesterday.' },
              { q: '같다고 말하며',   ko: '오늘도 어제만큼 좋다',           en: 'Today is as good as yesterday.' },
              { q: '부드럽게 낮춰',   ko: '어제는 오늘만큼 좋지 않았다',     en: 'Yesterday was not as good as today.' },
            ],
            answer: '사실은 같아요. 고르는 건 보여 주고 싶은 그림입니다.',
            tip: '괄호 안 상황을 먼저 읽으세요. 거기에 답이 있습니다.',
          },
        },
        practice: [
          { ko: '(차이가 아주 크다고 강조하며) 이번 시험이 지난 시험보다 훨씬 더 어려웠어',
            steps: [{ q:'상황은?', en:'much harder', hint:'차이가 큼 → much + 비교급' }, { q:'무엇이?', en:'This exam was' }, { q:'무엇보다?', en:'than the last one' }],
            answer: 'This exam was much harder than the last one.' },
          { ko: '(둘이 똑같이 잘한다고 칭찬하며) 너는 네 형만큼 노래를 잘해',
            steps: [{ q:'상황은?', en:'as well as', hint:'차이 없음 → as ~ as' }, { q:'누가?', en:'You sing' }, { q:'누구만큼?', en:'your brother' }],
            answer: 'You sing as well as your brother.' },
          { ko: '(친구를 기죽이지 않게, 내 쪽을 낮추며) 내 점수는 네 점수만큼 좋지 않아',
            steps: [{ q:'상황은?', en:'not as good as', hint:'부드럽게 → not as ~ as. worse than은 세게 들려요' }, { q:'무엇이?', en:'My score is' }, { q:'무엇만큼?', en:'yours', hint:'your score = yours (네 것)' }],
            answer: 'My score is not as good as yours.' },
        ],
        challenges: [
          { ko:'(내 경험 중 최고라고 강조하며) 이것은 내가 지금까지 본 것 중 최고의 영화야.', answer:'This is the best movie I have ever seen.',
            chunks:[{ lab:'상황', ko:'경험 중 최고 → the 최상급' }, { lab:'무엇', ko:'the best movie' }, { lab:'꾸미기', ko:'내가 지금까지 본 → I have ever seen' }] },
          { ko:'(새 폰을 자랑하며) 이 폰은 내 예전 폰보다 훨씬 가벼워.', answer:'This phone is much lighter than my old one.' },
          { ko:'(친구와 마음이 같다고 말하며) 나도 너만큼 긴장돼.', answer:'I am as nervous as you.' },
          { ko:'(남의 발표를 깎지 않고 내 것을 낮추며) 내 발표는 네 발표만큼 매끄럽지 않았어.', answer:'My presentation was not as smooth as yours.' },
          { ko:'(점점 심해진다고 걱정하며) 교통이 점점 더 나빠지고 있어.', answer:'The traffic is getting worse and worse.' },
        ],
        similar: [
          { ko:'(최고라고 칭찬하며) 이곳은 우리 동네에서 최고의 식당이야.', answer:'This is the best restaurant in my neighborhood.' },
          { ko:'(부드럽게) 오늘은 어제만큼 바쁘지 않아.', answer:'Today is not as busy as yesterday.' },
        ],
      },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 11, threshold: 3, stage: '세련', bookLabel: '3차 임계점',
    theme: { ink:'#8F4000', accent:'#B25000', soft:'#FDF1E5' },
    title: '두 문장을 한 문장으로', skill: '구조 쌉가능',
    skillDesc: '문장 두 개를 고리 하나로 잇습니다. 짧은 문장만 쓰던 학생이 긴 문장을 갖게 돼요.',
    nextHint: 'LEVEL 12 · 가정법과 재구성',
    units: [
      /* ---------------------------------------------------------------- */
      {
        id: 'L11-1',
        title: '관계대명사 주격 · 목적격 (~하는 사람 · 것)',
        tagline: '구조 — 겹치는 명사를 고리로 걸어 한 문장으로',
        skeleton: '명사 + who/which/that + (S) + V',
        focus: '관계대명사',
        card: {
          achieve: '지금까지는 문장 두 개로 나눠 말했어요 — <b>I have a friend. He lives in Busan.</b> 이제 겹치는 명사를 고리로 걸어 <b>한 문장</b>으로 만들 수 있어요.',
          howto: '한국어 신호 — 명사 앞의 긴 꾸밈 <b>"~하는 사람 / ~한 것"</b>. 한국어는 <b>앞</b>에서 꾸미지만(부산에 사는 친구), 영어는 명사 <b>뒤</b>에 꾸밈이 따라와요 — L4 꾸미기 자리, L8-4 분사와 같은 방향이에요. 만들기 — 겹치는 명사를 찾고, 사람이면 <b>who/that</b>, 사물이면 <b>which/that</b>으로 바꿔 뒤 문장을 이어 붙여요. 고리가 뒤 문장의 주어면 <b>[who + V]</b>(주격), 목적어면 <b>[who/which + S + V]</b>(목적격, 생략 가능). 울타리 — 고리가 이미 그 자리를 차지했으니 <b>대명사를 또 쓰면 ❌</b> (a friend who he lives ❌).',
          demo: {
            ko: ['나는', '친구가 있다', '(부산에 사는)'],
            steps: [
              { q: '뼈대는?',      ko: '나는 친구가 있다',              en: 'I have a friend' },
              { q: '겹치는 말?',   ko: 'a friend = 그 친구 → 고리로',   en: 'who' },
              { q: '꾸밈은?',      ko: '부산에 산다 — 뒤에 붙이기',      en: 'lives in Busan' },
            ],
            answer: 'I have a friend who lives in Busan.',
            tip: '한국어는 앞에서 꾸미고, 영어는 뒤에서 따라와요.',
          },
        },
        practice: [
          { ko: '옆집에 사는 그 남자는 의사다',
            steps: [{ q:'뼈대는?', en:'The man is a doctor', hint:'꾸밈을 걷어내면 이게 뼈대' }, { q:'고리?', en:'who', hint:'사람 + 뒤 문장의 주어 → 주격 who' }, { q:'꾸밈은?', en:'lives next door', hint:'The man 뒤에 끼워 넣기' }],
            answer: 'The man who lives next door is a doctor.' },
          { ko: '이것은 내가 어제 산 가방이다',
            steps: [{ q:'뼈대는?', en:'This is the bag' }, { q:'고리?', en:'which', hint:'사물 + 뒤 문장의 목적어 → 목적격 (생략도 가능)' }, { q:'꾸밈은?', en:'I bought yesterday', hint:'목적격 뒤엔 주어+동사가 통째로' }],
            answer: 'This is the bag which I bought yesterday.' },
          { ko: '나는 나를 이해해 주는 친구를 원한다',
            steps: [{ q:'뼈대는?', en:'I want a friend' }, { q:'고리?', en:'who', hint:'사람 + 주격' }, { q:'꾸밈은?', en:'understands me', hint:'a friend는 한 명 → 동사에 -s!' }],
            answer: 'I want a friend who understands me.' },
        ],
        challenges: [
          { ko:'나는 파리에 사는 삼촌이 있다.', answer:'I have an uncle who lives in Paris.',
            chunks:[{ lab:'뼈대', ko:'나는 삼촌이 있다' }, { lab:'고리', ko:'사람 → who' }, { lab:'꾸밈', ko:'파리에 산다 — 뒤에' }] },
          { ko:'그녀가 만든 쿠키는 맛있었다.', answer:'The cookies which she made were delicious.' },
          { ko:'저기서 노래하고 있는 소녀는 내 여동생이다.', answer:'The girl who is singing over there is my sister.' },
          { ko:'나는 해피엔딩으로 끝나는 영화를 좋아한다.', answer:'I like movies that have happy endings.' },
          { ko:'우리가 지난주에 방문한 그 식당은 문을 닫았다.', answer:'The restaurant which we visited last week is closed.' },
        ],
        similar: [
          { ko:'경주에서 이긴 그 소년은 내 반 친구다.', answer:'The boy who won the race is my classmate.' },
          { ko:'이것은 내가 매일 쓰는 컵이다.', answer:'This is the cup which I use every day.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L11-2',
        title: '소유격 whose · that만 쓰는 자리',
        tagline: '구조 — 그의/그것의 ~가 …한, 까지 걸 수 있어요',
        skeleton: '명사 + whose + 명사 ~  /  something·the only·최상급 + that ~',
        focus: '관계대명사 심화',
        card: {
          achieve: '이걸 익히면 <b>"그의 아버지가 파일럿인 친구"</b>처럼 소유까지 고리로 걸 수 있고, <b>that만 써야 하는 자리</b>를 구분할 수 있어요.',
          howto: '① 소유 고리 — <b>"그의/그녀의/그것의 ~가 …한"</b>이 보이면 <b>whose</b>. his father → whose father, 즉 <b>his/her/its 자리에 whose</b>가 들어가요. 사람이든 사물이든 다 됩니다. ② that만 쓰는 자리 — 앞 명사가 <b>something / anything / nothing / everything</b>이거나 <b>the only ~ / the same ~ / 최상급</b>이면 고리는 <b>that만</b> 가능해요 (the best movie <b>that</b> I have ever seen — L10 최상급이 여기서 다시 나와요). 울타리 — <b>whose 뒤엔 반드시 명사</b>가 와야 해요 (whose is ❌), everything <b>who</b> ❌.',
          demo: {
            ko: ['나는', '친구가 있다', '(그의 아버지가 파일럿인)'],
            steps: [
              { q: '뼈대는?',      ko: '나는 친구가 있다',                 en: 'I have a friend' },
              { q: '소유 고리?',   ko: 'his father → whose father',      en: 'whose father' },
              { q: '꾸밈은?',      ko: '파일럿이다',                      en: 'is a pilot' },
            ],
            answer: 'I have a friend whose father is a pilot.',
            tip: 'his / her / its 자리에 whose를 넣는다고 생각하세요.',
          },
        },
        practice: [
          { ko: '나는 이름이 루나인 고양이를 키운다',
            steps: [{ q:'뼈대는?', en:'I have a cat' }, { q:'소유 고리?', en:'whose name', hint:'its name → whose name. 뒤에 명사 필수!' }, { q:'꾸밈은?', en:'is Luna' }],
            answer: 'I have a cat whose name is Luna.' },
          { ko: '저것이 지붕이 빨간 그 집이다',
            steps: [{ q:'뼈대는?', en:'That is the house' }, { q:'소유 고리?', en:'whose roof', hint:'사물도 whose 가능 — its roof → whose roof' }, { q:'꾸밈은?', en:'is red' }],
            answer: 'That is the house whose roof is red.' },
          { ko: '그녀는 내가 필요로 하는 모든 것을 알고 있다',
            steps: [{ q:'뼈대는?', en:'She knows everything' }, { q:'고리?', en:'that', hint:'everything 뒤엔 that만!' }, { q:'꾸밈은?', en:'I need' }],
            answer: 'She knows everything that I need.' },
        ],
        challenges: [
          { ko:'그는 목소리가 아름다운 가수다.', answer:'He is a singer whose voice is beautiful.',
            chunks:[{ lab:'뼈대', ko:'그는 가수다' }, { lab:'소유 고리', ko:'그의 목소리 → whose voice' }, { lab:'꾸밈', ko:'아름답다' }] },
          { ko:'나는 표지가 노란 책을 찾고 있다.', answer:'I am looking for a book whose cover is yellow.' },
          { ko:'이것이 내가 가진 유일한 우산이다.', answer:'This is the only umbrella that I have.' },
          { ko:'그것은 내가 지금까지 본 것 중 최고의 공연이었다.', answer:'That was the best show that I have ever seen.' },
          { ko:'네가 원하는 모든 것을 나에게 말해 줘.', answer:'Tell me everything that you want.' },
        ],
        similar: [
          { ko:'나는 취미가 나와 같은 친구를 만났다.', answer:'I met a friend whose hobby is the same as mine.' },
          { ko:'내가 할 수 있는 것은 아무것도 없다.', answer:'There is nothing that I can do.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L11-3',
        title: '계속적 용법 · 문장 전체를 받는 which',
        tagline: '구조 — 콤마 하나로 관계사절의 일이 바뀌어요',
        skeleton: '명사, + who/which ~  /  앞 문장 전체, + which ~',
        focus: '계속적 용법',
        card: {
          achieve: '이걸 익히면 <b>이미 아는 대상에 한마디 얹기</b>(콤마 + 관계사절)와, <b>앞 문장 전체에 소감 붙이기</b>(, which)를 할 수 있어요.',
          howto: '콤마가 일을 바꿔요. <b>콤마 없으면</b> 어떤 것인지 좁히기(L11-1) — the boy who lives next door(옆집에 사는 그 소년). <b>콤마 있으면</b> 이미 아는 대상에 정보 얹기 — Liam<b>, who lives next door,</b>(리암은, 옆집에 사는데,). 한국어 신호 — <b>"~인데, ~했는데"</b>로 덧붙이는 말투. 확장 — <b>, which</b>는 명사가 아니라 <b>앞 문장 전체</b>도 받아요: He passed the exam<b>, which</b> surprised everyone(그가 합격했는데, 그것이 모두를 놀라게 했다). 울타리 — <b>콤마 뒤엔 that ❌</b> (who/which만), 콤마 용법에선 <b>생략도 ❌</b>.',
          demo: {
            ko: ['리암은,', '(옆집에 사는데,)', '친절하다'],
            steps: [
              { q: '뼈대는?',      ko: '리암은 친절하다',                  en: 'Liam ~ is friendly' },
              { q: '얹는 말?',     ko: '콤마 열고 — 옆집에 사는데',         en: ', who lives next door,' },
              { q: '왜 콤마?',     ko: '리암이 누군지 이미 아니까 — 덧붙임',  en: '(콤마 닫고 이어가기)' },
            ],
            answer: 'Liam, who lives next door, is friendly.',
            tip: '콤마 없음 = 좁히기 / 콤마 있음 = 아는 대상에 한마디 얹기.',
          },
        },
        practice: [
          { ko: '우리 아빠는, 요리를 잘하시는데, 매주 일요일에 저녁을 만드신다',
            steps: [{ q:'뼈대는?', en:'My dad ~ makes dinner every Sunday' }, { q:'얹는 말?', en:', who cooks well,', hint:'앞뒤로 콤마! that ❌' }, { q:'왜 콤마?', en:'(우리 아빠가 누군지 이미 앎)', hint:'아는 대상 → 계속적 용법' }],
            answer: 'My dad, who cooks well, makes dinner every Sunday.' },
          { ko: '나는 부산으로 이사했는데, 그곳은 바다로 유명하다',
            steps: [{ q:'앞 문장?', en:'I moved to Busan' }, { q:'얹는 말?', en:', which is famous for the sea', hint:'부산(사물) + 콤마 → which' }, { q:'주의!', en:'(that ❌)', hint:'콤마 뒤엔 that을 못 써요' }],
            answer: 'I moved to Busan, which is famous for the sea.' },
          { ko: '그는 시험에 합격했는데, 그것은 모두를 놀라게 했다',
            steps: [{ q:'앞 문장?', en:'He passed the exam' }, { q:'그것은?', en:', which', hint:'"그것" = 합격한 일 전체 → 문장 전체를 받는 which' }, { q:'소감은?', en:'surprised everyone' }],
            answer: 'He passed the exam, which surprised everyone.' },
        ],
        challenges: [
          { ko:'우리 언니는, 캐나다에 사는데, 다음 달에 한국에 온다.', answer:'My sister, who lives in Canada, is coming to Korea next month.',
            chunks:[{ lab:'뼈대', ko:'우리 언니는 다음 달에 온다' }, { lab:'얹는 말', ko:', who lives in Canada,' }, { lab:'왜 콤마', ko:'언니가 누군지 이미 아니까' }] },
          { ko:'나는 그 콘서트에 못 갔는데, 그것을 아직도 후회한다.', answer:'I could not go to the concert, which I still regret.' },
          { ko:'갑자기 비가 오기 시작했고, 그것이 내 계획을 망쳤다.', answer:'It suddenly started to rain, which ruined my plan.' },
          { ko:'그 식당은, 우리가 자주 방문하는데, 이번 주에 문을 닫았다.', answer:'The restaurant, which we visit often, is closed this week.' },
          { ko:'그는 나에게 거짓말을 했는데, 그것을 나는 믿을 수 없었다.', answer:'He lied to me, which I could not believe.' },
        ],
        similar: [
          { ko:'우리 할머니는, 올해 여든이신데, 매일 아침 산책을 하신다.', answer:'My grandmother, who is eighty this year, takes a walk every morning.' },
          { ko:'그 팀이 또 졌는데, 그것은 놀랍지 않았다.', answer:'The team lost again, which was not surprising.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L11-4',
        title: '복합관계사 (whoever · whatever …)',
        tagline: '구조 — -ever를 붙이면 "~든"이 돼요',
        skeleton: 'whoever/whatever + (S) + V  /  wherever/whenever + S + V',
        focus: '복합관계사',
        card: {
          achieve: '이걸 익히면 <b>"~하는 사람은 누구든 / 무엇이든 / 어디서든 / 언제든"</b>을 말할 수 있어요. 문장의 폭이 훅 넓어져요.',
          howto: '한국어 신호 — <b>"~든(지)"</b>. 만들기 — 의문사에 <b>-ever</b>를 붙여요: who(누가) → <b>whoever</b>(누구든) · what → <b>whatever</b>(무엇이든) · which → <b>whichever</b>(어느 것이든) · where → <b>wherever</b>(어디서든) · when → <b>whenever</b>(언제든). whoever/whatever 덩어리는 <b>통째로 주어나 목적어</b>가 되고(Whoever comes first gets ~), wherever/whenever는 <b>배경을 까는 부사절</b>이에요. 울타리 — whoever = anyone who, 이미 "사람"까지 포함하니 <b>anyone whoever ❌</b>. 덩어리 주어는 <b>단수 취급</b>이에요.',
          demo: {
            ko: ['참여하고 싶은 사람은', '누구든', '올 수 있다'],
            steps: [
              { q: '누구든?',     ko: '참여하고 싶은 사람은 누구든 — 통째로 주어', en: 'Whoever wants to join' },
              { q: '한다?',       ko: '올 수 있다',                          en: 'can come' },
              { q: '확인!',       ko: '덩어리 주어 = 단수 → wants에 -s',       en: '(wants ⭕ want ❌)' },
            ],
            answer: 'Whoever wants to join can come.',
            tip: 'whoever 덩어리가 통째로 주어 자리에 앉아요.',
          },
        },
        practice: [
          { ko: '네가 원하는 무엇이든 주문해',
            steps: [{ q:'한다?', en:'Order' }, { q:'무엇이든?', en:'whatever you want', hint:'whatever + 주어 + 동사 — 통째로 목적어' }],
            answer: 'Order whatever you want.' },
          { ko: '언제든 네가 한가할 때 나에게 전화해',
            steps: [{ q:'한다?', en:'Call me' }, { q:'언제든?', en:'whenever you are free', hint:'whenever = 언제든 — 배경을 까는 부사절' }],
            answer: 'Call me whenever you are free.' },
          { ko: '먼저 오는 사람은 누구든 좋은 자리를 잡는다',
            steps: [{ q:'누구든?', en:'Whoever comes first', hint:'통째로 주어! 단수 취급 → comes' }, { q:'한다?', en:'gets a good seat', hint:'주어가 단수니 gets' }],
            answer: 'Whoever comes first gets a good seat.' },
        ],
        challenges: [
          { ko:'네가 무엇을 선택하든, 나는 너를 지지할 거야.', answer:'Whatever you choose, I will support you.',
            chunks:[{ lab:'~든', ko:'무엇을 선택하든 → Whatever you choose' }, { lab:'콤마', ko:'배경 깔고 쉼표' }, { lab:'뼈대', ko:'나는 지지할 거야 — L2 will' }] },
          { ko:'그는 어디를 가든 친구를 사귄다.', answer:'He makes friends wherever he goes.' },
          { ko:'질문이 있는 사람은 누구든 손을 들어도 된다.', answer:'Whoever has a question can raise their hand.' },
          { ko:'네가 언제 오든, 나는 여기 있을게.', answer:'Whenever you come, I will be here.' },
          { ko:'마음에 드는 어느 것이든 골라도 돼.', answer:'You can pick whichever you like.' },
        ],
        similar: [
          { ko:'네가 무엇을 말하든, 나는 너를 믿어.', answer:'Whatever you say, I trust you.' },
          { ko:'도움이 필요한 사람은 누구든 나에게 와도 된다.', answer:'Whoever needs help can come to me.' },
        ],
      },

      /* ---------------------------------------------------------------- */
      {
        id: 'L11-5',
        title: '분사구문 (~하면서 · ~해서)',
        tagline: '구조 — 접속사와 주어를 지우면 문장이 홀쭉해져요',
        skeleton: 'Ving ~, + 주절  /  p.p. ~, + 주절',
        focus: '분사구문',
        card: {
          achieve: '이걸 익히면 <b>"~하면서 / ~해서"</b>를 접속사 없이 간결하게 붙일 수 있어요. 문장이 세련되게 홀쭉해집니다.',
          howto: '만들기 — 부사절에서 <b>접속사를 지우고, 주절과 같은 주어를 지우고, 동사에 -ing</b>를 입혀요. While I listened to music, I ~ → <b>Listening to music, I ~</b>. L8-4에서 분사는 "동사에 옷 입히기"였죠 — 같은 옷이에요. 수동이면 — Being p.p.에서 <b>Being을 지우고 p.p.로 시작</b>해요 (Covered with snow, ~). 부정은 — 앞에 <b>Not</b>만 붙여요 (Not knowing what to say, ~). 뜻을 분명히 하고 싶으면 <b>접속사를 남겨도</b> 돼요 (After finishing ~). 울타리 — <b>주절과 주어가 같을 때만</b> 지울 수 있어요. 다른 주어를 지우면 누가 하는지 사라져요 ❌.',
          demo: {
            ko: ['음악을 들으면서,', '나는', '숙제를 했다'],
            steps: [
              { q: '부사절은?',    ko: 'While I listened to music',      en: '(원래 문장)' },
              { q: '지운다!',      ko: '접속사 While ❌ + 주어 I ❌',      en: 'Listening to music,' },
              { q: '주절은?',      ko: '나는 숙제를 했다 — 그대로',         en: 'I did my homework' },
            ],
            answer: 'Listening to music, I did my homework.',
            tip: '지우고(접속사·주어) 입힌다(-ing). 그게 전부예요.',
          },
        },
        practice: [
          { ko: 'TV를 보면서, 그는 저녁을 먹었다',
            steps: [{ q:'~하면서?', en:'Watching TV,', hint:'접속사·주어 지우고 동사에 -ing' }, { q:'주절은?', en:'he ate dinner', hint:'주절은 손대지 않아요' }],
            answer: 'Watching TV, he ate dinner.' },
          { ko: '피곤해서, 나는 일찍 잠자리에 들었다',
            steps: [{ q:'~해서?', en:'Feeling tired,', hint:'이유도 같은 틀 — Because I felt → Feeling' }, { q:'주절은?', en:'I went to bed early' }],
            answer: 'Feeling tired, I went to bed early.' },
          { ko: '선생님께 칭찬받아서, 그는 기뻤다',
            steps: [{ q:'~받아서?', en:'Praised by his teacher,', hint:'수동은 Being p.p. → Being 지우고 p.p.만!' }, { q:'주절은?', en:'he was happy' }],
            answer: 'Praised by his teacher, he was happy.' },
        ],
        challenges: [
          { ko:'창밖을 보면서, 그녀는 커피를 마셨다.', answer:'Looking out the window, she drank coffee.',
            chunks:[{ lab:'~하면서', ko:'접속사·주어 지우고 → Looking' }, { lab:'콤마', ko:'홀쭉해진 앞부분 닫기' }, { lab:'주절', ko:'그녀는 커피를 마셨다' }] },
          { ko:'버스를 놓쳐서, 나는 학교에 걸어가야 했다.', answer:'Missing the bus, I had to walk to school.' },
          { ko:'무슨 말을 해야 할지 몰라서, 그는 조용히 있었다.', answer:'Not knowing what to say, he stayed quiet.' },
          { ko:'눈으로 덮여서, 그 산은 아름다워 보였다.', answer:'Covered with snow, the mountain looked beautiful.' },
          { ko:'숙제를 끝낸 후, 나는 게임을 했다.', answer:'After finishing my homework, I played a game.' },
        ],
        similar: [
          { ko:'노래를 부르면서, 그녀는 설거지를 했다.', answer:'Singing a song, she did the dishes.' },
          { ko:'긴장돼서, 나는 심호흡을 했다.', answer:'Feeling nervous, I took a deep breath.' },
        ],
      },
    ],
    exam: { passScore: RULES.EXAM_PASS, total: RULES.EXAM_TOTAL, questions: [] },  // AI가 매번 새로 출제
  },
  {
    level: 12, threshold: 3, stage: '세련', bookLabel: '3차 임계점',
    theme: { ink:'#8F4000', accent:'#B25000', soft:'#FDF1E5' },
    title: '가정법과 재구성 (만렙)', skill: '영어 쌉가능',
    skillDesc: '만렙! 이제 문장을 만드는 걸 넘어, 뉘앙스까지 골라 쓸 수 있어요.',
    nextHint: null,
    units: [
      { id: 'L12-1', title: '조건절 vs 가정법 과거', focus: '가정법 과거' },
      { id: 'L12-2', title: '가정법 과거완료 · 혼합', focus: '가정법 과거완료' },
      { id: 'L12-3', title: 'I wish · as if (바람과 가정)', focus: 'I wish · as if' },
      { id: 'L12-4', title: '도치 · 분열문으로 강조하기', focus: '문장 재구성' },
      { id: 'L12-5', title: '골라 쓰기 — 밋밋한 문장 다듬기', focus: '문장 다듬기' },
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
