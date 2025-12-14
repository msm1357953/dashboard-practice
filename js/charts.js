/**
 * Chart.js Configuration & Creation
 */

Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#94A3B8';
Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.1)';

const CHART_COLORS = {
    primary: '#F97316',
    secondary: '#FB923C',
    tertiary: '#FBBF24',
    quaternary: '#14B8A6',
    quinary: '#EF4444'
};

const chartInstances = {};

function createGradient(ctx, c1, c2) {
    const g = ctx.createLinearGradient(0, 0, 0, 300);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    return g;
}

function createTrendChart(canvasId, data, visibleMetrics = ['impressions', 'clicks']) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

    const labels = data.daily.map(d => d.date);
    const datasets = [];

    if (visibleMetrics.includes('impressions')) {
        datasets.push({
            label: '노출수', data: data.daily.map(d => d.impressions),
            borderColor: CHART_COLORS.primary,
            backgroundColor: createGradient(ctx.getContext('2d'), 'rgba(99,102,241,0.5)', 'rgba(99,102,241,0.05)'),
            borderWidth: 3, fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y'
        });
    }
    if (visibleMetrics.includes('clicks')) {
        datasets.push({
            label: '클릭수', data: data.daily.map(d => d.clicks),
            borderColor: CHART_COLORS.secondary,
            backgroundColor: createGradient(ctx.getContext('2d'), 'rgba(139,92,246,0.5)', 'rgba(139,92,246,0.05)'),
            borderWidth: 3, fill: true, tension: 0.4, pointRadius: 0, pointHoverRadius: 6, yAxisID: 'y1'
        });
    }
    if (visibleMetrics.includes('cost')) {
        datasets.push({
            label: '비용', data: data.daily.map(d => d.cost),
            borderColor: CHART_COLORS.quinary, backgroundColor: 'transparent',
            borderWidth: 3, borderDash: [5, 5], fill: false, tension: 0.4, pointRadius: 0, yAxisID: 'y2'
        });
    }

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'line', data: { labels, datasets },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(15,23,42,0.95)', padding: 12, cornerRadius: 8 } },
            scales: {
                x: { grid: { display: false } },
                y: { display: visibleMetrics.includes('impressions'), position: 'left', grid: { color: 'rgba(148,163,184,0.08)' }, ticks: { callback: v => DataUtils.formatNumber(v) } },
                y1: { display: visibleMetrics.includes('clicks') && !visibleMetrics.includes('impressions'), position: 'left', grid: { drawOnChartArea: false } },
                y2: { display: visibleMetrics.includes('cost'), position: 'right', grid: { drawOnChartArea: false }, ticks: { callback: v => DataUtils.formatCurrency(v) } }
            }
        }
    });
    return chartInstances[canvasId];
}

function createChannelChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

    // 비용 기준 정렬 (전체 매체 표시)
    const displayChannels = [...data.channels].sort((a, b) => b.cost - a.cost);

    // 현재 기간의 총 비용 사용 (날짜 필터 반영)
    const totalCost = data.current?.cost || displayChannels.reduce((s, c) => s + c.cost, 0);
    const centerText = DataUtils.formatCurrency(totalCost);

    // 고정 색상 팔레트 (10개)
    const fixedColors = ['#F97316', '#FB923C', '#FBBF24', '#14B8A6', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#06B6D4', '#94A3B8'];
    const bgColors = displayChannels.map((_, i) => fixedColors[i % fixedColors.length]);

    // 중앙 텍스트 플러그인
    const centerTextPlugin = {
        id: 'centerText',
        afterDraw: function (chart) {
            const { ctx, chartArea } = chart;
            const centerX = (chartArea.left + chartArea.right) / 2;
            const centerY = (chartArea.top + chartArea.bottom) / 2;

            ctx.save();
            // 비용 값
            ctx.font = 'bold 1.5rem Inter, sans-serif';
            ctx.fillStyle = '#F8FAFC';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(centerText, centerX, centerY - 10);
            // 라벨
            ctx.font = '0.75rem Inter, sans-serif';
            ctx.fillStyle = '#94A3B8';
            ctx.fillText('총 비용', centerX, centerY + 15);
            ctx.restore();
        }
    };

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: displayChannels.map(c => c.name), datasets: [{ data: displayChannels.map(c => c.cost), backgroundColor: bgColors, borderColor: 'rgba(15,23,42,0.8)', borderWidth: 3, hoverOffset: 8 }] },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: {
                legend: { position: 'right', labels: { padding: 12, usePointStyle: true, color: '#94A3B8', font: { size: 11 } } },
                tooltip: { callbacks: { label: ctx => `${DataUtils.formatCurrency(ctx.raw)} (${((ctx.raw / totalCost) * 100).toFixed(1)}%)` } }
            }
        },
        plugins: [centerTextPlugin]
    });
    return chartInstances[canvasId];
}

