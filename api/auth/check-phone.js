import { getRedis } from '../_redis.js';

export default async function handler(req, res) {
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
    const { phone } = req.body || {};

    if (!phone) {
      return res.status(400).json({ success: false, error: '휴대폰 번호를 입력해 주세요.' });
    }

    const redis = getRedis();
    if (!redis) {
       return res.status(500).json({ success: false, error: 'DB 연결 오류' });
    }

    // Get all user IDs
    const userIds = await redis.smembers('users:list');
    if (!userIds || userIds.length === 0) {
      return res.status(200).json({ success: true, isDuplicate: false });
    }

    // Fetch all users to check phone numbers
    // Note: Upstash mget takes an array of keys
    const keys = userIds.map(id => `user:${id}`);
    const users = await redis.mget(...keys);

    const isDuplicate = users.some(user => {
      if (!user) return false;
      const userObj = typeof user === 'string' ? JSON.parse(user) : user;
      return userObj.phone === phone;
    });

    return res.status(200).json({ success: true, isDuplicate });
  } catch (err) {
    console.error('[Check Phone Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
