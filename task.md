# Dashboard UI 수정 작업 로그

## 현재 작업 (2025-12-15)

### 목표
1. [x] 채널 파이차트 레전드 제한 → 전체 표시로 변경
2. [x] 캠페인 차트 날짜 필터 연동
3. [x] 파이차트 중앙 텍스트 위치 고정 (Chart.js 플러그인)
4. [x] 기간 비교 차트 스케일 수정 (정규화 %)

---

## 완료된 작업

### 1. 파이차트 중앙 텍스트 (Chart.js 플러그인)
- **파일**: `js/charts.js`
- **내용**: `centerTextPlugin`으로 캔버스에 직접 렌더링하여 정확한 중앙 배치

### 2. 채널 파이차트 레전드 전체 표시
- **파일**: `js/charts.js`
- **내용**: 5개 제한 해제, 10색 팔레트 적용

### 3. 캠페인 차트 날짜 연동
- **파일**: `js/data.js`, `js/app.js`
- **내용**: `dailyCampaign` 데이터 + `aggregateCampaignsByDateRange()` 함수

### 4. 기간 비교 차트 정규화
- **파일**: `js/charts.js`
- **내용**: 현재 기간 100% 기준, 이전 기간 비율로 표시. 툴팁에 실제 값 표시.

---

## 수정 파일 목록
- `js/charts.js` - 파이차트 플러그인, 채널 레전드, 기간 비교 정규화
- `js/data.js` - dailyCampaign 데이터 및 집계 함수
- `js/app.js` - 날짜 범위 선택 시 캠페인 동적 집계
- `css/style.css` - .doughnut-center 숨김
