const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, role, baseId } = req.body;
    const hashedPwd = await bcrypt.hash(password, 10);
    
    try {
        const query = 'INSERT INTO users (username, password_hash, role, base_id) VALUES ($1, $2, $3, $4) RETURNING id';
        const result = await db.query(query, [username, hashedPwd, role, baseId]);
        res.status(201).json({ userId: result.rows[0].id });
    } catch (err) {
       
        if (err.code === '23503') { // This is the PostgreSQL error code for Foreign Key Violation
            return res.status(400).json({ 
                error: `Command Failed: Base ID ${baseId} does not exist in the military grid. Create the base first.` 
            });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const userResult = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userResult.rows.length === 0) return res.status(404).json("User not found");

    const user = userResult.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json("Invalid Password");

    const token = jwt.sign(
    { 
        id: user.id, 
        username: user.username, 
        role: user.role, 
        baseId: user.base_id 
    }, 
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role, baseId: user.base_id } });
};