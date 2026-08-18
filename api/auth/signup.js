import { getRedis } from '../_redis.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { id, pw, phone, birthDate, address, sido, sigungu, dong, hasCareGrade } = req.body || {};

    if (!id || !pw || !phone || !address || !birthDate) {
      return res.status(400).json({ success: false, error: '모든 필수 항목을 입력해 주세요.' });
    }

    const redis = getRedis();
    const now = new Date().toISOString();
    const newUser = {
      id,
      pw,
      phone,
      birthDate,
      address,
      sido: sido || '',
      sigungu: sigungu || '',
      dong: dong || '',
      hasCareGrade: hasCareGrade || '예 (등급 있음)',
      createdAt: now
    };

    if (redis) {
      // Check if user already exists in Redis
      const existing = await redis.get(`user:${id}`);
      if (existing) {
        return res.status(409).json({ success: false, error: '이미 존재하는 아이디입니다.' });
      }

      // Save user to Redis
      await redis.set(`user:${id}`, JSON.stringify(newUser));
      await redis.sadd('users:list', id);
      console.log(`[Upstash Redis] User registered: ${id}`);
    }

    return res.status(201).json({
      success: true,
      user: {
        id,
        phone,
        birthDate,
        address,
        sido,
        sigungu,
        dong,
        hasCareGrade,
        createdAt: now
      }
    });
  } catch (err) {
    console.error('[Redis Signup Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
