import dotenv from 'dotenv';
dotenv.config();

const url = (process.env.SUPABASE_URL || '').trim().replace(/\/$/, '');
const key = (process.env.SUPABASE_SERVICE_KEY || '').trim();

console.log('--- Diagnóstico Supabase ---');
console.log('URL definida:', url ? 'SÍ' : 'NO');
console.log('URL empieza con https:', url.startsWith('https://'));
console.log('Longitud clave:', key.length, '(debe ser > 100)');
console.log('Clave empieza con eyJ:', key.startsWith('eyJ'));

if (!url || !key) {
  console.error('ERROR: Revisa backend/.env');
  process.exit(1);
}

const testUrl = `${url}/rest/v1/destinos?select=id,nombre&limit=1`;

console.log('\nProbando fetch a:', testUrl.slice(0, 60) + '...');

try {
  const res = await fetch(testUrl, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  console.log('Status HTTP:', res.status);
  const text = await res.text();
  console.log('Respuesta:', text.slice(0, 300));
  if (res.ok) console.log('\n✅ Conexión OK — el problema puede ser otra cosa en el código.');
  else console.log('\n⚠️ Llegó a Supabase pero respondió error (revisa la clave).');
} catch (err) {
  console.error('\n❌ fetch failed');
  console.error('Mensaje:', err.message);
  console.error('Causa:', err.cause?.message || err.cause || 'sin detalle');
  console.error('\nPosibles causas:');
  console.error('  - Sin internet o firewall/antivirus bloquea Node');
  console.error('  - URL incorrecta en .env');
  console.error('  - Proyecto Supabase pausado (restáuralo en el dashboard)');
  console.error('  - VPN o proxy corporativo');
}
