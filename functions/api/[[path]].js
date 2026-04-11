export async function onRequest(context) {
  const SUPABASE_URL = 'https://wxgmicykqtgzzbsqgkef.supabase.co';

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const url = new URL(context.request.url);
    const supabasePath = url.pathname.replace(/^\/api/, '');
    const targetUrl = SUPABASE_URL + supabasePath + url.search;

    const newHeaders = new Headers();
    for (const [key, value] of context.request.headers.entries()) {
      if (!['host', 'origin', 'referer'].includes(key.toLowerCase())) {
        newHeaders.set(key, value);
      }
    }

    const fetchOptions = {
      method: context.request.method,
      headers: newHeaders,
    };

    if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
      fetchOptions.body = await context.request.arrayBuffer();
    }

    const response = await fetch(targetUrl, fetchOptions);
    const body = await response.arrayBuffer();

    return new Response(body, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
        ...corsHeaders,
      },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
