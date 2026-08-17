# 🩺 11 DayCare Letter — 매일 아침 3분, AI 핵심 건강 뉴스 배달

<div align="center">
  <h3>AI 기반 국내 보건/건강 기사 스캔 & 요약 무료 뉴스레터 웹 플랫폼</h3>
  <p>바쁜 현대인, 어르신 보호자, 직장인을 위해 AI가 노이즈를 걷어내고 가장 중요한 복지 동향과 핵심 인사이트만 엄선하여 배달합니다.</p>
</div>

---

## ✨ 주요 기능 및 특징

- 🎯 **간편 회원가입 & 로그인 (Node.js + SQLite3)**:
  - 아이디 / 비밀번호 / 휴대폰 번호(`010-XXXX-XXXX`)
  - **3단계 거주 주소지 선택** (시/도 ➔ 시/군/구 ➔ 읍/면/동 연동)
  - **간병 중인 어르신 장기요양 등급 보유 여부** (예 / 아니오) 선택
- ⚡ **오늘의 AI 큐레이션 (Featured Issue)**: 오늘자 핵심 보건/복지 뉴스 3줄 불릿 요약
- 📚 **지난 뉴스레터 아카이브 & 검색**:
  - 카테고리 필터 및 실시간 키워드 검색
- 📖 **인터랙티브 리더 뷰어 (Reader Modal)**:
  - AI 3줄 핵심 요약 (TL;DR), 소주제별 본문 분석, 원문 링크
- 🛠️ **운영자 SQLite DB 관리자 콘솔**:
  - 관리자 계정 로그인 시 푸터에 전용 콘솔 버튼 활성화
  - 실시간 가입 회원 목록 및 구독자 테이블 열람
- 📱 **모바일 퍼스트 반응형 디자인 (Mobile-First)**:
  - 스마트폰, 태블릿, PC 완벽 대응

---

## 🌿 브랜치 구성

- **`main`**: Vercel 무료 서버리스 배포에 최적화된 프론트엔드 브랜치
- **`local`**: 현재 서버에서 `server.cjs` + SQLite3로 단독 구동되는 풀스택 브랜치

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. 프로덕션 빌드
npm run build

# 3. SQLite 백엔드 & 정적 서버 실행 (80번 포트)
node server.cjs
```

---

## ☁️ Vercel 배포 & 로그인 연동 가이드

1. **Vercel에 GitHub 저장소(`SilverRuler/AI-Pulse`) 연결**:
   - `main` 브랜치 선택 후 배포 (Deploy)
2. **백엔드 API 주소 환경변수 등록**:
   - Vercel 프로젝트 대시보드 ➔ **Settings** ➔ **Environment Variables**
   - Key: `VITE_API_BASE_URL`
   - Value: `http://<내-백엔드-서버-IP>` (예: `http://123.45.67.89` 또는 API 도메인)
3. **현재 서버의 백엔드(`server.cjs`) 계속 실행**:
   - Vercel 프론트엔드에서 회원가입/로그인/구독을 요청하면 현재 서버의 SQLite DB에 실시간으로 데이터가 저장됩니다.

---

## 📁 프로젝트 구조

```
ai-newsletter-web/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # 상단 네비게이션 & 로그인 배지
│   │   ├── Hero.jsx            # Hero 영역 & 구독 폼 (로그인 체크)
│   │   ├── AuthModal.jsx       # 간편 회원가입 & 로그인 모달
│   │   ├── AdminModal.jsx      # 운영자 DB 콘솔 팝업
│   │   ├── FeaturedIssue.jsx   # 오늘의 큐레이션 카드
│   │   ├── ArchiveFeed.jsx     # 지난 뉴스레터 목록 & 검색
│   │   ├── ReaderModal.jsx     # 뉴스레터 전문 뷰어
│   │   ├── SubscribeModal.jsx  # 구독 완료 & 토픽 모달
│   │   └── Footer.jsx          # 푸터 (관리자 메뉴)
│   ├── data/
│   │   ├── koreaRegions.js     # 한국 3단계 행정구역 데이터
│   │   └── newsletters.js      # 뉴스레터 아티클 데이터
│   ├── utils/
│   │   └── api.js              # API Base URL 환경변수 유틸
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── server.cjs                  # Node.js + SQLite3 백엔드 API & 정적 서빙
├── vercel.json                 # Vercel SPA 배포 설정
├── .env.example                # 환경변수 템플릿
├── package.json
└── vite.config.js
```

---

## 📄 라이선스

MIT License © 2026 11 DayCare Letter
