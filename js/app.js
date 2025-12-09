/**
 * Main Application Entry Point (API 연동 버전)
 */

(function () {
    'use strict';

    let currentRange = 14;
    let currentData = null;
    let trendMetrics = ['impressions', 'clicks'];
    let campaignMetric = 'cost';

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

        document.getElementById('kpiRoas').textContent = kpi.roas.value.toFixed(0) + '%';
        updateChangeElement('kpiRoasChange', kpi.roas.change);
    }

    function updateChangeElement(id, change, invertColor = false) {
        const el = document.getElementById(id);
        if (!el) return;

        const isPositive = parseFloat(change) >= 0;
        const displayPositive = invertColor ? !isPositive : isPositive;

        el.textContent = (isPositive ? '+' : '') + change + '%';
        el.className = 'kpi-card__change ' + (displayPositive ? 'positive' : 'negative');
    }

    function updateDatePeriod(days) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days + 1);

        const format = (d) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
        document.getElementById('datePeriod').textContent = `${format(start)} - ${format(end)}`;
    }

    /**
     * 대시보드 초기화 (비동기)
     */
    async function initDashboard() {
        try {
            currentData = await getAggregatedData(currentRange);
            updateKPICards(currentData);
            updateDatePeriod(currentRange);
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
            currentData = await getAggregatedData(currentRange);
            updateKPICards(currentData);
            updateDatePeriod(currentRange);
            updateAllCharts(currentData, { trendMetrics, campaignMetric });
        } catch (error) {
            console.error('데이터 새로고침 실패:', error);
        }
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
    });
})();
