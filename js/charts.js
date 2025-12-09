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

    const channels = data.channels;
    const totalCost = channels.reduce((s, c) => s + c.cost, 0);
    const centerEl = document.getElementById('channelCenter');
    if (centerEl) centerEl.querySelector('.doughnut-center__value').textContent = DataUtils.formatCurrency(totalCost);

    // 동적 색상 생성 (color 컬럼이 없을 경우)
    const dynamicColors = channels.map((_, i) => `hsl(${(i * 360 / channels.length + 220) % 360}, 70%, 55%)`);
    const bgColors = channels.map((c, i) => c.color || dynamicColors[i]);

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: channels.map(c => c.name), datasets: [{ data: channels.map(c => c.cost), backgroundColor: bgColors, borderColor: 'rgba(15,23,42,0.8)', borderWidth: 3, hoverOffset: 8 }] },
        options: {
            responsive: true, maintainAspectRatio: false, cutout: '70%',
            plugins: { legend: { position: 'right', labels: { padding: 16, usePointStyle: true } }, tooltip: { callbacks: { label: ctx => `${DataUtils.formatCurrency(ctx.raw)} (${((ctx.raw / totalCost) * 100).toFixed(1)}%)` } } }
        }
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

    const metrics = ['노출수', '클릭수', '전환수', '가입CPA'];
    const current = [data.current.impressions / 1e6, data.current.clicks / 1e3, data.current.conversions / 100, DataUtils.calculateCPA(data.current.cost, data.current.conversions) / 10000];
    const previous = [data.previous.impressions / 1e6, data.previous.clicks / 1e3, data.previous.conversions / 100, DataUtils.calculateCPA(data.previous.cost, data.previous.conversions) / 10000];

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: { labels: metrics, datasets: [{ label: '현재 기간', data: current, backgroundColor: CHART_COLORS.primary, borderRadius: 6 }, { label: '이전 기간', data: previous, backgroundColor: 'rgba(148,163,184,0.3)', borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'end' } }, scales: { x: { grid: { display: false } }, y: { grid: { color: 'rgba(148,163,184,0.08)' } } } }
    });
    return chartInstances[canvasId];
}

function updateAllCharts(data, options = {}) {
    createTrendChart('trendChart', data, options.trendMetrics || ['impressions', 'clicks']);
    createChannelChart('channelChart', data);
    createCampaignChart('campaignChart', data, options.campaignMetric || 'cost');
    createComparisonChart('comparisonChart', data);
}
