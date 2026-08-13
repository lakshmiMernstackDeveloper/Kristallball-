const db = require('../config/db');

const loggerMiddleware = async (req, res, next) => {
    // Only log mutations (POST, PUT, DELETE) or specific sensitive paths
    if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        res.on('finish', async () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                const userId = req.user ? req.user.id : null;
                const action = `${req.method} ${req.originalUrl}`;
                const details = `User ${userId} performed ${action} with payload: ${JSON.stringify(req.body)}`;

                try {
                    await db.query(
                        'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)',
                        [userId, action, details]
                    );
                } catch (err) {
                    console.error("Logger Middleware Error:", err);
                }
            }
        });
    }
    next();
};

module.exports = loggerMiddleware;