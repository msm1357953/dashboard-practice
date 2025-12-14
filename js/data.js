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

// GitHub Pages용 정적 데이터 (CSV에서 추출 - 2025-05 전체)
const STATIC_DATA = {
    stats: {
        impressions: 945483138,
        clicks: 13083413,
        cost: 813412366.78,
        conversions: 25508,
        revenue: 989829767.67,
        ctr: 1.38,
        roas: 121.68
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
        { date: "2025-05-14", impressions: 36619348, clicks: 523263, cost: 29637649.86, conversions: 938, revenue: 36175066.76 },
        { date: "2025-05-15", impressions: 37198277, clicks: 611398, cost: 30956504.92, conversions: 982, revenue: 37674462.14 },
        { date: "2025-05-16", impressions: 35248931, clicks: 620207, cost: 29123904.25, conversions: 727, revenue: 35608017.88 },
        { date: "2025-05-17", impressions: 17770918, clicks: 331663, cost: 17017872.67, conversions: 393, revenue: 20701178.39 },
        { date: "2025-05-18", impressions: 17195820, clicks: 327343, cost: 16278744.98, conversions: 408, revenue: 19839608.50 },
        { date: "2025-05-19", impressions: 39320222, clicks: 683714, cost: 29428558.00, conversions: 652, revenue: 35747223.59 },
        { date: "2025-05-20", impressions: 40005948, clicks: 614920, cost: 31866298.73, conversions: 855, revenue: 38713639.97 },
        { date: "2025-05-21", impressions: 41452402, clicks: 481380, cost: 32009999.27, conversions: 941, revenue: 39033912.26 },
        { date: "2025-05-22", impressions: 42913264, clicks: 543055, cost: 33172732.22, conversions: 827, revenue: 40391335.36 },
        { date: "2025-05-23", impressions: 39623223, clicks: 510095, cost: 30706807.99, conversions: 736, revenue: 37562162.64 },
        { date: "2025-05-24", impressions: 20145726, clicks: 242064, cost: 14351406.40, conversions: 569, revenue: 17258109.54 },
        { date: "2025-05-25", impressions: 18568895, clicks: 232993, cost: 14435630.14, conversions: 625, revenue: 17346088.81 },
        { date: "2025-05-26", impressions: 44215744, clicks: 653158, cost: 34196386.34, conversions: 1099, revenue: 41145149.51 },
        { date: "2025-05-27", impressions: 46666249, clicks: 582625, cost: 36530691.06, conversions: 1279, revenue: 44078903.49 },
        { date: "2025-05-28", impressions: 53245108, clicks: 632671, cost: 40094700.91, conversions: 1339, revenue: 48495036.90 },
        { date: "2025-05-29", impressions: 65726109, clicks: 689208, cost: 52588797.20, conversions: 1652, revenue: 63638174.56 },
        { date: "2025-05-30", impressions: 52372288, clicks: 616835, cost: 44033716.16, conversions: 1441, revenue: 53460241.71 },
        { date: "2025-05-31", impressions: 22400453, clicks: 339577, cost: 24077600.67, conversions: 438, revenue: 29049308.13 }
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
        { id: 2, name: "설치 유도", cost: 94239588.55, clicks: 2368914, impressions: 245001439, conversions: 2491, revenue: 116998018.97 },
        { id: 3, name: "가입 유도", cost: 74018146.18, clicks: 4361369, impressions: 104029725, conversions: 1059, revenue: 88090122.47 },
        { id: 4, name: "개설 유도", cost: 73957117, clicks: 144994, impressions: 124059999, conversions: 819, revenue: 87706495.11 },
        { id: 5, name: "매수 유도", cost: 32137347, clicks: 446888, impressions: 77276632, conversions: 380, revenue: 39184278.47 },
        { id: 6, name: "[별도] 네이버페이건", cost: 21428568, clicks: 541922, impressions: 7859994, conversions: 118, revenue: 23571424.80 },
        { id: 7, name: "공모주", cost: 15303316, clicks: 120990, impressions: 37864638, conversions: 175, revenue: 18629319.59 }
    ],
    // 일별 캠페인 데이터 (daily_campaign.csv 기반)
    dailyCampaign: [
        { date: "2025-05-01", name: "상시", impressions: 6618675, clicks: 54881, cost: 10928104.26, conversions: 629 },
        { date: "2025-05-01", name: "설치 유도", impressions: 3845116, clicks: 40875, cost: 1249054.48, conversions: 59 },
        { date: "2025-05-01", name: "개설 유도", impressions: 1702233, clicks: 1306, cost: 520328, conversions: 31 },
        { date: "2025-05-01", name: "매수 유도", impressions: 1518482, clicks: 4036, cost: 501317, conversions: 15 },
        { date: "2025-05-02", name: "상시", impressions: 9402468, clicks: 106250, cost: 14515565.99, conversions: 752 },
        { date: "2025-05-02", name: "설치 유도", impressions: 6682801, clicks: 66398, cost: 2274951.29, conversions: 104 },
        { date: "2025-05-02", name: "개설 유도", impressions: 1500827, clicks: 1192, cost: 567764, conversions: 12 },
        { date: "2025-05-02", name: "매수 유도", impressions: 2944027, clicks: 9989, cost: 918900, conversions: 25 },
        { date: "2025-05-07", name: "상시", impressions: 13918923, clicks: 191742, cost: 24998485.63, conversions: 1102 },
        { date: "2025-05-07", name: "설치 유도", impressions: 9232306, clicks: 85956, cost: 3646785.75, conversions: 186 },
        { date: "2025-05-07", name: "가입 유도", impressions: 3935468, clicks: 211486, cost: 3557153.93, conversions: 23 },
        { date: "2025-05-07", name: "개설 유도", impressions: 2194799, clicks: 2385, cost: 1081397, conversions: 41 },
        { date: "2025-05-07", name: "매수 유도", impressions: 2691671, clicks: 11997, cost: 1270346, conversions: 32 },
        { date: "2025-05-14", name: "상시", impressions: 13503190, clicks: 216073, cost: 17639895.03, conversions: 725 },
        { date: "2025-05-14", name: "설치 유도", impressions: 11557398, clicks: 95638, cost: 4369699.19, conversions: 119 },
        { date: "2025-05-14", name: "가입 유도", impressions: 5305634, clicks: 192367, cost: 3718970.18, conversions: 46 },
        { date: "2025-05-14", name: "개설 유도", impressions: 3900325, clicks: 4963, cost: 2460566.46, conversions: 31 },
        { date: "2025-05-14", name: "매수 유도", impressions: 2352801, clicks: 14222, cost: 1448519, conversions: 17 },
        { date: "2025-05-21", name: "상시", impressions: 14814354, clicks: 142724, cost: 18317371.62, conversions: 736 },
        { date: "2025-05-21", name: "설치 유도", impressions: 11310516, clicks: 106311, cost: 4321267.10, conversions: 96 },
        { date: "2025-05-21", name: "가입 유도", impressions: 5514710, clicks: 205150, cost: 3824754.09, conversions: 59 },
        { date: "2025-05-21", name: "개설 유도", impressions: 6161621, clicks: 7072, cost: 4079619.46, conversions: 32 },
        { date: "2025-05-21", name: "매수 유도", impressions: 3651201, clicks: 20123, cost: 1466987, conversions: 18 },
        { date: "2025-05-28", name: "상시", impressions: 18032902, clicks: 181766, cost: 20230265.78, conversions: 1050 },
        { date: "2025-05-28", name: "설치 유도", impressions: 10305005, clicks: 91498, cost: 4501675.56, conversions: 123 },
        { date: "2025-05-28", name: "가입 유도", impressions: 4851603, clicks: 226423, cost: 3401756.12, conversions: 64 },
        { date: "2025-05-28", name: "개설 유도", impressions: 7524844, clicks: 8253, cost: 4224821.46, conversions: 51 },
        { date: "2025-05-28", name: "매수 유도", impressions: 4295834, clicks: 15047, cost: 1539625, conversions: 16 },
        { date: "2025-05-28", name: "공모주", impressions: 7029921, clicks: 18899, cost: 2625128, conversions: 13 },
        { date: "2025-05-28", name: "[별도] 네이버페이건", impressions: 1204999, clicks: 90785, cost: 3571429, conversions: 22 },
        { date: "2025-05-29", name: "상시", impressions: 17498648, clicks: 196642, cost: 25078085.16, conversions: 1313 },
        { date: "2025-05-29", name: "설치 유도", impressions: 8835914, clicks: 90306, cost: 4468833.46, conversions: 103 },
        { date: "2025-05-29", name: "가입 유도", impressions: 4610283, clicks: 230572, cost: 4152976.12, conversions: 65 },
        { date: "2025-05-29", name: "개설 유도", impressions: 7915975, clicks: 8555, cost: 4215614.46, conversions: 47 },
        { date: "2025-05-29", name: "매수 유도", impressions: 3837803, clicks: 22114, cost: 1754884, conversions: 13 },
        { date: "2025-05-29", name: "공모주", impressions: 21874578, clicks: 73068, cost: 9346975, conversions: 87 },
        { date: "2025-05-29", name: "[별도] 네이버페이건", impressions: 1152908, clicks: 67951, cost: 3571429, conversions: 24 },
        { date: "2025-05-30", name: "상시", impressions: 16870534, clicks: 176351, cost: 24295987.67, conversions: 1128 },
        { date: "2025-05-30", name: "설치 유도", impressions: 8832627, clicks: 89825, cost: 3990556.92, conversions: 97 },
        { date: "2025-05-30", name: "가입 유도", impressions: 4172669, clicks: 214949, cost: 3298609.12, conversions: 58 },
        { date: "2025-05-30", name: "개설 유도", impressions: 8770252, clicks: 8673, cost: 4145359.46, conversions: 38 },
        { date: "2025-05-30", name: "매수 유도", impressions: 3531301, clicks: 19844, cost: 1400561, conversions: 18 },
        { date: "2025-05-30", name: "공모주", impressions: 8960138, clicks: 29023, cost: 3331213, conversions: 66 },
        { date: "2025-05-30", name: "[별도] 네이버페이건", impressions: 1234767, clicks: 78170, cost: 3571429, conversions: 36 },
        { date: "2025-05-31", name: "상시", impressions: 9163125, clicks: 120570, cost: 15131659.44, conversions: 338 },
        { date: "2025-05-31", name: "설치 유도", impressions: 4522230, clicks: 52461, cost: 1730272.65, conversions: 53 },
        { date: "2025-05-31", name: "가입 유도", impressions: 1936490, clicks: 73017, cost: 1017499.12, conversions: 16 },
        { date: "2025-05-31", name: "개설 유도", impressions: 5541325, clicks: 5773, cost: 2626739.46, conversions: 13 },
        { date: "2025-05-31", name: "[별도] 네이버페이건", impressions: 1237282, clicks: 87756, cost: 3571429, conversions: 8 }
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
        if (num >= 100000000) return '₩' + (num / 100000000).toFixed(2) + '억';
        if (num >= 10000) return '₩' + (num / 10000).toFixed(2) + '만';
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
 * API 호출 함수들 - 프로덕션이면 정적 데이터 반환 (range 필터링 적용)
 */
async function fetchStats(range = 14) {
    if (IS_PRODUCTION) {
        // range에 맞게 daily 데이터에서 stats 계산
        const daily = STATIC_DATA.daily.slice(-range);
        const stats = {
            impressions: daily.reduce((s, d) => s + d.impressions, 0),
            clicks: daily.reduce((s, d) => s + d.clicks, 0),
            cost: daily.reduce((s, d) => s + d.cost, 0),
            conversions: daily.reduce((s, d) => s + d.conversions, 0),
            revenue: daily.reduce((s, d) => s + d.revenue, 0)
        };
        stats.ctr = stats.impressions > 0 ? (stats.clicks / stats.impressions * 100) : 0;
        stats.roas = stats.cost > 0 ? (stats.revenue / stats.cost * 100) : 0;
        return stats;
    }
    const res = await fetch(`${API_BASE}/stats?range=${range}`);
    return res.json();
}

async function fetchDaily(range = 14) {
    if (IS_PRODUCTION) {
        // range에 맞게 최근 N일 데이터 반환
        return STATIC_DATA.daily.slice(-range);
    }
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
 * 날짜 범위로 데이터 필터링 (startDate, endDate: 'YYYY-MM-DD' 형식)
 */
function filterDailyByDateRange(startDate, endDate) {
    return STATIC_DATA.daily.filter(d => d.date >= startDate && d.date <= endDate);
}

function calculateStatsFromDaily(daily) {
    const stats = {
        impressions: daily.reduce((s, d) => s + d.impressions, 0),
        clicks: daily.reduce((s, d) => s + d.clicks, 0),
        cost: daily.reduce((s, d) => s + d.cost, 0),
        conversions: daily.reduce((s, d) => s + d.conversions, 0),
        revenue: daily.reduce((s, d) => s + d.revenue, 0)
    };
    stats.ctr = stats.impressions > 0 ? (stats.clicks / stats.impressions * 100) : 0;
    stats.roas = stats.cost > 0 ? (stats.revenue / stats.cost * 100) : 0;
    return stats;
}

/**
 * 날짜 범위로 캠페인 데이터 집계 (startDate, endDate: 'YYYY-MM-DD' 형식)
 */
function aggregateCampaignsByDateRange(startDate, endDate) {
    const filtered = STATIC_DATA.dailyCampaign.filter(d => d.date >= startDate && d.date <= endDate);
    const campaignMap = {};

    filtered.forEach(d => {
        if (!campaignMap[d.name]) {
            campaignMap[d.name] = { name: d.name, impressions: 0, clicks: 0, cost: 0, conversions: 0 };
        }
        campaignMap[d.name].impressions += d.impressions;
        campaignMap[d.name].clicks += d.clicks;
        campaignMap[d.name].cost += d.cost;
        campaignMap[d.name].conversions += d.conversions;
    });

    return Object.values(campaignMap).sort((a, b) => b.cost - a.cost);
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
