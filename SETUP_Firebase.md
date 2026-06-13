# SETUP ① — Firebase 설정 (차근차근 따라하기)

> 이 문서 하나만 위에서 아래로 순서대로 따라가면 **로그인 + 데이터 저장 + AI 채점**이 모두 동작합니다.
> 처음이라도 괜찮습니다. 각 단계마다 "어디를 누르는지"까지 적었습니다.
> 컴퓨터 명령어를 입력하는 단계(4·5·6)는 잠깐 낯설 수 있지만, 적힌 줄을 그대로 복사해 붙여넣으면 됩니다.

소요 시간: 처음이면 약 40~60분. 한 번 해두면 이후엔 코드만 고쳐 다시 배포(1분)하면 됩니다.

---

## 0단계 — 미리 준비할 것

| 준비물 | 설명 |
|---|---|
| 구글 계정 | Firebase는 구글 계정으로 로그인합니다. (준킴쌤 계정 권장) |
| 아이들 3명의 구글 이메일 | 로그인 허용 명단에 넣습니다. 지금 몰라도 됩니다 — 3단계에서 넣어요. |
| Anthropic API 키 | AI 채점용. https://console.anthropic.com → API Keys → Create Key. `sk-ant-...` 로 시작하는 긴 문자열. |
| Node.js | 컴퓨터에 설치돼 있어야 명령어가 동작합니다. https://nodejs.org 에서 LTS 버전 설치. |

> **API 키는 절대 코드에 직접 적지 않습니다.** 5단계에서 Firebase '시크릿'으로 안전하게 보관합니다. 이게 우리가 Cloud Function을 따로 두는 이유예요(아래 '왜 이렇게 하나요?' 참고).

---

## 1단계 — Firebase 프로젝트 만들기

1. https://console.firebase.google.com 접속 → 구글 로그인.
2. **프로젝트 만들기** 클릭.
3. 프로젝트 이름: 예) `yeongjak-trainer` 입력 → 계속.
4. Google 애널리틱스: **사용 안 함**으로 꺼도 됩니다(나중에 켜도 무방) → 프로젝트 만들기.
5. 30초쯤 기다리면 완성 → **계속**.

---

## 2단계 — 웹 앱 등록하고 config 받기

