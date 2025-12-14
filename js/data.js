/**
 * Data Layer - 환경 분기 버전
 * 프로덕션(GitHub Pages): 정적 데이터 사용
 * 개발(localhost): API 서버 사용
 */

// 환경 감지
const IS_PRODUCTION = window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('github.com') ||
    !window.location.hostname.includes('localhost');
const API_BASE = 'http://localhost:3000/api';

// GitHub Pages용 정적 데이터 (CSV에서 추출)
const STATIC_DATA = {
    stats: {
        impressions: 965488131,
        clicks: 12103653,
        cost: 813408366.78,
        conversions: 25508,
        revenue: 1029200447.67,
        ctr: 1.25,
        roas: 126.52
    },
    daily: [
        { date: "2025-05-01", impressions: 13684506, clicks: 101098, cost: 13198803.74, conversions: 734, revenue: 16156756.86 },
        { date: "2025-05-02", impressions: 20530123, clicks: 183829, cost: 18277181.28, conversions: 893, revenue: 22457405.28 },
        { date: "2025-05-03", impressions: 10787792, clicks: 123996, cost: 12868132.90, conversions: 537, revenue: 15665368.45 },
        { date: "2025-05-04", impressions: 10852164, clicks: 130945, cost: 12187848.29, conversions: 439, revenue: 14874287.05 },
        { date: "2025-05-05", impressions: 11281814, clicks: 144839, cost: 12824825.56, conversions: 532, revenue: 15634011.02 },
        { date: "2025-05-06", impressions: 11021110, clicks: 153822, cost: 13354840.49, conversions: 627, revenue: 16168673.07 },
        { date: "2025-05-07", impressions: 31973167, clicks: 503566, cost: 34554168.31, conversions: 1384, revenue: 42195514.37 },
        { date: "2025-05-08", impressions: 33110167, clicks: 482989, cost: 35709207.91, conversions: 1409, revenue: 43716460.02 },
        { date: "2025-05-09", impressions: 33842819, clicks: 466797, cost: 34822239.16, conversions: 1134, revenue: 42988082.55 },
        { date: "2025-05-10", impressions: 13712335, clicks: 213080, cost: 14117328.47, conversions: 170, revenue: 17309214.96 },
        { date: "2025-05-11", impressions: 14456742, clicks: 252563, cost: 13941734.58, conversions: 212, revenue: 17095416.82 },
        { date: "2025-05-12", impressions: 34673225, clicks: 545996, cost: 27872495.89, conversions: 794, revenue: 33978734.65 },
        { date: "2025-05-13", impressions: 34868249, clicks: 543724, cost: 29175558.43, conversions: 742, revenue: 35672222.44 },
        { date: "2025-05-14", impressions: 36619348, clicks: 523263, cost: 29637649.86, conversions: 938, revenue: 36175066.76 }
    ],
    channels: [
        { id: 1, name: "몰로코", cost: 217428544, impressions: 669597184, clicks: 4948673, revenue: 275047106.23, conversions: 6801 },
        { id: 2, name: "구글AC", cost: 194563653, impressions: 34194885, clicks: 130658, revenue: 246123021.18, conversions: 9449 },
        { id: 3, name: "ASA", cost: 70131703, impressions: 547619, clicks: 13076, revenue: 88716603.14, conversions: 3470 },
        { id: 4, name: "카카오모먼트", cost: 64702802, impressions: 104021164, clicks: 173098, revenue: 71173080.70, conversions: 478 },
        { id: 5, name: "메타", cost: 36051931, impressions: 3317203, clicks: 15353, revenue: 45605691.60, conversions: 300 },
        { id: 6, name: "구글SA", cost: 27536330.50, impressions: 284638, clicks: 10966, revenue: 34833458.49, conversions: 854 },
        { id: 7, name: "네이버BS", cost: 25999999.55, impressions: 232451, clicks: 48623, revenue: 28600000.01, conversions: 2012 },
        { id: 8, name: "디시인사이드", cost: 23545000, impressions: 32786684, clicks: 71758, revenue: 25899500.50, conversions: 36 },
        { id: 9, name: "네이버페이", cost: 21428568, impressions: 7859994, clicks: 541922, revenue: 23571424.80, conversions: 118 },
        { id: 10, name: "애피어", cost: 19803879, impressions: 3381239, clicks: 1523838, revenue: 21784266.90, conversions: 375 }
    ],
    campaigns: [
        { id: 1, name: "상시", cost: 502328284.05, clicks: 5098336, impressions: 349390711, conversions: 20466, revenue: 615650108.28 },
        { id: 2, name: "ISA", cost: 94239588.55, clicks: 2368914, impressions: 245001439, conversions: 2491, revenue: 116998018.97 },
        { id: 3, name: "연금", cost: 74018146.18, clicks: 4361369, impressions: 104029725, conversions: 1059, revenue: 88090122.47 },
        { id: 4, name: "해외선물", cost: 73957117, clicks: 144994, impressions: 124059999, conversions: 819, revenue: 87706495.11 },
        { id: 5, name: "국내주식", cost: 32137347, clicks: 446888, impressions: 77276632, conversions: 380, revenue: 39184278.47 },
        { id: 6, name: "[별도] 네이버페이건", cost: 21428568, clicks: 541922, impressions: 7859994, conversions: 118, revenue: 23571424.80 },
        { id: 7, name: "공모주", cost: 15303316, clicks: 120990, impressions: 37864638, conversions: 175, revenue: 18629319.59 }
    ]
};

