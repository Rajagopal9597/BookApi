
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
  
    if (token !== process.env.TOKEN) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    next();
  };
  
  module.exports = authenticate;
  