function authenticateToken(req, res, next) {
    const token = req.header('Authorization');
  
    if (!token) return res.status(401).json({ message: 'Access denied' });
  
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
  
      req.user = user;
      next();
    });
  }
  
  // Example of protected route
  app.get('/authorized-route', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });
