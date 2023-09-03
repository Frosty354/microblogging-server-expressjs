
const jwt = require('jsonwebtoken');
const secret="Red#$Dead@&Redemoto67";



exports.jwtMiddleware = (req, res, next)=> {
  const token = req.header('authToken');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
}


