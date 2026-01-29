# 지역별 중학교 순위 서비스

학부모와 학생을 위한 지역별 중학교 순위 조회 서비스입니다. 국가수준 학업성취도 평가 데이터를 기반으로 학교 순위를 제공합니다.

## 주요 기능

### 1. 인증 시스템
- Firebase Authentication을 통한 회원가입 및 로그인
- 이메일 중복 체크
- 학교급 및 학년 정보 저장
- 로그아웃 기능

### 2. 메인 페이지
- **지역 선택** (두 가지 방식 제공)
  - 단계별 선택: 시/도 → 지역구 순차 선택
  - 직접 검색: 지역구명 검색 및 자동완성
- **연도 선택**: 2023년, 2024년, 2025년 데이터 조회

### 3. 학교 순위 조회
- 테이블 형태의 학교 순위 표시
- 다음 정보 제공:
  - 전국 순위
  - 학교 이름
  - 설립 구분 (공립/사립)
  - 남녀 공학 여부
  - 국가수준 학업성취도 평균 ('보통학력' 이상 비율)
  - 특목고/자사고 진학률

## 기술 스택

- **프레임워크**: React 18 + Vite
- **인증**: Firebase Authentication
- **라우팅**: React Router v6
- **스타일**: CSS (반응형 디자인)
- **상태 관리**: React Context API

## 프로젝트 구조

```
src/
├── context/
│   └── AuthContext.jsx          # 인증 컨텍스트
├── data/
│   ├── regionData.js           # 지역 데이터
│   └── schoolData.js           # 학교 데이터
├── pages/
│   ├── Login.jsx              # 로그인 페이지
│   ├── Login.css
│   ├── Register.jsx           # 회원가입 페이지
│   ├── Register.css
│   ├── Main.jsx               # 메인 페이지
│   └── Main.css
├── App.jsx                   # 라우팅 설정
├── App.css
├── firebase.js               # Firebase 설정
└── main.jsx                 # 진입점
```

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

```bash
npm run dev
```

서버가 시작되면 브라우저에서 http://localhost:5174 접속

### 3. 빌드

```bash
npm run build
```

### 4. 프리뷰

```bash
npm run preview
```

## 사용 방법

상세한 사용 방법은 [사용자 가이드](./사용자_가이드.md)를 참고하세요.

### 빠른 시작

1. **회원가입**
   - 로그인 페이지에서 "회원가입" 클릭
   - 이메일, 비밀번호, 학교급, 학년 입력

2. **로그인**
   - 이메일과 비밀번호로 로그인

3. **학교 순위 조회**
   - 지역 선택 (단계별 선택 또는 직접 검색)
   - 연도 선택
   - 검색 버튼 클릭

## 데이터 설명

### 순위 산정 기준
- **데이터 출처**: 학교알리미 공시 데이터
- **순위 기준**: 국가수준학업성취도평가 '보통학력' 이상 비율
- **연도별 데이터**: 각 연도별로 해당 연도의 데이터를 사용

### 샘플 데이터
현재 샘플 데이터로 제공되며, 다음 지역의 데이터를 포함합니다:
- 서울특별시: 강남구, 서초구, 송파구
- 경기도: 성남시, 수원시
- 부산광역시: 해운대구
- 대구광역시: 수성구
- 인천광역시: 남동구
- 광주광역시: 북구
- 대전광역시: 유성구

## Firebase 설정

Firebase 설정은 `src/firebase.js` 파일에 포함되어 있습니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC4KoZiw1yCmqcUwsnEF5p-ExshvupXfA4",
  authDomain: "fir-us-east-01.firebaseapp.com",
  projectId: "fir-us-east-01",
  storageBucket: "fir-us-east-01.firebasestorage.app",
  messagingSenderId: "650722036531",
  appId: "1:650722036531:web:0e8b6446e4390325878c46"
};
```

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전)

## 라이선스

MIT

## 개발자

Kilo Code

## 문제 해결

### Firebase 인증 오류
- Firebase Console에서 Authentication이 활성화되어 있는지 확인
- 이메일/비밀번호 로그인 방식이 활성화되어 있는지 확인

### 로딩 문제
- 개발 서버가 실행 중인지 확인
- 브라우저 콘솔에서 에러 메시지 확인

상세한 문제 해결 방법은 [사용자 가이드](./사용자_가이드.md)를 참고하세요.
