import { getRedis } from './_redis.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const redis = getRedis();
  if (!redis) {
    return res.status(500).json({ success: false, error: 'Redis connection failed' });
  }

  // Get IP
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || '';

  // Exclude Vercel bot and other common bots
  const isBot = /vercel|bot|spider|crawler/i.test(userAgent);

  // KST time for "today"
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const today = kst.toISOString().split('T')[0];

  const todayKey = `visitors:today:${today}`;
  const totalKey = `visitors:total`;

  if (req.method === 'POST' || req.method === 'GET') {
    try {
      if (req.method === 'POST' && !isBot && ip !== 'unknown') {
        const added = await redis.sadd(todayKey, ip);
        if (added) {
          await redis.incr(totalKey);
          await redis.expire(todayKey, 48 * 3600);
        }
      }

      const [todayCount, totalCount] = await Promise.all([
        redis.scard(todayKey),
        redis.get(totalKey)
      ]);

      return res.status(200).json({ 
        success: true, 
        today: todayCount || 0, 
        total: totalCount || 0,
        isBot
      });
    } catch (err) {
      console.error('[Visitors Error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
