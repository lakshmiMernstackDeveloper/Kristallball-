const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const authenticateToken = require('../middlewares/authMiddleware');
const db = require('../config/db');

const { enforceBaseScope } = require('../middlewares/rbacMiddleware'); 
// ---------------------------

router.get('/metrics', authenticateToken, enforceBaseScope, assetController.getDashboardMetrics);

router.get('/equipment-types', authenticateToken, async (req, res) => {
    try {
        const result = await db.query('SELECT id, name, category FROM equipment_types ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch equipment types" });
    }
});

router.post('/expenditures', authenticateToken, assetController.createExpenditure);
router.get('/expenditures', authenticateToken, enforceBaseScope, assetController.getExpenditureHistory);

module.exports = router;