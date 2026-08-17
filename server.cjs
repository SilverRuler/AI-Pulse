const http = require('http');
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const PORT = 80;
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize SQLite Database
const DB_PATH = path.join(DATA_DIR, 'database.sqlite');
const db = new DatabaseSync(DB_PATH);

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    pw TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    sido TEXT,
    sigungu TEXT,
    dong TEXT,
    has_care_grade TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    user_id TEXT,
    topics TEXT,
    created_at TEXT NOT NULL
  );
`);

// Insert Admin account from ENV or defaults
const ADMIN_ID = process.env.ADMIN_ID || 'sr';
const ADMIN_PW = process.env.ADMIN_PW || 'dmswk123';

const adminCheck = db.prepare("SELECT id FROM users WHERE id = ?").get(ADMIN_ID);
if (!adminCheck) {
  const insertAdmin = db.prepare(`
    INSERT INTO users (id, pw, phone, address, sido, sigungu, dong, has_care_grade, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertAdmin.run(ADMIN_ID, ADMIN_PW, '010-0000-0000', '경기도 시흥시 정왕동', '경기도', '시흥시', '정왕동', '관리자', new Date().toISOString());
  console.log(`[SQLite] Admin account (${ADMIN_ID}) initialized.`);
}

console.log(`[SQLite] Database initialized at: ${DB_PATH}`);

// Helper to parse JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', err => reject(err));
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.webmanifest': 'application/manifest+json'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ================= API ROUTES (SQLite Backend) =================
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');

    try {
      // 1. 회원가입 API (POST /api/auth/signup)
      if (pathname === '/api/auth/signup' && req.method === 'POST') {
        const data = await parseJsonBody(req);
        const { id, pw, phone, address, sido, sigungu, dong, hasCareGrade } = data;

        if (!id || !pw || !phone || !address) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: '모든 필수 항목을 입력해 주세요.' }));
          return;
        }

        // Check if user already exists
        const checkStmt = db.prepare('SELECT id FROM users WHERE id = ?');
        const existing = checkStmt.get(id);
        if (existing) {
          res.writeHead(409);
          res.end(JSON.stringify({ success: false, error: '이미 존재하는 아이디입니다.' }));
          return;
        }

        // Insert into SQLite
        const insertStmt = db.prepare(`
          INSERT INTO users (id, pw, phone, address, sido, sigungu, dong, has_care_grade, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const now = new Date().toISOString();
        insertStmt.run(id, pw, phone, address, sido || '', sigungu || '', dong || '', hasCareGrade || '예 (등급 있음)', now);

        console.log(`[SQLite] New user registered: ${id} (${address})`);
        res.writeHead(201);
        res.end(JSON.stringify({
          success: true,
          user: { id, phone, address, sido, sigungu, dong, hasCareGrade, createdAt: now }
        }));
        return;
      }

      // 2. 로그인 API (POST /api/auth/login)
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const data = await parseJsonBody(req);
        const { id, pw } = data;

        const selectStmt = db.prepare('SELECT * FROM users WHERE id = ? AND pw = ?');
        const user = selectStmt.get(id, pw);

        if (!user) {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' }));
          return;
        }

        console.log(`[SQLite] User logged in: ${id}`);
        res.writeHead(200);
        res.end(JSON.stringify({
          success: true,
          user: {
            id: user.id,
            phone: user.phone,
            address: user.address,
            sido: user.sido,
            sigungu: user.sigungu,
            dong: user.dong,
            hasCareGrade: user.has_care_grade,
            createdAt: user.created_at
          }
        }));
        return;
      }

      // 3. 뉴스레터 구독 신청 API (POST /api/subscribe)
      if (pathname === '/api/subscribe' && req.method === 'POST') {
        const data = await parseJsonBody(req);
        const { email, userId, topics } = data;

        if (!email) {
          res.writeHead(400);
          res.end(JSON.stringify({ success: false, error: '이메일을 입력해 주세요.' }));
          return;
        }

        const insertStmt = db.prepare(`
          INSERT INTO subscriptions (email, user_id, topics, created_at)
          VALUES (?, ?, ?, ?)
        `);

        const now = new Date().toISOString();
        insertStmt.run(email, userId || null, JSON.stringify(topics || []), now);

        console.log(`[SQLite] New subscriber: ${email} (User: ${userId || 'guest'})`);
        res.writeHead(201);
        res.end(JSON.stringify({ success: true, message: '구독 신청 완료' }));
        return;
      }

      // 4. 운영자용 회원 목록 조회 (GET /api/admin/users)
      if (pathname === '/api/admin/users' && req.method === 'GET') {
        const selectStmt = db.prepare('SELECT id, phone, address, sido, sigungu, dong, has_care_grade, created_at FROM users ORDER BY created_at DESC');
        const users = selectStmt.all();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, count: users.length, users }));
        return;
      }

      // 5. 운영자용 구독자 목록 조회 (GET /api/admin/subscriptions)
      if (pathname === '/api/admin/subscriptions' && req.method === 'GET') {
        const selectStmt = db.prepare('SELECT * FROM subscriptions ORDER BY created_at DESC');
        const subscriptions = selectStmt.all();
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, count: subscriptions.length, subscriptions }));
        return;
      }

      // 404 for unknown API
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'API route not found' }));
      return;
    } catch (apiErr) {
      console.error('[API Error]', apiErr);
      res.writeHead(500);
      res.end(JSON.stringify({ success: false, error: apiErr.message }));
      return;
    }
  }

  // ================= STATIC SPA SERVING =================
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      // SPA Fallback to index.html
      const indexPath = path.join(DIST_DIR, 'index.html');
      fs.readFile(indexPath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(data);
        }
      });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`11 DayCare Letter server running at http://0.0.0.0:${PORT}/`);
});
