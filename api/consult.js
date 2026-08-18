import { Resend } from 'resend';

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
    const { userId, userPhone, applicantName, replyEmail } = req.body || {};

    if (!applicantName || !replyEmail) {
      return res.status(400).json({ success: false, error: '이름과 이메일을 모두 입력해 주세요.' });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
        <h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; margin-bottom: 20px;">
          새로운 무료 등급 신청 상담 요청
        </h2>
        <p style="font-size: 16px; margin-bottom: 15px;">
          안녕하세요 원장님, 11 DayCare Letter 웹사이트에서 새로운 무료 등급 신청 상담 요청이 접수되었습니다.
        </p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px;">
          <ul style="list-style: none; padding: 0; margin: 0; font-size: 15px; line-height: 1.8;">
            <li><strong>신청자 아이디:</strong> ${userId || '알 수 없음'}</li>
            <li><strong>신청자 연락처:</strong> ${userPhone || '알 수 없음'}</li>
            <li><strong>신청자 이름:</strong> ${applicantName}</li>
            <li><strong>회신받을 이메일:</strong> ${replyEmail}</li>
          </ul>
        </div>
        <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
          ※ 본 메일은 시스템에서 자동으로 발송되었습니다.
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: '11 DayCare Letter <newsletter@daycare.silverruler.xyz>',
      to: 'hanksoft@daum.net',
      subject: `[11 DayCare Letter] 새로운 상담 요청이 접수되었습니다 - ${applicantName}님`,
      html: htmlContent,
    });

    if (error) {
      console.error('[Resend Error]', error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true, message: '상담 요청이 성공적으로 발송되었습니다.', data });
  } catch (err) {
    console.error('[Consult API Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