1. 프로젝트 첫 화면 가운데(또는 좌측 상단 ⚙️ 옆) **`</>` (웹)** 아이콘 클릭.
2. 앱 닉네임: 예) `yeongjak-web` 입력.
3. "Firebase 호스팅도 설정" 체크박스는 **지금은 체크하지 않아도 됩니다** (6단계에서 CLI로 합니다) → **앱 등록**.
4. 다음 화면에 이런 코드가 나옵니다:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "yeongjak-trainer.firebaseapp.com",
     projectId: "yeongjak-trainer",
     storageBucket: "yeongjak-trainer.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcd..."
   };
   ```
5. 이 값들을 우리 파일 **`firebase-config.js`** 에 그대로 옮겨 적습니다.
   `여기에_API_KEY` 같은 자리표시자를 위에서 받은 진짜 값으로 교체하세요.

   ```js
   const firebaseConfig = {
     apiKey:            "AIza...",                                  // ← 콘솔 값
     authDomain:        "yeongjak-trainer.firebaseapp.com",         // ← 콘솔 값
     projectId:         "yeongjak-trainer",                         // ← 콘솔 값
     storageBucket:     "yeongjak-trainer.appspot.com",             // ← 콘솔 값
     messagingSenderId: "1234567890",                               // ← 콘솔 값
     appId:             "1:1234567890:web:abcd..."                  // ← 콘솔 값
   };
   ```
   > `FUNCTION_URL` 줄은 **5단계 이후**에 채웁니다. 지금은 `""` 빈 채로 두세요.
6. 콘솔에서는 **콘솔로 이동** 눌러 마칩니다.

---

## 3단계 — 로그인(구글) 켜기

1. 좌측 메뉴 **빌드 > Authentication** → **시작하기**.
2. **Sign-in method** 탭 → 제공업체 목록에서 **Google** 클릭 → **사용 설정** 토글 ON.
3. "프로젝트 지원 이메일"에 준킴쌤 이메일 선택 → **저장**.

> 이걸 켜면 "구글로 로그인" 버튼이 동작합니다. 단, **누구나** 구글 로그인은 되지만, 다음 4단계의 보안 규칙이 **허용 명단 밖의 사람은 데이터에 접근 못 하게** 막아줍니다.

---

## 4단계 — Firestore(데이터베이스) 만들고 허용 명단 넣기

### 4-1. 데이터베이스 생성
1. 좌측 메뉴 **빌드 > Firestore Database** → **데이터베이스 만들기**.
2. 위치: **asia-northeast3 (서울)** 선택 → 다음.
3. 모드: 일단 **프로덕션 모드**로 시작 → 사용 설정. (규칙은 바로 아래에서 우리 규칙으로 덮어씁니다.)

### 4-2. 우리 보안 규칙 + 이메일 4개 넣기  ★ 가장 중요
1. 우리 파일 **`firestore.rules`** 를 텍스트 편집기로 엽니다.
2. 위쪽에 표시된 **★ 이 4줄** 의 자리표시자를 진짜 이메일로 교체합니다(전부 **소문자**):

   | 바꿀 자리표시자 | 넣을 값 |
   |---|---|
   | `TEACHER_EMAIL_HERE@example.com` (teacherEmail 함수) | 준킴쌤 이메일 |
   | `TEACHER_EMAIL_HERE@example.com` (allowedEmails 목록) | 준킴쌤 이메일(위와 동일) |
   | `CHILD1_EMAIL_HERE@example.com` | 첫째(10학년) 이메일 |
   | `CHILD2_EMAIL_HERE@example.com` | 둘째(8학년) 이메일 |
   | `CHILD3_EMAIL_HERE@example.com` | 셋째(6학년) 이메일 |

   > 선생님 이메일은 **두 군데**(teacherEmail 함수 + allowedEmails 목록)에 모두 들어가야 합니다.
   > 학생을 더 추가할 땐 allowedEmails 목록에 한 줄씩 더 넣으면 됩니다(나중에 학교 아이들 확장 시).
3. 저장한 규칙을 Firebase에 반영하는 방법은 **두 가지** — 편한 쪽으로:
   - **(쉬움) 콘솔에 붙여넣기:** Firestore Database > **규칙** 탭 → 편집창 내용을 전부 지우고 → 우리 `firestore.rules` 내용을 통째로 붙여넣기 → **게시**.
   - **(자동) CLI로 배포:** 6단계에서 `firebase deploy` 할 때 규칙도 같이 올라갑니다.

---

## 5단계 — AI 채점용 Cloud Function 배포 (API 키 안전 보관)

> 여기서부터 컴퓨터 **터미널(명령 프롬프트)** 을 사용합니다.
> Windows: 시작 → "cmd" / Mac: "터미널" 앱.

### 5-1. Firebase 도구 설치 & 로그인 (최초 1회)
```bash
npm install -g firebase-tools
firebase login
```
브라우저가 열리면 준킴쌤 구글 계정으로 허용하세요.

### 5-2. 프로젝트 폴더로 이동
`yeongjak-trainer` 폴더(이 파일들이 있는 곳)로 이동합니다.
```bash
cd 영작트레이너_폴더_경로
```
> 예: `cd Downloads/yeongjak-trainer` — 폴더를 터미널 창에 드래그하면 경로가 자동 입력됩니다.

### 5-3. 이 폴더를 내 프로젝트와 연결
```bash
firebase use --add
```
→ 1단계에서 만든 프로젝트(`yeongjak-trainer`) 선택 → 별칭은 `default` 그대로 엔터.

### 5-4. 함수 의존성 설치
```bash
cd functions
npm install
cd ..
```

### 5-5. ★ Anthropic API 키를 '시크릿'으로 저장
```bash
firebase functions:secrets:set ANTHROPIC_API_KEY
```
→ 물어보면 `sk-ant-...` 키를 붙여넣고 엔터. (화면에 안 보여도 정상 입력됩니다.)

> 이렇게 하면 키가 **코드/깃/브라우저 어디에도 노출되지 않고** 구글 서버 금고에만 저장됩니다.

### 5-6. 함수 배포
```bash
firebase deploy --only functions
```
1~3분 뒤 성공하면 마지막에 **Function URL** 이 출력됩니다:
```
Function URL (api): https://asia-northeast3-yeongjak-trainer.cloudfunctions.net/api
```
이 주소를 복사해서 **`firebase-config.js`** 의 `FUNCTION_URL` 에 붙여넣으세요:
```js
const FUNCTION_URL = "https://asia-northeast3-yeongjak-trainer.cloudfunctions.net/api";
```

> 만약 배포가 결제 관련 오류로 막히면: 콘솔 좌측 하단 **요금제 업그레이드 → Blaze(종량제)** 로 바꿔야 2세대 함수가 배포됩니다. 사용량이 적어 실제 비용은 보통 月 몇백 원 이하지만, 안심되게 콘솔에서 **예산 알림(budget alert)** 을 걸어두는 걸 권합니다.

---

## 6단계 — 웹앱(호스팅) 배포해서 인터넷에 올리기

`firebase-config.js` 에 config와 FUNCTION_URL을 모두 채운 뒤, 폴더 최상위에서:
```bash
firebase deploy
```
> 이 한 줄이 **호스팅 + Firestore 규칙 + 함수** 를 한꺼번에 올립니다.
> 호스팅만 다시 올리려면 `firebase deploy --only hosting`.

성공하면 이런 주소가 나옵니다:
```
Hosting URL: https://yeongjak-trainer.web.app
```
이 주소로 접속 → "구글로 로그인" → **허용 명단에 있는 계정만** 들어가집니다. 🎉

> 나만의 도메인(예: `yeongjak.우리학교.com`)으로 바꾸려면 → **SETUP_Domain.md** 로 이어가세요.

---

## 첫 사용 흐름 (배포 후 아이들에게)

1. 위 Hosting URL(또는 연결한 도메인)을 아이들에게 알려줍니다.
2. 각자 **자기 구글 계정**(4단계 명단에 넣은 그 계정)으로 로그인.
3. 처음 로그인하면 **배치 테스트(6문장)** 가 뜹니다 → 결과로 시작 레벨(1/2/3)이 정해집니다.
4. 이후엔 목차 순서대로 연습 → 유닛 통과(75%) → 레벨업 시험(85%) → 다음 레벨.
5. **스케줄러(묵상집)** 탭에서 누가 오늘 했는지 ✅/⬜ 로 서로 확인하고 👏 응원.

> 선생님은 명단의 teacherEmail 계정으로 로그인하면 모든 아이 진도를 볼 수 있습니다.

---

## 왜 이렇게 하나요? (안전 설계 한눈에)

- **로그인 + 허용 명단:** 우리 아이들/학생만 들어오게.
- **Firestore 규칙:** 학생은 자기 진도만 읽고 씀. 스케줄러는 서로 보되, 수정은 본인만. 선생님은 전체 열람.
- **Cloud Function 프록시:** AI 채점은 API 키가 필요한데, 정적 웹사이트에 키를 넣으면 누구나 훔쳐 씁니다. 그래서 키는 **구글 서버(함수)** 안에만 두고, 웹앱은 그 함수에게 "이 문장 채점해줘"라고 부탁만 합니다. `FUNCTION_URL` 을 비워두면 인터넷 없이도 동작하는 **간이 채점 모드**로 자동 전환됩니다.

---

## 자주 막히는 곳 (체크리스트)

- 로그인은 되는데 화면이 비어요 → `firestore.rules` 에 그 이메일을 넣고 **게시**했는지 확인(소문자!).
- AI 채점이 안 되고 "간이 채점"이라고 떠요 → `FUNCTION_URL` 을 채웠는지, 함수 배포가 성공했는지 확인.
- `firebase: command not found` → `npm install -g firebase-tools` 다시.
- 함수 배포 실패(billing) → Blaze 요금제로 업그레이드.
- 채점 결과가 이상해요 → `functions/index.js` 의 `MODEL` 을 `"claude-opus-4-8"` 로 올리고 재배포(품질↑, 비용↑).
