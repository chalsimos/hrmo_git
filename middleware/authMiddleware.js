const roleAuth = (roles) => {
  return (req, res, next) => {
    console.log('Session user:', req.session.user);
    console.log('Roles allowed:', roles);
  res.locals.user = req.session.user || null;

    if (req.session.user && roles.includes(req.session.user.role)) {
      next();
    } else {
      return res.render('login', { error: 'Access denied' });
    }
  };
};

module.exports = { roleAuth };
