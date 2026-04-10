// api/test.js - Diagnostic endpoint to confirm Vercel functions are deployed
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    ok: true,
    message: 'Vercel API functions are working!',
    env: {
      hasClientId: !!process.env.GITHUB_CLIENT_ID,
      hasClientSecret: !!process.env.GITHUB_CLIENT_SECRET,
    },
  });
};
