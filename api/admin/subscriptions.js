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
      return res.status(200).json({ success: true, count: 0, subscriptions: [] });
    }

    const rawList = await redis.lrange('subscribers:list', 0, 100);
    const subscriptions = (rawList || []).map((item, idx) => {
      let sub = null;
      try { sub = typeof item === 'string' ? JSON.parse(item) : item; } catch (e) { sub = item; }
      return {
        id: idx + 1,
        email: sub?.email,
        user_id: sub?.userId,
        topics: Array.isArray(sub?.topics) ? sub.topics.join(', ') : sub?.topics,
        created_at: sub?.createdAt
      };
    });

    return res.status(200).json({ success: true, count: subscriptions.length, subscriptions });
  } catch (err) {
    console.error('[Admin Subscriptions Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