function createCampaignChart(canvasId, data, metric = 'cost') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

    const campaigns = data.campaigns;
    const barColors = campaigns.map((_, i) => `hsl(${240 + i * 20}, 70%, 60%)`);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: { labels: campaigns.map(c => c.name), datasets: [{ data: campaigns.map(c => c[metric]), backgroundColor: barColors, borderRadius: 6, barThickness: 24 }] },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => metric === 'cost' ? DataUtils.formatCurrency(ctx.raw) : DataUtils.formatNumber(ctx.raw) } } },
            scales: { x: { grid: { color: 'rgba(148,163,184,0.08)' }, ticks: { callback: v => metric === 'cost' ? DataUtils.formatCurrency(v) : DataUtils.formatNumber(v) } }, y: { grid: { display: false } } }
        }
    });
    return chartInstances[canvasId];
}

function createComparisonChart(canvasId, data) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    if (chartInstances[canvasId]) chartInstances[canvasId].destroy();

    // 원본 값 저장 (툴팁용)
    const rawCurrent = {
        impressions: data.current.impressions,
        clicks: data.current.clicks,
        conversions: data.current.conversions,
        cpa: DataUtils.calculateCPA(data.current.cost, data.current.conversions)
    };
    const rawPrevious = {
        impressions: data.previous.impressions,
        clicks: data.previous.clicks,
        conversions: data.previous.conversions,
        cpa: DataUtils.calculateCPA(data.previous.cost, data.previous.conversions)
    };

    // 정규화: 각 지표의 현재값을 100%로 설정
    const metrics = ['노출수', '클릭수', '전환수', '가입CPA'];
    const metricKeys = ['impressions', 'clicks', 'conversions', 'cpa'];

    const current = metricKeys.map(k => 100); // 현재 = 100%
    const previous = metricKeys.map(k => {
        const curr = rawCurrent[k] || 1;
        const prev = rawPrevious[k] || 0;
        return (prev / curr) * 100;
    });

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: metrics,
            datasets: [
                { label: '현재 기간', data: current, backgroundColor: CHART_COLORS.primary, borderRadius: 6 },
                { label: '이전 기간', data: previous, backgroundColor: 'rgba(148,163,184,0.3)', borderRadius: 6 }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', align: 'end' },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const idx = context.dataIndex;
                            const key = metricKeys[idx];
                            const val = context.datasetIndex === 0 ? rawCurrent[key] : rawPrevious[key];
                            if (key === 'cpa') return `${context.dataset.label}: ${DataUtils.formatCurrency(val)}`;
                            return `${context.dataset.label}: ${DataUtils.formatNumber(val)}`;
                        }
                    }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    grid: { color: 'rgba(148,163,184,0.08)' },
                    ticks: { callback: v => v + '%' },
                    max: 120
                }
            }
        }
    });
    return chartInstances[canvasId];
}

function updateAllCharts(data, options = {}) {
    createTrendChart('trendChart', data, options.trendMetrics || ['impressions', 'clicks']);
    createChannelChart('channelChart', data);
    createCampaignChart('campaignChart', data, options.campaignMetric || 'cost');
    createComparisonChart('comparisonChart', data);
}
