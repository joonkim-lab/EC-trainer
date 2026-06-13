/* =====================================================================
 * Firebase 설정 — 콘솔에서 복사한 값으로 아래를 채우세요.
 *
 * 받는 곳: Firebase 콘솔 > 프로젝트 설정(⚙️) > 일반 > 내 앱 > 웹 앱
 *          > "SDK 설정 및 구성" > 구성(Config)
 *  → 거기 나오는 firebaseConfig 객체를 그대로 아래에 붙여넣으면 됩니다.
 *
 * (자세한 절차는 SETUP_Firebase.md 2단계 참고)
 * ===================================================================== */

const firebaseConfig = {
  apiKey:            "AIzaSyBGVrlV9N4DwqRRmuTsZ4ei_AzXzL7pfaQ",
  authDomain:        "ec-trainer.firebaseapp.com",
  projectId:         "ec-trainer",
  storageBucket:     "ec-trainer.firebasestorage.app",
  messagingSenderId: "987956908945",
  appId:             "1:987956908945:web:366614596a3980ac2b0030"
};

/* AI 채점/출제용 Cloud Function 주소.
 * functions를 배포하면 콘솔이 알려 주는 함수 URL을 여기에 넣으세요.
 * (예: https://asia-northeast3-프로젝트ID.cloudfunctions.net/api )
 * 비워 두면 앱은 '간이 채점 모드'로 동작합니다. */
const FUNCTION_URL = "https://api-3srxb2b4da-du.a.run.app";
