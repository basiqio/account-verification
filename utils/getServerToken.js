const axios = require('axios');
const qs = require('qs');

// Returns an access token with server access
// https://api.basiq.io/reference/authentication

export async function getServerToken() {
  const { data } = await axios({
    method: 'post',
    url: 'https://au-api.basiq.io/token',
    headers: {
      Authorization: `Basic ${process.env.BASIQ_API_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'basiq-version': '2.0',
    },
    data: qs.stringify({ scope: 'SERVER_ACCESS' }),
  });
  return data.access_token;
}
