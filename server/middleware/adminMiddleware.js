const admin = (req, res, next) => {
    if (req.user && req.user.type === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

export { admin };
