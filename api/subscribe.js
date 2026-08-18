import { getRedis } from './_redis.js';
import { Resend } from 'resend';

// Removed top-level resend init

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
    const { email, userId, topics } = req.body || {};

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: '이메일을 입력해 주세요.' });
    }

    const redis = getRedis();
    if (!redis) {
      return res.status(500).json({ success: false, error: 'Redis connection missing' });
    }

    // 1. Store subscriber
    const now = new Date().toISOString();
    const subRecord = {
      email,
      userId: userId || null,
      topics: topics || [],
      createdAt: now
    };
    
    // Check if already subscribed (optional logic, skipping for brevity, we push anyway)
    await redis.lpush('subscribers:list', JSON.stringify(subRecord));
    console.log(`[Upstash Redis] New subscriber: ${email}`);

    // 2. Fetch the latest 10 articles
    let articles = [];
    try {
      const dataStr = await redis.get('newsletters:data');
      if (dataStr) {
        articles = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
        if (articles.value) {
          articles = JSON.parse(articles.value);
        }
      }
    } catch (e) {
      console.error('Failed to fetch articles from Redis:', e);
    }

    const latestArticles = articles.slice(0, 10);

    // 3. Build HTML for Welcome Email
    let articlesHtml = latestArticles.map((article) => `
      <div style="margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #eaeaea;">
        <h3 style="margin: 0 0 8px 0; color: #111827; font-size: 18px;">${article.title}</h3>
        <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 13px;">
          <strong style="color: #4f46e5;">[${article.categoryName}]</strong> • ${article.date}
        </p>
        <p style="margin: 0 0 12px 0; color: #374151; line-height: 1.6; font-size: 15px;">
          ${article.summary}
        </p>
        ${article.content?.tldr ? `
        <div style="background-color: #f3f4f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 12px;">
          <p style="margin: 0; color: #1f2937; font-size: 14px; font-weight: 600;">💡 AI 3줄 핵심 요약</p>
          <p style="margin: 6px 0 0 0; color: #4b5563; font-size: 14px; line-height: 1.5;">${article.content.tldr}</p>
        </div>` : ''}
        <a href="https://daycare.silverruler.xyz/#issue=${article.id}" style="display: inline-block; color: #ef4444; font-weight: 600; text-decoration: none; font-size: 14px;">기사 원문 보기 →</a>
      </div>
    `).join('');

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #ef4444; margin: 0 0 10px 0; font-size: 24px;">11 DayCare Letter</h1>
          <p style="color: #6b7280; margin: 0; font-size: 16px;">구독을 환영합니다! 🎉</p>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-bottom: 30px;">
          안녕하세요! 매일 아침 8시, 가장 중요한 시니어 헬스케어 및 복지 뉴스를 요약해서 보내드릴게요.<br/>
          구독 기념으로 <strong>최근 주요 소식 10선</strong>을 모아봤습니다.
        </p>
        
        <div style="background: #ffffff; border-radius: 8px;">
          ${articlesHtml}
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eaeaea; font-size: 12px; color: #9ca3af; text-align: center; line-height: 1.5;">
          본 메일은 11 DayCare Letter 구독자에게 발송됩니다.<br/>
          © 2026 11 DayCare Letter. All rights reserved.
        </div>
      </div>
    `;

    // Initialize Resend inside the handler to prevent top-level crashes if env var is missing during build
    const resend = new Resend(process.env.RESEND_API_KEY);

    // 4. Send Email via Resend
    const { data, error } = await resend.emails.send({
      from: '11 DayCare Letter <newsletter@daycare.silverruler.xyz>',
      to: email,
      subject: '[11 DayCare Letter] 구독을 환영합니다! 최근 주요 소식 10선 💌',
      html: htmlContent,
    });

    if (error) {
      console.error('[Resend Error]', error);
      // We still return success:true so the UI shows success, even if email fails (e.g. unverified domain)
      return res.status(200).json({ success: true, message: '구독은 완료되었으나, 이메일 발송에 실패했습니다.', resendError: error });
    }

    return res.status(201).json({ success: true, message: '구독 완료 및 웰컴 이메일 발송 완료', data });
  } catch (err) {
    console.error('[Subscribe API Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
