const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const db = require('../config/db'); 

// Authentication Endpoints add
router.post('/register', authController.register);
router.post('/login', authController.login);


router.get('/bases', async (req, res) => {
    try {
        // Query the database to get all registered military bases
        const result = await db.query('SELECT id, name, location FROM bases ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching bases:", err.message);
        res.status(500).json({ error: "Failed to fetch bases" });
    }
});

module.exports = router;