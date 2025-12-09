/**
 * Express + SQLite Server for Ad Report Dashboard
 * CSV 파일에서 데이터 로드
 */

const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'dashboard.db');
const DATA_DIR = path.join(__dirname, 'data');

let db = null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

/**
 * CSV 파싱 헬퍼
 */
function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((h, i) => {
            const val = values[i];
            // 숫자 변환 시도
            obj[h.trim()] = isNaN(val) ? val : parseFloat(val);
        });
        return obj;
    });
}

/**
 * DB 초기화 - CSV에서 로드
 */
async function initDatabase() {
    const SQL = await initSqlJs();

    // CSV 파일 존재 확인
    const dailyCSV = path.join(DATA_DIR, 'daily_summary.csv');
    const channelCSV = path.join(DATA_DIR, 'channel_summary.csv');
    const campaignCSV = path.join(DATA_DIR, 'campaign_summary.csv');

    if (!fs.existsSync(dailyCSV)) {
        console.error('❌ CSV 파일이 없습니다. python aggregate_data.py 를 먼저 실행하세요.');
        process.exit(1);
    }

    // 항상 새 DB 생성 (CSV가 최신 소스)
    db = new SQL.Database();
    createTables();
    loadFromCSV(dailyCSV, channelCSV, campaignCSV);
    saveDatabase();
    console.log('✅ CSV에서 DB 로드 완료');
}

function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS daily_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            impressions REAL DEFAULT 0,
            clicks REAL DEFAULT 0,
            cost REAL DEFAULT 0,
            conversions REAL DEFAULT 0,
            revenue REAL DEFAULT 0,
            app_installs REAL DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS channels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cost REAL DEFAULT 0,
            impressions REAL DEFAULT 0,
            clicks REAL DEFAULT 0,
            revenue REAL DEFAULT 0,
            conversions REAL DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cost REAL DEFAULT 0,
            clicks REAL DEFAULT 0,
            impressions REAL DEFAULT 0,
            conversions REAL DEFAULT 0,
            revenue REAL DEFAULT 0
        )
    `);
}

function loadFromCSV(dailyCSV, channelCSV, campaignCSV) {
    // 일별 데이터
    const dailyData = parseCSV(dailyCSV);
    const stmtDaily = db.prepare(`INSERT INTO daily_stats (date, impressions, clicks, cost, conversions, revenue, app_installs) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    dailyData.forEach(row => {
        stmtDaily.run([row.date, row.impressions, row.clicks, row.cost, row.conversions, row.revenue, row.app_installs || 0]);
    });
    stmtDaily.free();
    console.log(`   - daily_stats: ${dailyData.length} rows`);

    // 채널 데이터
    const channelData = parseCSV(channelCSV);
    const stmtChannel = db.prepare(`INSERT INTO channels (name, cost, impressions, clicks, revenue, conversions) VALUES (?, ?, ?, ?, ?, ?)`);
    channelData.forEach(row => {
        stmtChannel.run([row.name, row.cost, row.impressions, row.clicks, row.revenue, row.conversions]);
    });
    stmtChannel.free();
    console.log(`   - channels: ${channelData.length} rows`);

    // 캠페인 데이터
    const campaignData = parseCSV(campaignCSV);
    const stmtCampaign = db.prepare(`INSERT INTO campaigns (name, cost, clicks, impressions, conversions, revenue) VALUES (?, ?, ?, ?, ?, ?)`);
    campaignData.forEach(row => {
        stmtCampaign.run([row.name, row.cost, row.clicks, row.impressions || 0, row.conversions, row.revenue]);
    });
    stmtCampaign.free();
    console.log(`   - campaigns: ${campaignData.length} rows`);
}

function saveDatabase() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
}

// ==================== API 엔드포인트 ====================

// 집계 통계 (KPI)
app.get('/api/stats', (req, res) => {
    const range = parseInt(req.query.range) || 14;

    const stmt = db.prepare(`
        SELECT 
            SUM(impressions) as impressions,
            SUM(clicks) as clicks,
            SUM(cost) as cost,
            SUM(conversions) as conversions,
            SUM(revenue) as revenue
        FROM daily_stats 
        ORDER BY date DESC 
        LIMIT ?
    `);
    stmt.bind([range]);

    let result = {};
    if (stmt.step()) {
        result = stmt.getAsObject();
    }
    stmt.free();

    // CTR, ROAS 계산
    result.ctr = result.impressions > 0 ? (result.clicks / result.impressions * 100) : 0;
    result.roas = result.cost > 0 ? (result.revenue / result.cost * 100) : 0;

    res.json(result);
});

// 일별 추이
app.get('/api/daily', (req, res) => {
    const range = parseInt(req.query.range) || 14;

    const results = db.exec(`
        SELECT date, impressions, clicks, cost, conversions, revenue 
        FROM daily_stats 
        ORDER BY date DESC 
        LIMIT ${range}
    `);

    if (results.length === 0) {
        return res.json([]);
    }

    const columns = results[0].columns;
    const rows = results[0].values.map(row => {
        const obj = {};
        columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
    }).reverse();

    res.json(rows);
});

// 채널별 데이터
app.get('/api/channels', (req, res) => {
    const results = db.exec(`SELECT * FROM channels`);

    if (results.length === 0) {
        return res.json([]);
    }

    const columns = results[0].columns;
    const rows = results[0].values.map(row => {
        const obj = {};
        columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
    });

    res.json(rows);
});

// 캠페인별 데이터
app.get('/api/campaigns', (req, res) => {
    const results = db.exec(`SELECT * FROM campaigns`);

    if (results.length === 0) {
        return res.json([]);
    }

    const columns = results[0].columns;
    const rows = results[0].values.map(row => {
        const obj = {};
        columns.forEach((col, i) => obj[col] = row[i]);
        return obj;
    });

    res.json(rows);
});

// ==================== 서버 시작 ====================
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 서버 실행 중: http://localhost:${PORT}`);
        console.log(`📊 대시보드: http://localhost:${PORT}/index.html`);
        console.log(`\n📌 API 엔드포인트:`);
        console.log(`   GET /api/stats?range=14`);
        console.log(`   GET /api/daily?range=14`);
        console.log(`   GET /api/channels`);
        console.log(`   GET /api/campaigns\n`);
    });
}).catch(err => {
    console.error('DB 초기화 실패:', err);
    process.exit(1);
});
