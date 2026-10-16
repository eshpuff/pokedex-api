const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res
      .status(401)
      .json({ message: 'token não informado.'});
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'token inválido ou expirado' });
  }
}

module.exports = { authenticate };