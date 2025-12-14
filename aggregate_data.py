"""
ads_cost_raw_202505.csv.gz를 집계하여 대시보드용 CSV 3개 생성
"""
import pandas as pd
import os

GZ_FILE = 'data/ads_cost_raw_202505.csv.gz'

# 컬럼 매핑 (gz -> 내부명)
COL_MAP = {
    'rd[dim_main_date]': 'date',
    'rd[dim_media]': 'media',
    'rd[dim_cat1_campaign]': 'campaign',
    'rd[media_imp]': 'impressions',
    'rd[media_click]': 'clicks',
    'rd[media_cost1_net]': 'cost',
    'rd[media_cost4_settle]': 'revenue',
    'rd[media_install]': 'app_installs',
    'rd[ab_ao_total]': 'conversions',
}

print(f"[1/4] gz 파일 로딩 중... ({GZ_FILE})")
df = pd.read_csv(GZ_FILE, compression='gzip', encoding='cp949', usecols=list(COL_MAP.keys()))
df.rename(columns=COL_MAP, inplace=True)
print(f"[OK] 로딩 완료: {len(df):,} rows")

# data 폴더 생성
os.makedirs('data', exist_ok=True)

# 일자 컬럼을 datetime으로 변환
df['date'] = pd.to_datetime(df['date'])

# ============================================
# 1. 일별 집계 (daily_summary.csv)
# ============================================
print("\n[2/4] 일별 집계 중...")
daily = df.groupby('date').agg({
    'impressions': 'sum',
    'clicks': 'sum',
    'cost': 'sum',
    'revenue': 'sum',
    'app_installs': 'sum',
    'conversions': 'sum'
}).reset_index()

daily['date'] = daily['date'].dt.strftime('%Y-%m-%d')
daily = daily.sort_values('date')
daily.to_csv('data/daily_summary.csv', index=False, encoding='utf-8')
print(f"   -> data/daily_summary.csv ({len(daily)} rows)")

# ============================================
# 2. 매체별 집계 (channel_summary.csv)
# ============================================
print("\n[3/4] 매체별 집계 중...")
channels = df.groupby('media').agg({
    'impressions': 'sum',
    'clicks': 'sum',
    'cost': 'sum',
    'revenue': 'sum',
    'conversions': 'sum'
}).reset_index()

channels.columns = ['name', 'impressions', 'clicks', 'cost', 'revenue', 'conversions']
channels = channels.sort_values('cost', ascending=False)
channels.to_csv('data/channel_summary.csv', index=False, encoding='utf-8')
print(f"   -> data/channel_summary.csv ({len(channels)} rows)")

# ============================================
# 3. 캠페인별 집계 (campaign_summary.csv)
# ============================================
print("\n[4/4] 캠페인별 집계 중...")
campaigns = df.groupby('campaign').agg({
    'impressions': 'sum',
    'clicks': 'sum',
    'cost': 'sum',
    'revenue': 'sum',
    'conversions': 'sum'
}).reset_index()

campaigns.columns = ['name', 'impressions', 'clicks', 'cost', 'revenue', 'conversions']
campaigns = campaigns.sort_values('cost', ascending=False).head(10)  # 상위 10개만
campaigns.to_csv('data/campaign_summary.csv', index=False, encoding='utf-8')
print(f"   -> data/campaign_summary.csv ({len(campaigns)} rows)")

# ============================================
# 파일 크기 확인
# ============================================
print("\n[DONE] 생성된 파일:")
for f in ['daily_summary.csv', 'channel_summary.csv', 'campaign_summary.csv']:
    path = f'data/{f}'
    size = os.path.getsize(path) / 1024
    print(f"   {f}: {size:.1f} KB")

print("\nAll done!")
