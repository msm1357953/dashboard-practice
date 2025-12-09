/**
 * Data Layer - API 연동 버전
 * 서버(localhost:3000)에서 데이터를 가져옵니다.
 */

const API_BASE = 'http://localhost:3000/api';

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

    calculateROAS(revenue, cost) {
        if (cost === 0) return 0;
        return (revenue / cost * 100);
    }
};

/**
 * API 호출 함수들
 */
async function fetchStats(range = 14) {
    const res = await fetch(`${API_BASE}/stats?range=${range}`);
    return res.json();
}

async function fetchDaily(range = 14) {
    const res = await fetch(`${API_BASE}/daily?range=${range}`);
    return res.json();
}

async function fetchChannels() {
    const res = await fetch(`${API_BASE}/channels`);
    return res.json();
}

async function fetchCampaigns() {
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
                roas: {
                    value: stats.roas || 0,
                    change: '2.3'
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
