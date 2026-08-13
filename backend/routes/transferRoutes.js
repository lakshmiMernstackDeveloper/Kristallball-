const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const authenticateToken = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/rbacMiddleware');


router.post('/', 
    authenticateToken, 
    authorizeRoles('ADMIN', 'LOGISTICS_OFFICER'), 
    transferController.createTransfer
);

module.exports = router;