# ⏰ 11 DayCare Letter — 매일 00:30 AI 뉴스레터 자동화 배치 가이드 (batch.md)

본 문서는 **매일 오전 00시 30분(KST)**에 자동으로 기사를 크롤링하고, AI로 요약하여, Upstash Redis에 푸시하는 **전체 일괄 자동화 프로세스**를 안내합니다.

---

## 📊 1. 전체 배치 파이프라인 개요

```
[매일 00:30 Cron 실행]
       │
       ▼
 1. 크롤링 (Crawling)
    - 5대 키워드(돌봄, 요양케어, 노인정보, 건강, 복지) 최신 뉴스 수집
       │
       ▼
 2. AI 분석 및 표준 JSON 요약 (LLM Curation)
    - OpenAI / Gemini 등을 활용하여 3줄 요약, 본문 소주제, 출처 링크 생성
       │
       ▼
 3. Upstash Redis 자동 푸시 (Push to Redis)
    - 'newsletters:data' 키에 저장 ➔ Vercel 웹사이트에 0.1초 만에 실시간 반영
       │
       ▼
 4. (선택) 구독자 이메일 일괄 자동 발송
    - Redis의 'subscribers:list'에 등록된 이메일로 아침 뉴스레터 자동 메일링
```

---

## 🛠️ 2. 단계별 상세 프로세스

### [Step 1] 기사 크롤링 (Crawling)
- **수집 대상**: 네이버 뉴스 API, 다음 뉴스, 보건복지부 보도자료, 국민건강보험공단
- **수집 키워드**:
  1. `어르신 돌봄` / `방문돌봄` / `노인맞춤돌봄`
  2. `어르신 요양케어` / `주간보호센터` / `방문요양`
  3. `노인장기요양 등급` / `장기요양 인정신청` / `노인정보`
  4. `어르신 건강` / `시니어 재활` / `치매 예방` / `노인 식단`
  5. `노인 복지정책` / `본인부담금 감경` / `기초연금`

### [Step 2] AI 요약 및 표준 JSON 변환 (AI Summarization)
- 크롤링된 본문을 LLM에게 넘겨 웹사이트 전용 JSON 규격으로 변환합니다.
- **필수 출력 필드**:
  - `id`: `issue-YYYYMMDD-{category}`
  - `category`: `care` | `nursing` | `info` | `health` | `policy`
  - `title`: 매력적이고 신뢰감 있는 30자 이내 헤드라인
  - `bullets`: 3줄 핵심 요약 배열
  - `content`: `{ tldr, sections: [{heading, text}], sources: [{name, url}] }`

### [Step 3] Upstash Redis 자동 푸시 (Redis Push)
- 생성된 `curation_results.json` 데이터를 Upstash Redis의 **`newsletters:data`** 키에 덮어씁니다(`SET`).
- Vercel에 배포된 웹사이트는 새로고침 시 이 Redis 데이터를 실시간으로 읽어 화면을 갱신합니다.

---

## 🐍 3. 일괄 실행 통합 파이썬 스크립트 예시 (`run_daily_batch.py`)

