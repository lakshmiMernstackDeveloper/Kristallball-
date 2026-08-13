const db = require('../config/db');

/**
 * Creates an Inter-Base Transfer
 * 1. Validates Source and Destination aren't identical
 * 2. Calculates real-time inventory at Source Base
 * 3. Atomic Transaction: Checks stock -> Logs Transfer -> Logs Audit
 */
exports.createTransfer = async (req, res) => {
    const client = await db.connect(); 
    
    try {
        const { sourceBaseId, destinationBaseId, equipmentTypeId, quantity } = req.body;
        const userId = req.user.id;

        // 1. Basic Validation
        if (!sourceBaseId || !destinationBaseId || !equipmentTypeId || !quantity) {
            return res.status(400).json({ error: "Command Denied: Missing transfer parameters." });
        }

        if (parseInt(sourceBaseId) === parseInt(destinationBaseId)) {
            return res.status(400).json({ error: "Logistics Error: Source and Destination bases cannot be identical." });
        }

        if (parseInt(quantity) <= 0) {
            return res.status(400).json({ error: "Invalid Quantity: Must transfer at least 1 unit." });
        }

        await client.query('BEGIN'); // START ATOMIC TRANSACTION

        // 2. CRITICAL: STOCK VALIDATION
        // Calculate the current balance at the source base before moving assets
        const stockQuery = `
            SELECT (
                -- Total gained (Purchases + Transfers In)
                (SELECT COALESCE(SUM(quantity), 0) FROM purchases WHERE base_id = $1 AND equipment_type_id = $2) +
                (SELECT COALESCE(SUM(quantity), 0) FROM transfers WHERE destination_base_id = $1 AND equipment_type_id = $2) -
                -- Total lost (Transfers Out + Expenditures)
                (SELECT COALESCE(SUM(quantity), 0) FROM transfers WHERE source_base_id = $1 AND equipment_type_id = $2) -
                (SELECT COALESCE(SUM(quantity), 0) FROM expenditures WHERE base_id = $1 AND equipment_type_id = $2)
            ) as current_balance
        `;

        const stockRes = await client.query(stockQuery, [sourceBaseId, equipmentTypeId]);
        const availableStock = parseInt(stockRes.rows[0].current_balance);

        if (availableStock < quantity) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                error: `Insufficient Assets: Base #${sourceBaseId} only has ${availableStock} units available. Transfer requested: ${quantity}.` 
            });
        }

        // 3. LOG THE TRANSFER
        const tQuery = `
            INSERT INTO transfers (source_base_id, destination_base_id, equipment_type_id, quantity, initiated_by) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id
        `;
        const transferResult = await client.query(tQuery, [sourceBaseId, destinationBaseId, equipmentTypeId, quantity, userId]);

        // 4. FETCH NAMES FOR AUDIT (For better readability in logs)
        const nameRes = await client.query(`
            SELECT 
                (SELECT name FROM bases WHERE id = $1) as src_name,
                (SELECT name FROM bases WHERE id = $2) as dest_name,
                (SELECT name FROM equipment_types WHERE id = $3) as equip_name
        `, [sourceBaseId, destinationBaseId, equipmentTypeId]);
        
        const { src_name, dest_name, equip_name } = nameRes.rows[0];

        // 5. AUDIT LOGGING
        const logQuery = 'INSERT INTO audit_logs (user_id, action, details) VALUES ($1, $2, $3)';
        const auditDetails = `TRANSFER ID ${transferResult.rows[0].id}: Moved ${quantity} units of [${equip_name}] from [${src_name}] to [${dest_name}]`;
        await client.query(logQuery, [userId, 'TRANSFER', auditDetails]);

        await client.query('COMMIT'); // SUCCESS
        
        res.status(201).json({ 
            message: "Transfer finalized and assets rerouted.",
            transferId: transferResult.rows[0].id
        });

    } catch (err) {
        await client.query('ROLLBACK'); // REVERT ON ERROR
        console.error("Critical Logistics Failure:", err.message);
        res.status(500).json({ error: "Atomic Transfer failed: Internal Grid Error." });
    } finally {
        client.release();
    }
};

/**
 * Fetches Transfer History
 * Supports base filtering via query params (injected by RBAC middleware)
 */
exports.getTransferHistory = async (req, res) => {
    try {
        const { baseId } = req.query; // baseId is forced here by enforceBaseScope for Commanders

        const query = `
            SELECT 
                t.id, t.quantity, t.created_at,
                et.name as equipment_name,
                sb.name as source_base_name,
                db.name as destination_base_name,
                u.username as initiator
            FROM transfers t
            JOIN equipment_types et ON t.equipment_type_id = et.id
            JOIN bases sb ON t.source_base_id = sb.id
            JOIN bases db ON t.destination_base_id = db.id
            JOIN users u ON t.initiated_by = u.id
            WHERE ($1::int IS NULL OR t.source_base_id = $1 OR t.destination_base_id = $1)
            ORDER BY t.created_at DESC
        `;

        const result = await db.query(query, [baseId || null]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve movement logs." });
    }
};