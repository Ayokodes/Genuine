/**
 * Genuine Scholars — optional Telegram notification backend
 *
 * IMPORTANT: Keep TELEGRAM_BOT_TOKEN on the server. Never put it in browser JS.
 * This server sends a login notification to the owner's Telegram chat without
 * sending or storing the user's password.
 */
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20kb' }));
app.use(express.static(__dirname));

app.post('/api/auth-login', async (req, res) => {
  const { name, email, role } = req.body || {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ ok: false, message: 'Email is required.' });
  }

  // Never accept or forward a password to this endpoint.
  const safeName = String(name || 'Unknown user').slice(0, 100);
  const safeEmail = email.slice(0, 160);
  const safeRole = String(role || 'student').slice(0, 40);
  const time = new Date().toISOString();

  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    return res.json({ ok: true, delivered: false, message: 'Telegram is not configured.' });
  }

  const message = [
    '🔔 <b>Genuine Scholars Login</b>',
    '',
    `<b>Name:</b> ${escapeHtml(safeName)}`,
    `<b>Email:</b> ${escapeHtml(safeEmail)}`,
    `<b>Role:</b> ${escapeHtml(safeRole)}`,
    `<b>Time:</b> ${escapeHtml(time)}`,
  ].join('\n');

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );

    const result = await telegramResponse.json();
    if (!telegramResponse.ok || !result.ok) {
      console.error('Telegram notification failed:', result);
      return res.status(502).json({ ok: false, message: 'Telegram notification failed.' });
    }

    return res.json({ ok: true, delivered: true });
  } catch (error) {
    console.error('Telegram request failed:', error);
    return res.status(502).json({ ok: false, message: 'Notification service unavailable.' });
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true, site: 'Genuine Scholars' }));

app.listen(PORT, () => {
  console.log(`Genuine Scholars running at http://localhost:${PORT}`);
});

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[ch]));
}
