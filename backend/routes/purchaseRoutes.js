const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const authenticateToken = require('../middlewares/authMiddleware');
const { authorizeRoles, enforceBaseScope } = require('../middlewares/rbacMiddleware');

router.post('/', 
    authenticateToken, 
    authorizeRoles('ADMIN', 'LOGISTICS_OFFICER'), 
    enforceBaseScope, 
    purchaseController.createPurchase
);

router.get('/history', authenticateToken, enforceBaseScope, purchaseController.getPurchaseHistory);

module.exports = router;