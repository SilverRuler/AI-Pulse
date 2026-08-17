import { getRedis } from './_redis.js';
import { newsletters as defaultNewsletters } from '../src/data/newsletters.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const redis = getRedis();

  // POST: 백엔드 크롤러가 새 뉴스레터 JSON 배열을 직접 푸시할 때 사용할 수 있는 엔드포인트
  if (req.method === 'POST') {
    try {
      const newItems = req.body;
      if (!Array.isArray(newItems)) {
        return res.status(400).json({ success: false, error: 'JSON 배열(Array) 형식이어야 합니다.' });
      }

      if (redis) {
        await redis.set('newsletters:data', JSON.stringify(newItems));
        console.log(`[Upstash Redis] Newsletters updated: ${newItems.length} items`);
      }

      return res.status(200).json({ success: true, count: newItems.length, message: '뉴스레터가 성공적으로 업데이트되었습니다.' });
    } catch (err) {
      console.error('[Newsletters Update Error]', err);
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // GET: 프론트엔드 웹사이트가 최신 뉴스레터 목록을 조회할 때
  try {
    if (redis) {
      const dataRaw = await redis.get('newsletters:data');
      if (dataRaw) {
        let items = null;
        try {
          items = typeof dataRaw === 'string' ? JSON.parse(dataRaw) : dataRaw;
        } catch (e) {
          items = dataRaw;
        }

        if (Array.isArray(items) && items.length > 0) {
          return res.status(200).json({ success: true, source: 'redis', newsletters: items });
        }
      }
    }

    // Redis에 아직 데이터가 없으면 기본 샘플 반환
    return res.status(200).json({ success: true, source: 'default', newsletters: defaultNewsletters });
  } catch (err) {
    console.error('[Newsletters Fetch Error]', err);
    return res.status(200).json({ success: true, source: 'fallback', newsletters: defaultNewsletters });
  }
}
