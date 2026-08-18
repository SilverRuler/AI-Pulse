import { getRedis } from './_redis.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ success: false, error: '이메일을 입력해 주세요.' });

    const redis = getRedis();
    if (!redis) return res.status(500).json({ success: false, error: 'Redis connection missing' });

    // @upstash/redis already auto-parses JSON, so items are already objects (not strings)
    const existingList = await redis.lrange('subscribers:list', 0, -1);

    const getEmail = (item) => {
      if (!item) return null;
      // item may be an object (auto-parsed by @upstash/redis) or a string
      if (typeof item === 'object') return item.email || null;
      try { return JSON.parse(item).email; } catch { return null; }
    };

    const found = existingList.some(item => getEmail(item) === email);

    if (!found) {
      return res.status(200).json({ success: false, notFound: true, message: '구독 정보를 찾을 수 없습니다.' });
    }

    const filtered = existingList.filter(item => getEmail(item) !== email);

    // Replace list: delete then re-push as JSON strings
    await redis.del('subscribers:list');
    if (filtered.length > 0) {
      const serialized = filtered.map(item =>
        typeof item === 'string' ? item : JSON.stringify(item)
      );
      await redis.rpush('subscribers:list', ...serialized);
    }

    console.log(`[Upstash Redis] Unsubscribed: ${email}`);
    return res.status(200).json({ success: true, message: '구독이 성공적으로 취소되었습니다.' });
  } catch (err) {
    console.error('[Unsubscribe API Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
