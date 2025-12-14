/**
 * Main Application Entry Point (API 연동 버전)
 */

(function () {
    'use strict';

    let currentRange = 14;
    let currentData = null;
    let trendMetrics = ['impressions', 'clicks'];
    let campaignMetric = 'cost';
    let datePickerInstance = null;
    let customDateRange = null; // { start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }

    /**
     * KPI 카드 업데이트
     */
    function updateKPICards(data) {
        const kpi = data.kpi;

        document.getElementById('kpiImpressions').textContent = DataUtils.formatNumber(kpi.impressions.value);
        updateChangeElement('kpiImpressionsChange', kpi.impressions.change);

        document.getElementById('kpiClicks').textContent = DataUtils.formatNumber(kpi.clicks.value);
        updateChangeElement('kpiClicksChange', kpi.clicks.change);

        document.getElementById('kpiCtr').textContent = DataUtils.formatPercent(kpi.ctr.value);
        updateChangeElement('kpiCtrChange', kpi.ctr.change);

        document.getElementById('kpiCost').textContent = DataUtils.formatCurrency(kpi.cost.value);
        updateChangeElement('kpiCostChange', kpi.cost.change, true);

        // CPA 표시 (비용/전환수) - 낮을수록 좋음
        const cpaValue = kpi.cpa?.value || 0;
        document.getElementById('kpiCpa').textContent = DataUtils.formatCurrency(cpaValue);
        updateChangeElement('kpiCpaChange', kpi.cpa?.change || '0', true);
    }

    function updateChangeElement(id, change, invertColor = false) {
        const el = document.getElementById(id);
        if (!el) return;

        const isPositive = parseFloat(change) >= 0;
        const displayPositive = invertColor ? !isPositive : isPositive;

        el.textContent = (isPositive ? '+' : '') + change + '%';
        el.className = 'kpi-card__change ' + (displayPositive ? 'positive' : 'negative');
    }

    function updateDatePickerDisplay(data) {
        const daily = data.daily;
        if (!daily || daily.length === 0) return;

        const startDate = daily[0].date;
        const endDate = daily[daily.length - 1].date;

        // flatpickr 인스턴스 날짜 업데이트
        if (datePickerInstance) {
            datePickerInstance.setDate([startDate, endDate], false);
        }
    }

    /**
     * 커스텀 날짜 범위로 데이터 로드
     */
    async function loadDataByDateRange(startDate, endDate) {
        try {
            const daily = filterDailyByDateRange(startDate, endDate);
            const stats = calculateStatsFromDaily(daily);
            const prevRatio = 0.9;

            currentData = {
                current: {
                    impressions: stats.impressions,
                    clicks: stats.clicks,
                    cost: stats.cost,
                    conversions: stats.conversions,
                    revenue: stats.revenue
                },
                previous: {
                    impressions: Math.round(stats.impressions * prevRatio),
                    clicks: Math.round(stats.clicks * prevRatio),
                    cost: Math.round(stats.cost * prevRatio),
                    conversions: Math.round(stats.conversions * prevRatio),
                    revenue: Math.round(stats.revenue * prevRatio)
                },
                daily: daily.map(d => ({
                    date: d.date.slice(5).replace('-', '/'),
                    impressions: d.impressions,
                    clicks: d.clicks,
                    cost: d.cost,
                    conversions: d.conversions,
                    revenue: d.revenue
                })),
                channels: STATIC_DATA.channels,
                campaigns: STATIC_DATA.campaigns,
                kpi: {
                    impressions: { value: stats.impressions, change: '10.0' },
                    clicks: { value: stats.clicks, change: '10.0' },
                    ctr: { value: stats.ctr, change: '0.5' },
                    cost: { value: stats.cost, change: '10.0' },
                    cpa: { value: stats.conversions > 0 ? (stats.cost / stats.conversions) : 0, change: '-5.2' }
                }
            };

            updateKPICards(currentData);
            updateAllCharts(currentData, { trendMetrics, campaignMetric });
        } catch (error) {
            console.error('날짜 범위 데이터 로드 실패:', error);
        }
    }

    /**
     * 대시보드 초기화 (비동기)
     */
    async function initDashboard() {
        try {
            currentData = await getAggregatedData(currentRange);
            updateKPICards(currentData);
            updateDatePickerDisplay(currentData);
            updateAllCharts(currentData, { trendMetrics, campaignMetric });
        } catch (error) {
            console.error('대시보드 초기화 실패:', error);
            alert('서버 연결 실패. 서버가 실행 중인지 확인하세요.\n(node server.js)');
        }
    }

    /**
     * 데이터 새로고침 (비동기)
     */
    async function refreshData() {
        try {
            customDateRange = null; // 프리셋 버튼 클릭 시 커스텀 범위 초기화
            currentData = await getAggregatedData(currentRange);
            updateKPICards(currentData);
            updateDatePickerDisplay(currentData);
            updateAllCharts(currentData, { trendMetrics, campaignMetric });
        } catch (error) {
            console.error('데이터 새로고침 실패:', error);
        }
    }

    /**
     * flatpickr 날짜 선택기 초기화
     */
    function initDatePicker() {
        const input = document.getElementById('dateRangePicker');
        if (!input || typeof flatpickr === 'undefined') return;

        datePickerInstance = flatpickr(input, {
            mode: 'range',
            dateFormat: 'Y.m.d',
            locale: 'ko',
            maxDate: '2025-05-31',
            minDate: '2025-05-01',
            defaultDate: ['2025-05-18', '2025-05-31'],
            onChange: function (selectedDates, dateStr) {
                if (selectedDates.length === 2) {
                    const start = selectedDates[0].toISOString().slice(0, 10);
                    const end = selectedDates[1].toISOString().slice(0, 10);

                    // 프리셋 버튼 비활성화
                    document.querySelectorAll('.date-filter__btn').forEach(b => b.classList.remove('active'));

                    customDateRange = { start, end };
                    loadDataByDateRange(start, end);
                }
            }
        });
    }

    /**
     * 이벤트 리스너 설정
     */
    function setupEventListeners() {
        // 기간 필터 버튼
        document.querySelectorAll('.date-filter__btn').forEach(btn => {
            btn.addEventListener('click', async function () {
                document.querySelectorAll('.date-filter__btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentRange = parseInt(this.dataset.range);
                await refreshData();
            });
        });

        // 추이 차트 범례 버튼
        document.querySelectorAll('#trendLegend .legend-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                this.classList.toggle('active');
                trendMetrics = Array.from(document.querySelectorAll('#trendLegend .legend-btn.active'))
                    .map(b => b.dataset.metric);
                if (trendMetrics.length === 0) {
                    this.classList.add('active');
                    trendMetrics = [this.dataset.metric];
                }
                createTrendChart('trendChart', currentData, trendMetrics);
            });
        });

        // 캠페인 차트 메트릭 선택
        document.getElementById('campaignMetric')?.addEventListener('change', function () {
            campaignMetric = this.value;
            createCampaignChart('campaignChart', currentData, campaignMetric);
        });
    }

    // DOM 로드 완료 시 초기화
    document.addEventListener('DOMContentLoaded', function () {
        initDashboard();
        setupEventListeners();
        initDatePicker();
    });
})();

