# ⚡ AI Pulse — 매일 아침 3분, AI 핵심 테크 뉴스 배달

<div align="center">
  <h3>AI 기반 기술 기사 크롤링 & 무료 뉴스레터 웹 플랫폼</h3>
  <p>바쁜 개발자, 기획자, 연구원을 위해 AI가 노이즈를 걷어내고 가장 중요한 기술 동향과 실무 인사이트만 엄선하여 배달합니다.</p>
</div>

---

## ✨ 주요 기능 및 특징

- 🎯 **One-Click 이메일 무료 구독**: 전환율 높은 직관적인 구독 폼 및 관심 토픽 선택
- ⚡ **오늘의 AI 큐레이션 (Featured Issue)**: 오늘자 핵심 테크 뉴스 3줄 불릿 요약
- 📚 **지난 뉴스레터 아카이브 & 검색**:
  - 카테고리 필터 (`🤖 LLM & 모델`, `🛠️ 오픈소스 & 툴`, `📈 테크 & 비즈니스`, `🔬 논문 & 리서치`)
  - 실시간 키워드 검색
- 📖 **인터랙티브 리더 뷰어 (Reader Modal)**:
  - AI 3줄 핵심 요약 (TL;DR)
  - 소주제별 본문 분석 및 원문 출처 링크 제공
  - 원클릭 링크 복사 및 소셜 공유
- 🌗 **다크 모드 / 라이트 모드**: 완벽한 테마 토글 지원
- 🚀 **초경량 & 초고속**: React 19 + Vite 기반의 순수 번들

---

## 🛠️ 기술 스택

- **Frontend**: React 19, Vite, Vanilla CSS Design System
- **Icons**: Lucide React
- **Typography**: Plus Jakarta Sans, JetBrains Mono

---

## 🚀 로컬 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 서빙 (80번 포트)
node server.cjs
```

---

## 📁 프로젝트 구조

```
ai-newsletter-web/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # 상단 네비게이션 & 테마 토글
│   │   ├── Hero.jsx            # Hero 영역 & 무료 구독 폼
│   │   ├── FeaturedIssue.jsx   # 오늘의 추천 뉴스레터 카드
│   │   ├── ArchiveFeed.jsx     # 지난 뉴스레터 목록 & 검색 & 카테고리
│   │   ├── ReaderModal.jsx     # 뉴스레터 전문 읽기 모달
│   │   ├── SubscribeModal.jsx  # 구독 완료 & 토픽 설정 팝업
│   │   └── Footer.jsx          # 하단 푸터 & 링크
│   ├── data/
│   │   └── newsletters.js      # 뉴스레터 기사 데이터 및 카테고리
│   ├── App.jsx                 # 메인 애플리케이션 컴포넌트
│   ├── index.css               # 모던 다크/라이트 디자인 시스템 CSS
│   └── main.jsx                # React 엔트리포인트
├── server.cjs                  # 경량 정적 웹 서버 (80번 포트)
├── index.html
├── package.json
└── vite.config.js
```

---

## 📄 라이선스

MIT License © 2026 AI Pulse
