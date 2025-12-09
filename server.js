/**
 * Express + SQLite Server for Ad Report Dashboard
 */

const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, 'data', 'dashboard.db');

let db = null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

/**
 * DB 초기화 및 샘플 데이터 삽입
 */
async function initDatabase() {
    const SQL = await initSqlJs();

    // 기존 DB 파일 로드 또는 새로 생성
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    if (fs.existsSync(DB_PATH)) {
        const buffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(buffer);
        console.log('기존 DB 로드됨');
    } else {
        db = new SQL.Database();
        createTables();
        insertSampleData();
        saveDatabase();
        console.log('새 DB 생성 및 샘플 데이터 삽입 완료');
    }
}

function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS daily_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            impressions INTEGER DEFAULT 0,
            clicks INTEGER DEFAULT 0,
            cost INTEGER DEFAULT 0,
            conversions INTEGER DEFAULT 0,
            revenue INTEGER DEFAULT 0
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS channels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cost INTEGER DEFAULT 0,
            impressions INTEGER DEFAULT 0,
            clicks INTEGER DEFAULT 0,
            color TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cost INTEGER DEFAULT 0,
            clicks INTEGER DEFAULT 0,
            conversions INTEGER DEFAULT 0,
            roas INTEGER DEFAULT 0
        )
    `);
}

function insertSampleData() {
    // 일별 데이터 (30일)
    const dailyData = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const impressions = 200000 + Math.floor(Math.random() * 200000);
        const clicks = Math.floor(impressions * (0.03 + Math.random() * 0.02));
        const cost = 2500000 + Math.floor(Math.random() * 2500000);
        const conversions = Math.floor(clicks * (0.015 + Math.random() * 0.01));
        const revenue = conversions * (40000 + Math.floor(Math.random() * 40000));
        dailyData.push([dateStr, impressions, clicks, cost, conversions, revenue]);
    }

    const stmtDaily = db.prepare(`INSERT INTO daily_stats (date, impressions, clicks, cost, conversions, revenue) VALUES (?, ?, ?, ?, ?, ?)`);
    dailyData.forEach(row => stmtDaily.run(row));
    stmtDaily.free();

    // 채널 데이터
    const channels = [
        ['Google Ads', 22500000, 1850000, 58000, '#4285F4'],
        ['Meta Ads', 18200000, 1420000, 48000, '#1877F2'],
        ['Naver', 8500000, 680000, 22000, '#03C75A'],
        ['Kakao', 5200000, 420000, 14000, '#FEE500'],
        ['TikTok', 3980000, 310000, 10600, '#000000']
    ];

    const stmtChannel = db.prepare(`INSERT INTO channels (name, cost, impressions, clicks, color) VALUES (?, ?, ?, ?, ?)`);
    channels.forEach(row => stmtChannel.run(row));
    stmtChannel.free();

    // 캠페인 데이터
    const campaigns = [
        ['브랜드 인지도', 15200000, 42000, 580, 285],
        ['신규 고객 확보', 12800000, 38000, 720, 356],
        ['리타겟팅', 8500000, 28000, 890, 520],
        ['프로모션', 10200000, 32000, 450, 278],
        ['앱 설치', 6800000, 22000, 380, 245],
        ['시즌 캠페인', 4880000, 15600, 286, 312]
    ];

    const stmtCampaign = db.prepare(`INSERT INTO campaigns (name, cost, clicks, conversions, roas) VALUES (?, ?, ?, ?, ?)`);
    campaigns.forEach(row => stmtCampaign.run(row));
    stmtCampaign.free();
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
