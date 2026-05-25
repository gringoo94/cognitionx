const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/telegram';

const MAX = {
  name: 200,
  email: 320,
  messenger: 200,
  message: 4000,
  source: 200,
  page: 500,
};

const clip = (v: unknown, max: number) =>
  String(v ?? '').slice(0, max);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const TELEGRAM_API_KEY = Deno.env.get('TELEGRAM_API_KEY');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');
    if (!LOVABLE_API_KEY || !TELEGRAM_API_KEY || !TELEGRAM_CHAT_ID) {
      console.error('Missing required env vars for notify-telegram');
      return new Response(JSON.stringify({ success: false, error: 'Notification failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const name = clip(body.name, MAX.name);
    const email = clip(body.email, MAX.email);
    const messenger = clip(body.messenger, MAX.messenger);
    const message = clip(body.message, MAX.message);
    const source = clip(body.source, MAX.source);
    const page = clip(body.page, MAX.page);

    const escape = (v: string) =>
      v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const text = [
      '📋 <b>Новая заявка</b>',
      '',
      `<b>Форма:</b> ${escape(source) || '—'}`,
      `<b>Страница:</b> ${escape(page) || '—'}`,
      `<b>Имя:</b> ${escape(name) || '—'}`,
      `<b>Email:</b> ${escape(email) || '—'}`,
      `<b>Мессенджер:</b> ${escape(messenger) || '—'}`,
      `<b>Запрос:</b> ${escape(message) || '—'}`,
    ].join('\n');

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': TELEGRAM_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: Number(TELEGRAM_CHAT_ID),
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const data = await response.text();
      console.error(`Telegram API failed [${response.status}]:`, data);
      return new Response(JSON.stringify({ success: false, error: 'Notification failed' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending Telegram notification:', error);
    return new Response(JSON.stringify({ success: false, error: 'Notification failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
