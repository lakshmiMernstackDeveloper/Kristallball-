// backend/middlewares/rbacMiddleware.js

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access Denied: You do not have the required military clearance."
            });
        }
        next();
    };
};

const enforceBaseScope = (req, res, next) => {
    // 1. Only proceed if user is logged in
    if (!req.user) return next();

    // 2. If Commander, restrict all data to their assigned base
    if (req.user.role === 'BASE_COMMANDER') {
        
        // Ensure the query object exists (Usually for GET requests)
        if (!req.query) req.query = {};
        req.query.baseId = req.user.baseId;

        // CRITICAL FIX: Only set body if it exists (Usually for POST/PUT requests)
        // This prevents the "Cannot set properties of undefined" error
        if (req.body && typeof req.body === 'object') {
            req.body.baseId = req.user.baseId;
        }

       console.log(`[SECURE GRID] Base scope locked to ID: ${req.user.baseId} for user: ${req.user.username || 'System User'}`);
    }
    
    next();
};

module.exports = { authorizeRoles, enforceBaseScope };