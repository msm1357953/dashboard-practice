/**
 * Mock Data for Ad Report Dashboard
 */

const MOCK_DATA = {
    // 기간별 일별 데이터 (14일)
    daily: [
        { date: '11/25', impressions: 245000, clicks: 8200, cost: 3200000, conversions: 156, revenue: 12500000 },
        { date: '11/26', impressions: 268000, clicks: 9100, cost: 3450000, conversions: 172, revenue: 13800000 },
        { date: '11/27', impressions: 234000, clicks: 7800, cost: 2980000, conversions: 145, revenue: 11200000 },
        { date: '11/28', impressions: 289000, clicks: 9800, cost: 3680000, conversions: 189, revenue: 15100000 },
        { date: '11/29', impressions: 312000, clicks: 10500, cost: 3920000, conversions: 201, revenue: 16400000 },
        { date: '11/30', impressions: 278000, clicks: 9200, cost: 3520000, conversions: 178, revenue: 14200000 },
        { date: '12/01', impressions: 256000, clicks: 8600, cost: 3280000, conversions: 162, revenue: 12900000 },
        { date: '12/02', impressions: 298000, clicks: 10100, cost: 3780000, conversions: 195, revenue: 15600000 },
        { date: '12/03', impressions: 325000, clicks: 11200, cost: 4120000, conversions: 218, revenue: 17500000 },
        { date: '12/04', impressions: 342000, clicks: 11800, cost: 4350000, conversions: 232, revenue: 18600000 },
        { date: '12/05', impressions: 318000, clicks: 10800, cost: 4050000, conversions: 209, revenue: 16800000 },
        { date: '12/06', impressions: 356000, clicks: 12200, cost: 4520000, conversions: 245, revenue: 19800000 },
        { date: '12/07', impressions: 378000, clicks: 13100, cost: 4850000, conversions: 268, revenue: 21500000 },
        { date: '12/08', impressions: 365000, clicks: 12600, cost: 4680000, conversions: 256, revenue: 20500000 }
    ],

    // 이전 기간 데이터 (비교용)
    previousPeriod: {
        impressions: 3650000,
        clicks: 125000,
        cost: 48200000,
        conversions: 2050,
        revenue: 164000000
    },

    // 매체별 데이터
    channels: [
        { name: 'Google Ads', cost: 22500000, impressions: 1850000, clicks: 58000, color: '#4285F4' },
        { name: 'Meta Ads', cost: 18200000, impressions: 1420000, clicks: 48000, color: '#1877F2' },
        { name: 'Naver', cost: 8500000, impressions: 680000, clicks: 22000, color: '#03C75A' },
        { name: 'Kakao', cost: 5200000, impressions: 420000, clicks: 14000, color: '#FEE500' },
        { name: 'TikTok', cost: 3980000, impressions: 310000, clicks: 10600, color: '#000000' }
    ],

    // 캠페인별 데이터
    campaigns: [
        { name: '브랜드 인지도', cost: 15200000, clicks: 42000, conversions: 580, roas: 285 },
        { name: '신규 고객 확보', cost: 12800000, clicks: 38000, conversions: 720, roas: 356 },
        { name: '리타겟팅', cost: 8500000, clicks: 28000, conversions: 890, roas: 520 },
        { name: '프로모션', cost: 10200000, clicks: 32000, conversions: 450, roas: 278 },
        { name: '앱 설치', cost: 6800000, clicks: 22000, conversions: 380, roas: 245 },
        { name: '시즌 캠페인', cost: 4880000, clicks: 15600, conversions: 286, roas: 312 }
    ]
};

/**
 * 데이터 유틸리티 함수들
 */
const DataUtils = {
    // 숫자 포맷팅 (1000 -> 1K, 1000000 -> 1M)
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    },

    // 통화 포맷팅
    formatCurrency(num) {
        if (num >= 100000000) {
            return '₩' + (num / 100000000).toFixed(1) + '억';
        }
        if (num >= 10000) {
            return '₩' + (num / 10000).toFixed(0) + '만';
        }
        return '₩' + num.toLocaleString();
    },

    // 퍼센트 포맷팅
    formatPercent(num) {
        return num.toFixed(2) + '%';
    },

    // 변화율 계산
    calculateChange(current, previous) {
        if (previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    },

    // 일별 데이터 합계 계산
    calculateTotals(dailyData) {
        return dailyData.reduce((acc, day) => {
            acc.impressions += day.impressions;
            acc.clicks += day.clicks;
            acc.cost += day.cost;
            acc.conversions += day.conversions;
            acc.revenue += day.revenue;
            return acc;
        }, { impressions: 0, clicks: 0, cost: 0, conversions: 0, revenue: 0 });
    },

    // 기간별 데이터 필터링
    filterByRange(dailyData, days) {
        return dailyData.slice(-days);
    },

    // CTR 계산
    calculateCTR(clicks, impressions) {
        if (impressions === 0) return 0;
        return (clicks / impressions * 100);
    },

    // ROAS 계산
    calculateROAS(revenue, cost) {
        if (cost === 0) return 0;
        return (revenue / cost * 100);
    },

    // CPC 계산
    calculateCPC(cost, clicks) {
        if (clicks === 0) return 0;
        return cost / clicks;
    }
};

// 기간별 집계 데이터 생성
function getAggregatedData(range = 14) {
    const filteredDaily = DataUtils.filterByRange(MOCK_DATA.daily, range);
    const totals = DataUtils.calculateTotals(filteredDaily);
    const previous = MOCK_DATA.previousPeriod;
    
    // 비교 기간 비율 조정 (7일이면 절반)
    const ratio = range / 14;
    const adjustedPrevious = {
        impressions: Math.round(previous.impressions * ratio),
        clicks: Math.round(previous.clicks * ratio),
        cost: Math.round(previous.cost * ratio),
        conversions: Math.round(previous.conversions * ratio),
        revenue: Math.round(previous.revenue * ratio)
    };

    return {
        current: totals,
        previous: adjustedPrevious,
        daily: filteredDaily,
        channels: MOCK_DATA.channels,
        campaigns: MOCK_DATA.campaigns,
        kpi: {
            impressions: {
                value: totals.impressions,
                change: DataUtils.calculateChange(totals.impressions, adjustedPrevious.impressions)
            },
            clicks: {
                value: totals.clicks,
                change: DataUtils.calculateChange(totals.clicks, adjustedPrevious.clicks)
            },
            ctr: {
                value: DataUtils.calculateCTR(totals.clicks, totals.impressions),
                change: DataUtils.calculateChange(
                    DataUtils.calculateCTR(totals.clicks, totals.impressions),
                    DataUtils.calculateCTR(adjustedPrevious.clicks, adjustedPrevious.impressions)
                )
            },
            cost: {
                value: totals.cost,
                change: DataUtils.calculateChange(totals.cost, adjustedPrevious.cost)
            },
            roas: {
                value: DataUtils.calculateROAS(totals.revenue, totals.cost),
                change: DataUtils.calculateChange(
                    DataUtils.calculateROAS(totals.revenue, totals.cost),
                    DataUtils.calculateROAS(adjustedPrevious.revenue, adjustedPrevious.cost)
                )
            }
        }
    };
}
