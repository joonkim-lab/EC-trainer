# SETUP ③ — GitHub Pages로 배포하기 (repo: EC-trainer)

> 이미 `EC-trainer` 깃허브 저장소를 만드셨으니, **화면(웹앱)** 은 GitHub Pages로 올립니다.
> 단, 한 가지만 분명히 — **GitHub Pages는 "화면"만 올립니다.**
> 로그인 명단(`firestore.rules`)과 AI 채점(`functions/`)은 **여전히 Firebase에** 따로 올려야 합니다.
> 즉, 역할 분담은 이렇습니다:

| 무엇 | 어디에 올라가나 | 방법 |
|---|---|---|
| 화면 (index.html, curriculum.js, firebase-config.js) | **GitHub Pages** | 이 문서 |
| 로그인 보안 규칙 (firestore.rules) | **Firebase** | SETUP_Firebase 4단계 |
| AI 채점 함수 (functions/) | **Firebase** | SETUP_Firebase 5단계 |

> 그래서 순서는: **먼저 Firebase 쪽을 설정**(SETUP_Firebase 1~5단계)하고 → **6단계(firebase deploy hosting)만 건너뛰고** → 아래 GitHub Pages로 화면을 올립니다.

---

## 0단계 — 미리 끝내둘 것

- [ ] SETUP_Firebase **1단계**(프로젝트) ~ **5단계**(함수 배포 + FUNCTION_URL 받기) 완료
- [ ] `firebase-config.js` 에 콘솔 config 6줄 + `FUNCTION_URL` 채움
- [ ] `firestore.rules` 의 이메일 4개 → **이미 넣어 드렸습니다.** 콘솔 게시 또는 `firebase deploy --only firestore:rules` 로 반영만 하면 됨

> 참고: `firebase-config.js` 의 apiKey 등은 **공개돼도 안전한 값**입니다(원래 브라우저에 노출되는 값). 진짜 비밀인 Anthropic 키는 깃허브에 올라가지 않고 Firebase 함수 금고에만 있습니다. 그래서 저장소가 public이어도 괜찮습니다.

---

## 1단계 — 파일을 EC-trainer 저장소에 올리기

이 폴더의 파일들을 저장소에 넣고 push 합니다. (터미널에서)

```bash
cd 영작트레이너_폴더_경로

git init
git add .
git commit -m "영작 트레이너 첫 배포"
git branch -M main
git remote add origin https://github.com/<내아이디>/EC-trainer.git
git push -u origin main
```
> `<내아이디>` 를 본인 GitHub 사용자명으로 바꾸세요.
> 이미 `git clone` 으로 받은 폴더라면 `git init`·`remote add` 는 생략하고 add/commit/push 만.

### .gitignore 권장 (선택)
함수 설치 폴더가 같이 올라가지 않도록 저장소 루트에 `.gitignore` 파일을 만들고 아래를 넣으면 깔끔합니다:
```
functions/node_modules/
.firebase/
```

---

## 2단계 — GitHub Pages 켜기

1. 깃허브에서 **EC-trainer** 저장소 → 상단 **Settings**.
2. 좌측 **Pages** 메뉴.
3. **Source** → **Deploy from a branch** 선택.
4. **Branch** → `main` / 폴더는 **`/ (root)`** → **Save**.
5. 잠시(1~2분) 뒤 새로고침하면 주소가 뜹니다:
   ```
   https://<내아이디>.github.io/EC-trainer/
   ```
   이게 아이들이 접속할 주소입니다.

> `index.html` 이 저장소 **맨 위(root)** 에 있어야 합니다 (지금 구조 그대로면 OK).

---

## 3단계 — ★ Firebase에 이 주소를 "허용 도메인"으로 등록 (안 하면 로그인 실패)

GitHub Pages 주소에서 구글 로그인이 되려면, 그 도메인을 Firebase가 알아야 합니다.

1. Firebase 콘솔 → **빌드 > Authentication > Settings(설정) 탭**.
2. **승인된 도메인(Authorized domains)** → **도메인 추가**.
3. `<내아이디>.github.io` 입력 → 추가.

> `web.app`·`firebaseapp.com` 은 기본 등록돼 있습니다. 여기에 `github.io` 주소만 더해주면 됩니다.
> 나중에 나만의 도메인(SETUP_Domain)을 붙이면 그 도메인도 여기에 추가하세요.

---

## 4단계 — ★ AI 함수가 이 주소의 요청을 받도록 허용 (CORS)

`functions/index.js` 에서:
```js
const ALLOW_ORIGIN = "*";
```
를 GitHub Pages 주소로 좁히면 더 안전합니다:
```js
const ALLOW_ORIGIN = "https://<내아이디>.github.io";
```
바꿨으면 재배포:
```bash
firebase deploy --only functions
```
> 여러 주소(github.io + 커스텀 도메인)를 쓸 거면 우선 `"*"` 로 두고, 운영이 안정되면 좁히세요.

---

## 5단계 — 접속 테스트

1. `https://<내아이디>.github.io/EC-trainer/` 접속.
2. **구글로 로그인** → 명단의 4계정만 입장됩니다:
   - joon.kim@educclesia.com (관리자)
   - creativemeriel@gmail.com (첫째·10학년)
   - jasoncanada0506@gmail.com (둘째·8학년)
   - elvinkim827@gmail.com (셋째·6학년)
3. 첫 로그인 → 배치 테스트 → 시작 레벨 결정 → 연습 시작.

---

## 코드를 고친 뒤 다시 올릴 때

| 무엇을 고쳤나 | 다시 하는 일 |
|---|---|
| 화면/커리큘럼 (index.html, curriculum.js 등) | `git add . && git commit -m "수정" && git push` → Pages 자동 갱신(1~2분) |
| 보안 규칙 (firestore.rules) | `firebase deploy --only firestore:rules` |
| AI 함수 (functions/index.js) | `firebase deploy --only functions` |

> 화면은 **GitHub(push)**, 규칙·함수는 **Firebase(deploy)** — 이 두 갈래만 기억하면 됩니다.

---

## 자주 막히는 곳

- 로그인 팝업이 떴다 바로 닫혀요 / `auth/unauthorized-domain` → **3단계** 승인된 도메인에 `github.io` 주소 추가 안 됨.
- 화면은 뜨는데 빈 페이지 → 명단 이메일로 로그인했는지, 규칙을 Firebase에 반영(게시/deploy)했는지 확인.
- AI 채점이 "간이 채점"으로만 떠요 → `firebase-config.js` 의 `FUNCTION_URL` 채웠는지 + 함수 배포 성공했는지.
- 페이지가 404 → Pages의 Branch가 `main`/`root` 인지, `index.html` 이 저장소 맨 위에 있는지 확인.
- 채점 결과 품질을 올리고 싶다 → `functions/index.js` 의 `MODEL` 을 `"claude-opus-4-8"` 로 바꾸고 함수 재배포.
