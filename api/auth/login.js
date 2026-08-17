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
    const { id, pw } = req.body || {};

    if (!id || !pw) {
      return res.status(400).json({ success: false, error: '아이디와 비밀번호를 입력해 주세요.' });
    }

    const redis = getRedis();

    // Default admin fallback check
    const adminId = process.env.ADMIN_ID || 'sr';
    const adminPw = process.env.ADMIN_PW || 'dmswk123';

    if (id === adminId && pw === adminPw) {
      return res.status(200).json({
        success: true,
        user: {
          id: adminId,
          phone: '010-0000-0000',
          address: '경기도 시흥시 정왕동',
          hasCareGrade: '관리자',
          isAdmin: true
        }
      });
    }

    if (redis) {
      const userRaw = await redis.get(`user:${id}`);
      let user = null;

      if (typeof userRaw === 'string') {
        try { user = JSON.parse(userRaw); } catch (e) { user = userRaw; }
      } else {
        user = userRaw;
      }

      if (!user || user.pw !== pw) {
        return res.status(401).json({ success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }

      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          address: user.address,
          sido: user.sido,
          sigungu: user.sigungu,
          dong: user.dong,
          hasCareGrade: user.hasCareGrade,
          createdAt: user.createdAt
        }
      });
    }

    return res.status(401).json({ success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
  } catch (err) {
    console.error('[Redis Login Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
