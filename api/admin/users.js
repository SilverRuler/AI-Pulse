import { getRedis } from '../_redis.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const redis = getRedis();
    if (!redis) {
      return res.status(200).json({ success: true, count: 0, users: [] });
    }

    // Get all user IDs from Set
    const userIds = await redis.smembers('users:list');
    if (!userIds || userIds.length === 0) {
      return res.status(200).json({ success: true, count: 0, users: [] });
    }

    // Fetch details for each user
    const users = [];
    for (const uid of userIds) {
      const uRaw = await redis.get(`user:${uid}`);
      if (uRaw) {
        let u = null;
        try { u = typeof uRaw === 'string' ? JSON.parse(uRaw) : uRaw; } catch (e) { u = uRaw; }
        if (u) {
          users.push({
            id: u.id,
            phone: u.phone,
            address: u.address,
            sido: u.sido,
            sigungu: u.sigungu,
            dong: u.dong,
            has_care_grade: u.hasCareGrade,
            created_at: u.createdAt
          });
        }
      }
    }

    return res.status(200).json({ success: true, count: users.length, users });
  } catch (err) {
    console.error('[Admin Users Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
