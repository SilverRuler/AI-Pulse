# 뉴스레터 큐레이션 파이프라인 V2 가이드

> 이 가이드는 `welfare9.py` + `summarize_article.py` + `daily_curation2.sh` 조합으로 구성된  
> 개선된 자동화 파이프라인을 oci2.silverruler.xyz 서버에 적용하는 방법을 설명합니다.

---

## 1. 이전 버전 대비 개선 사항

| 항목 | 기존(v8) | 개선(v9) |
|------|---------|---------|
| 기사 ID | SHA256 해시 → 카테고리마다 동일한 ID | `issue-{날짜}-{카테고리}-{uuid8}` 완전 고유 |
| 카테고리 | LLM이 자유롭게 지정 | `care/nursing/info/health/policy` 5개로 강제 고정 |
| Redis 포맷 | 문자열 이중 래핑 오류 발생 가능 | Python으로 정확히 직렬화 후 pipeline API 사용 |
| ID 형식 예시 | `2f3a1c...` (해독 불가) | `issue-20260818-care-a3f2b1c9` (명확) |

### ID 포맷 규칙
```
issue-{YYYYMMDD}-{category}-{uuid4 앞 8자리}

예시:
  issue-20260818-care-a3f2b1c9
  issue-20260818-nursing-f7e1d204
  issue-20260818-health-0bc43ef1
```

---

## 2. 생성된 파일 위치 (현재 서버)

현재 이 서버(`gemini77`)의 `/root/wellfare/oci2/daycare_letter/` 에 생성되어 있습니다:

```
/root/wellfare/oci2/daycare_letter/
├── welfare9.py           # 크롤러 (v9)
├── summarize_article.py  # AI 요약 + 고유 ID 생성
└── daily_curation2.sh    # 전체 파이프라인 실행 스크립트
```

---

## 3. OCI2 서버에 파일 복사 (scp)

oci2.silverruler.xyz 서버의 기존 경로가 `/root/welfare/oci2/daycare_letter/` 라고 가정합니다.

```bash
# 이 서버에서 실행 (gemini77 → oci2)
scp /root/wellfare/oci2/daycare_letter/welfare9.py \
    root@oci2.silverruler.xyz:/root/welfare/oci2/daycare_letter/

scp /root/wellfare/oci2/daycare_letter/summarize_article.py \
    root@oci2.silverruler.xyz:/root/welfare/oci2/daycare_letter/

scp /root/wellfare/oci2/daycare_letter/daily_curation2.sh \
    root@oci2.silverruler.xyz:/root/welfare/oci2/daycare_letter/
```

> ⚠️ oci2 서버의 실제 경로가 다르다면 위 경로를 맞게 수정하세요.

---

## 4. OCI2 서버에서 실행 준비

```bash
# OCI2 서버 SSH 접속
ssh root@oci2.silverruler.xyz

# 스크립트 실행 권한 부여
chmod +x /root/welfare/oci2/daycare_letter/daily_curation2.sh

# 스크립트 경로 내부도 OCI2 서버 기준으로 수정 (필요 시)
# daily_curation2.sh 1번째 줄 cd 경로를 실제 서버 경로에 맞게 변경
nano /root/welfare/oci2/daycare_letter/daily_curation2.sh
```

`daily_curation2.sh` 1번째 cd 줄:
```bash
# 현재
cd /root/wellfare/oci2/daycare_letter/ 
# OCI2 서버 실제 경로로 수정
cd /root/welfare/oci2/daycare_letter/
```

---

## 5. 크론탭 설정 (매일 00:30 실행)

```bash
# OCI2 서버에서 crontab 편집
crontab -e
```

아래 줄을 추가합니다:
```cron
30 0 * * * /root/welfare/oci2/daycare_letter/daily_curation2.sh >> /root/welfare/oci2/daycare_letter/cron.log 2>&1
```

---

## 6. Redis 데이터 포맷 (핵심)

### ✅ 올바른 포맷 (v2 방식)
Upstash `/pipeline` 엔드포인트를 사용해 JSON 배열 커맨드로 전송:

```bash
curl -X POST https://leading-boar-43697.upstash.io/pipeline \
  -H "Authorization: Bearer AaqxAAIgcDFiN2Y5YmYzYjYxZDc0YTQxOWY0OTg0MjM3ODFhNTIyNQ" \
  -H "Content-Type: application/json" \
  -d '[["SET","newsletters:data","[{\"id\":\"issue-20260818-care-a3f2b1c9\",\"category\":\"care\",...}]"]]'
```

**포인트**: 세 번째 인자가 **JSON 배열을 문자열화한 값** (단순 string, 이중래핑 아님)

### ❌ 잘못된 포맷 (이전 방식)
```bash
# 잘못된 예: value가 {"value": "..."} 객체로 감싸짐
curl -X POST https://leading-boar-43697.upstash.io/set/newsletters:data \
  -H "Content-Type: application/json" \
  -d '{"value": "[{...}]"}'
```
→ Redis에 `{"value": "..."}` 객체가 저장되어 프론트엔드에서 파싱 실패

---

## 7. 실행 후 검증

### 로그 확인
```bash
tail -20 /root/welfare/oci2/daycare_letter/batch.log
# SUCCESS 메시지가 있어야 정상
```

### Redis 데이터 직접 확인
```bash
curl -s \
  -H "Authorization: Bearer AaqxAAIgcDFiN2Y5YmYzYjYxZDc0YTQxOWY0OTg0MjM3ODFhNTIyNQ" \
  "https://leading-boar-43697.upstash.io/get/newsletters:data" | \
  python3 -c "
import json, sys
body = json.load(sys.stdin)
items = json.loads(body['result'])
print(f'총 {len(items)}개 기사')
cats = {}
for i in items: cats[i['category']] = cats.get(i['category'], 0) + 1
print('카테고리별:', cats)
print('첫번째 ID:', items[0]['id'])
"
```

정상 출력 예시:
```
총 20개 기사
카테고리별: {'care': 6, 'nursing': 5, 'health': 5, 'policy': 3, 'info': 1}
첫번째 ID: issue-20260818-care-a3f2b1c9
```

---

## 8. 파이프라인 흐름 요약

```
[매일 00:30]
     │
     ▼
welfare9.py
  → 네이버/구글/다음/공공데이터 크롤링
  → 5개 키워드 기반 수집
  → welfare.db에 저장 (link 기준 중복 제거)
     │
     ▼
summarize_article.py
  → 오늘 수집된 기사 최대 20개 가져옴
  → LLM (oci2.silverruler.xyz:20128) 호출 → JSON 요약
  → ID를 issue-{날짜}-{카테고리}-{uuid8}로 강제 부여
  → category/categoryName을 키워드 기반으로 강제 설정
  → curation_results_v2.json 저장 (최대 100개 누적)
     │
     ▼
daily_curation2.sh
  → curation_results_v2.json 읽기
  → Python으로 Upstash pipeline 페이로드 정확히 직렬화
  → Redis newsletters:data 키에 SET
  → batch.log에 성공/실패 기록
     │
     ▼
https://daycare.silverruler.xyz
  → /api/newsletters가 Redis에서 실시간 fetch
  → 프론트엔드에서 카테고리별 필터링 정상 작동
```
