// api/callback.js - Vercel Serverless Function (CommonJS)
// Step 2: Exchange GitHub OAuth code for an access token, then pass to Decap CMS

module.exports = async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Missing code parameter from GitHub OAuth.');
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await tokenRes.json();

    if (data.error) {
      return res
        .status(400)
        .send('GitHub OAuth Error: ' + data.error_description);
    }

    const token = data.access_token;
    const provider = 'github';

    // Safely embed token as a JS object (avoids any string escaping issues)
    const authData = JSON.stringify({ token: token, provider: provider });

    res.setHeader('Content-Type', 'text/html');
    res.send(
      '<!DOCTYPE html>' +
      '<html><head><title>Authorizing...</title></head><body>' +
      '<p>Authorizing, please wait...</p>' +
      '<script>' +
      '(function () {' +
      '  var authData = ' + authData + ';' +
      '  function receiveMessage(e) {' +
      '    window.opener.postMessage(' +
      '      "authorization:" + authData.provider + ":success:" + JSON.stringify(authData),' +
      '      e.origin' +
      '    );' +
      '  }' +
      '  window.addEventListener("message", receiveMessage, false);' +
      '  window.opener.postMessage("authorizing:" + authData.provider, "*");' +
      '})();' +
      '</script>' +
      '</body></html>'
    );
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).send('Internal server error during OAuth callback.');
  }
};