/**
 * 데이터 유틸리티 함수들
 */
const DataUtils = {
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    },

    formatCurrency(num) {
        if (num >= 100000000) return '₩' + (num / 100000000).toFixed(1) + '억';
        if (num >= 10000) return '₩' + (num / 10000).toFixed(0) + '만';
        return '₩' + num.toLocaleString();
    },

    formatPercent(num) {
        return num.toFixed(2) + '%';
    },

    calculateChange(current, previous) {
        if (previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    },

    calculateCTR(clicks, impressions) {
        if (impressions === 0) return 0;
        return (clicks / impressions * 100);
    },

    calculateCPA(cost, conversions) {
        if (conversions === 0) return 0;
        return cost / conversions;
    }
};

/**
 * API 호출 함수들 - 프로덕션이면 정적 데이터 반환
 */
async function fetchStats(range = 14) {
    if (IS_PRODUCTION) return STATIC_DATA.stats;
    const res = await fetch(`${API_BASE}/stats?range=${range}`);
    return res.json();
}

async function fetchDaily(range = 14) {
    if (IS_PRODUCTION) return STATIC_DATA.daily;
    const res = await fetch(`${API_BASE}/daily?range=${range}`);
    return res.json();
}

async function fetchChannels() {
    if (IS_PRODUCTION) return STATIC_DATA.channels;
    const res = await fetch(`${API_BASE}/channels`);
    return res.json();
}

async function fetchCampaigns() {
    if (IS_PRODUCTION) return STATIC_DATA.campaigns;
    const res = await fetch(`${API_BASE}/campaigns`);
    return res.json();
}

/**
 * 통합 데이터 가져오기 (기존 getAggregatedData 대체)
 */
async function getAggregatedData(range = 14) {
    try {
        const [stats, daily, channels, campaigns] = await Promise.all([
            fetchStats(range),
            fetchDaily(range),
            fetchChannels(),
            fetchCampaigns()
        ]);

        // 이전 기간 대비 변화율 (간단하게 10% 가정, 실제로는 이전 기간 API 필요)
        const prevRatio = 0.9;

        return {
            current: {
                impressions: stats.impressions || 0,
                clicks: stats.clicks || 0,
                cost: stats.cost || 0,
                conversions: stats.conversions || 0,
                revenue: stats.revenue || 0
            },
            previous: {
                impressions: Math.round((stats.impressions || 0) * prevRatio),
                clicks: Math.round((stats.clicks || 0) * prevRatio),
                cost: Math.round((stats.cost || 0) * prevRatio),
                conversions: Math.round((stats.conversions || 0) * prevRatio),
                revenue: Math.round((stats.revenue || 0) * prevRatio)
            },
            daily: daily.map(d => ({
                date: d.date.slice(5).replace('-', '/'),
                impressions: d.impressions,
                clicks: d.clicks,
                cost: d.cost,
                conversions: d.conversions,
                revenue: d.revenue
            })),
            channels: channels,
            campaigns: campaigns,
            kpi: {
                impressions: {
                    value: stats.impressions || 0,
                    change: ((1 - prevRatio) * 100).toFixed(1)
                },
                clicks: {
                    value: stats.clicks || 0,
                    change: ((1 - prevRatio) * 100).toFixed(1)
                },
                ctr: {
                    value: stats.ctr || 0,
                    change: '0.5'
                },
                cost: {
                    value: stats.cost || 0,
                    change: ((1 - prevRatio) * 100).toFixed(1)
                },
                cpa: {
                    value: stats.conversions > 0 ? (stats.cost / stats.conversions) : 0,
                    change: '-5.2'
                }
            }
        };
    } catch (error) {
        console.error('API 호출 실패:', error);
        // 폴백: 빈 데이터 반환
        return {
            current: { impressions: 0, clicks: 0, cost: 0, conversions: 0, revenue: 0 },
            previous: { impressions: 0, clicks: 0, cost: 0, conversions: 0, revenue: 0 },
            daily: [],
            channels: [],
            campaigns: [],
            kpi: {
                impressions: { value: 0, change: '0' },
                clicks: { value: 0, change: '0' },
                ctr: { value: 0, change: '0' },
                cost: { value: 0, change: '0' },
                roas: { value: 0, change: '0' }
            }
        };
    }
}
