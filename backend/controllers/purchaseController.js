const db = require('../config/db');

exports.createPurchase = async (req, res) => {
    const client = await db.connect();
    try {
        const { baseId, equipmentTypeId, quantity } = req.body;
        const userId = req.user.id;

        // Validation
        if (!baseId || !equipmentTypeId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: "Invalid purchase data" });
        }

        await client.query('BEGIN'); // Start Transaction

        // 1. Insert Purchase Record
        const purchaseQuery = `
            INSERT INTO purchases (base_id, equipment_type_id, quantity)
            VALUES ($1, $2, $3) RETURNING id, created_at;
        `;
        const purchaseRes = await client.query(purchaseQuery, [baseId, equipmentTypeId, quantity]);

        // 2. Fetch Equipment Name for the log (better audit trail)
        const equipRes = await client.query('SELECT name FROM equipment_types WHERE id = $1', [equipmentTypeId]);
        const equipName = equipRes.rows[0]?.name || "Unknown";

        // 3. Log to Audit Table (Operational Accountability)
        const auditQuery = `
            INSERT INTO audit_logs (user_id, action, details)
            VALUES ($1, $2, $3);
        `;
        const logDetails = `Purchased ${quantity} units of ${equipName} for Base ID: ${baseId}`;
        await client.query(auditQuery, [userId, 'PURCHASE', logDetails]);

        await client.query('COMMIT'); // Finalize both records
        
        res.status(201).json({
            message: "Purchase logged successfully",
            data: purchaseRes.rows[0]
        });

    } catch (error) {
        await client.query('ROLLBACK'); // Undo if anything fails
        console.error("Purchase Error:", error);
        res.status(500).json({ error: "Failed to process purchase" });
    } finally {
        client.release();
    }
};

exports.getPurchaseHistory = async (req, res) => {
    try {
        const { baseId } = req.query; // Filtered via middleware
        
        const query = `
            SELECT p.*, e.name as equipment_name, b.name as base_name 
            FROM purchases p
            JOIN equipment_types e ON p.equipment_type_id = e.id
            JOIN bases b ON p.base_id = b.id
            WHERE ($1::int IS NULL OR p.base_id = $1)
            ORDER BY p.created_at DESC;
        `;
        const result = await db.query(query, [baseId || null]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};