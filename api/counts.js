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

  if (req.method === 'GET') {
    try {
      // Fetch all view and like increments
      const [views, likes] = await Promise.all([
        redis.hgetall('newsletters:views'),
        redis.hgetall('newsletters:likes')
      ]);
      
      return res.status(200).json({ success: true, counts: { views: views || {}, likes: likes || {} } });
    } catch (err) {
      console.error('[Counts GET Error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { issueId, field, delta } = req.body; // field: 'views' or 'likes'
      if (!issueId || !field || !delta) {
        return res.status(400).json({ success: false, error: 'Missing parameters' });
      }

      if (field !== 'views' && field !== 'likes') {
        return res.status(400).json({ success: false, error: 'Invalid field' });
      }

      const newValue = await redis.hincrby(`newsletters:${field}`, issueId, delta);
      return res.status(200).json({ success: true, issueId, field, newValue });
    } catch (err) {
      console.error('[Counts POST Error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
