// api/auth.js - Vercel Serverless Function (CommonJS)
// Step 1: Redirect user to GitHub OAuth authorization page

module.exports = function handler(req, res) {
  const siteUrl = 'https://ard-ebon.vercel.app';

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: `${siteUrl}/api/callback`,
    scope: 'repo user',
    state: Math.random().toString(36).substring(7),
  });

  res.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
};