서버의 `/root/wellfare/run_daily_batch.py` 위치에 두고 크론탭으로 실행할 수 있는 통합 스크립트 구조입니다:

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
11 DayCare Letter — 매일 00:30 일괄 배치 스크립트
1. 뉴스 크롤링 ➔ 2. AI 요약 ➔ 3. Redis 푸시 ➔ 4. 로그 기록
"""

import os
import json
import time
import requests
from datetime import datetime

# ================= 1. 환경 설정 =================
UPSTASH_URL = "https://leading-boar-43697.upstash.io"
UPSTASH_TOKEN = "AaqxAAIgcDFiN2Y5YmYzYjYxZDc0YTQxOWY0OTg0MjM3ODFhNTIyNQ"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "your-api-key-here")

CATEGORIES = [
    {"id": "care", "name": "어르신 돌봄", "query": "어르신 돌봄 OR 노인맞춤돌봄"},
    {"id": "nursing", "name": "어르신 요양케어", "query": "주간보호센터 OR 방문요양"},
    {"id": "info", "name": "노인정보 관리", "query": "장기요양 등급신청 OR 노인복지 혜택"},
    {"id": "health", "name": "건강 관리법", "query": "어르신 재활 OR 치매 예방 OR 노인 식단"},
    {"id": "policy", "name": "복지정책", "query": "장기요양보험 본인부담금 OR 보건복지부 노인"}
]

# ================= 2. 크롤링 함수 =================
def crawl_latest_news():
    print(f"[{datetime.now()}] 1. 뉴스 크롤링 시작...")
    crawled_articles = []
    
    # 예시: 기사 수집 로직 (기존 구현하신 크롤러 연동)
    # 각 카테고리별 최신 기사 1~2건씩 추출
    for cat in CATEGORIES:
        # article = fetch_news(cat['query'])
        # crawled_articles.append(article)
        pass
        
    return crawled_articles

# ================= 3. AI 요약 함수 =================
def summarize_with_ai(articles):
    print(f"[{datetime.now()}] 2. AI 요약 및 JSON 생성 중...")
    
    # 기존에 잘 동작했던 curation 로직 호출
    # 결과물: List of Newsletter Objects (curation_results.json)
    # with open('/root/wellfare/curation_results.json', 'r', encoding='utf-8') as f:
    #     curated_data = json.load(f)
    
    # return curated_data
    pass

# ================= 4. Upstash Redis 푸시 함수 =================
def push_to_upstash_redis(curated_data):
    print(f"[{datetime.now()}] 3. Upstash Redis 데이터 푸시 시작...")
    
    headers = {
        "Authorization": f"Bearer {UPSTASH_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Redis의 'newsletters:data' 키에 JSON 통째로 저장
    payload = json.dumps(json.dumps(curated_data, ensure_ascii=False))
    
    res = requests.post(
        f"{UPSTASH_URL}/set/newsletters:data",
        headers=headers,
        data=payload,
        timeout=10
    )
    
    if res.status_code == 200:
        print(f"[{datetime.now()}] 🎉 Redis 푸시 성공! (응답: {res.json()})")
    else:
        print(f"[{datetime.now()}] ❌ Redis 푸시 실패: {res.text}")

# ================= 메인 실행 =================
def main():
    start_time = time.time()
    today_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"==================================================")
    print(f"🚀 [11 DayCare Letter 배치 시작] : {today_str}")
    print(f"==================================================")
    
    try:
        # 1. 크롤링
        # articles = crawl_latest_news()
        
        # 2. AI 요약 (curation_results.json 생성)
        # curated_data = summarize_with_ai(articles)
        
        # 임시: 생성된 curation_results.json 파일이 있다면 바로 푸시
        json_path = "/root/wellfare/curation_results.json"
        if os.path.exists(json_path):
            with open(json_path, "r", encoding="utf-8") as f:
                curated_data = json.load(f)
            push_to_upstash_redis(curated_data)
        
        elapsed = round(time.time() - start_time, 2)
        print(f"✅ 배치 완료 (소요 시간: {elapsed}초)")
        
    except Exception as e:
        print(f"🚨 배치 중 에러 발생: {e}")

if __name__ == "__main__":
    main()
```

---

## ⏰ 4. 리눅스 크론탭(Cron) 등록 방법 (매일 00:30 실행)

리눅스 서버 터미널에서 다음 명령어로 크론탭을 등록합니다:

### 1) 크론탭 편집기 열기
```bash
crontab -e
```

### 2) 스케줄 설정 추가 (맨 아래에 작성)
```cron
# 매일 오전 00시 30분에 뉴스 크롤링 + 요약 + Redis 푸시 배치 실행
30 0 * * * /usr/bin/python3 /root/wellfare/run_daily_batch.py >> /root/wellfare/batch.log 2>&1
```

> **크론 표현식 설명**:
> - `30`: 30분
> - `0`: 00시 (자정)
> - `* * *`: 매일, 매월, 모든 요일
> - `>> /root/wellfare/batch.log 2>&1`: 실행 결과와 에러 로그를 `batch.log` 파일에 매일 누적 기록

---

## 📈 5. 운영 및 모니터링 꿀팁

1. **로그 확인**:
   ```bash
   tail -n 50 /root/wellfare/batch.log
   ```
2. **비용 절감**:
   - 요약 모델로 `gpt-4o-mini` 또는 `gemini-1.5-flash`를 사용하면 하루 5건 요약 기준 **월 비용이 100원 미만**으로 거의 무료에 가깝습니다.
3. **에러 대비 Fallback**:
   - 만약 특정 날짜에 크롤링에 실패하더라도, Redis에는 **어제 날짜의 뉴스레터가 안전하게 유지**되므로 웹사이트 화면이 빈 공간으로 깨지지 않습니다.
