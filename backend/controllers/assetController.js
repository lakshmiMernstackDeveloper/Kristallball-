const db = require('../config/db');


exports.getDashboardMetrics = async (req, res) => {
    try {
        const baseId = req.query.baseId || null;
        const equipmentTypeId = req.query.equipmentTypeId || null;
        
        // Use a startDate from query, or default to current date/month for reporting
        // If no date is provided, we default to '1970-01-01' to treat everything as 'Net Movement'
        const startDate = req.query.startDate || '1970-01-01';

        const query = `
          WITH historical_sum AS (
            -- Calculate state of inventory BEFORE the selected period
            SELECT 
              (SELECT COALESCE(SUM(quantity), 0) FROM purchases WHERE created_at < $3 AND ($1::int IS NULL OR base_id = $1) AND ($2::int IS NULL OR equipment_type_id = $2)) +
              (SELECT COALESCE(SUM(quantity), 0) FROM transfers WHERE created_at < $3 AND ($1::int IS NULL OR destination_base_id = $1) AND ($2::int IS NULL OR equipment_type_id = $2)) -
              (SELECT COALESCE(SUM(quantity), 0) FROM transfers WHERE created_at < $3 AND ($1::int IS NULL OR source_base_id = $1) AND ($2::int IS NULL OR equipment_type_id = $2)) -
              (SELECT COALESCE(SUM(quantity), 0) FROM expenditures WHERE created_at < $3 AND ($1::int IS NULL OR base_id = $1) AND ($2::int IS NULL OR equipment_type_id = $2)) 
              as opening_val
          ),
          period_metrics AS (
            -- Calculate activity DURING the selected period
            SELECT 
              (SELECT COALESCE(SUM(quantity), 0) FROM purchases WHERE created_at >= $3 AND ($1::int IS NULL OR base_id = $1) AND ($2::int IS NULL OR equipment_type_id = $2)) as p_qty,
              (SELECT COALESCE(SUM(quantity), 0) FROM transfers WHERE created_at >= $3 AND ($1::int IS NULL OR destination_base_id = $1) AND ($2::int IS NULL OR equipment_type_id = $2)) as ti_qty,
              (SELECT COALESCE(SUM(quantity), 0) FROM transfers WHERE created_at >= $3 AND ($1::int IS NULL OR source_base_id = $1) AND ($2::int IS NULL OR equipment_type_id = $2)) as to_qty,
              (SELECT COALESCE(SUM(quantity), 0) FROM expenditures WHERE created_at >= $3 AND ($1::int IS NULL OR base_id = $1) AND ($2::int IS NULL OR equipment_type_id = $2)) as e_qty
          )
          SELECT * FROM historical_sum, period_metrics;
        `;

        const result = await db.query(query, [baseId, equipmentTypeId, startDate]);
        const data = result.rows[0];

        const openingBalance = Number(data.opening_val);
        const totalPurchases = Number(data.p_qty);
        const totalIn = Number(data.ti_qty);
        const totalOut = Number(data.to_qty);
        const totalExp = Number(data.e_qty);

        // FORMULA CHECK: 
        // Net Movement only reflects current period
        const netMovement = totalPurchases + totalIn - totalOut;
        // Closing = What we started with + what changed - what was used
        const closingBalance = openingBalance + netMovement - totalExp;

        res.json({
            opening_balance: openingBalance,
            total_purchases: totalPurchases,
            total_transfer_in: totalIn,
            total_transfer_out: totalOut,
            net_movement: netMovement,
            total_expended: totalExp,
            closing_balance: closingBalance
        });

    } catch (error) {
        console.error("Metric Aggregate Error:", error.message);
        res.status(500).json({ error: "Failed to aggregate inventory metrics" });
    }
};

// --- CREATE EXPENDITURE ---
exports.createExpenditure = async (req, res) => {
    const client = await db.connect(); // Get a specific client for the transaction
    try {
        const { equipmentTypeId, quantity, details } = req.body;
        const baseId = req.user.baseId || req.body.baseId; 
        const userId = req.user.id;

        await client.query('BEGIN'); // START MILITARY-GRADE TRANSACTION

        // 1. Insert Expenditure
        const expenditureQuery = `
            INSERT INTO expenditures (base_id, equipment_type_id, quantity, details)
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const result = await client.query(expenditureQuery, [baseId, equipmentTypeId, quantity, details || 'Operational use']);
        
        // 2. Insert Audit Log
        const auditQuery = `
            INSERT INTO audit_logs (user_id, action, details) 
            VALUES ($1, $2, $3)
        `;
        const auditDetails = `ACTION: EXPENDITURE | QTY: ${quantity} | EQUIP_ID: ${equipmentTypeId} | BASE: ${baseId}`;
        await client.query(auditQuery, [userId, 'EXPENDITURE', auditDetails]);

        await client.query('COMMIT'); // COMMIT BOTH AT ONCE
        res.status(201).json(result.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK'); // UNDO IF ANYTHING FAILS
        console.error("Critical Failure in Expenditure Transaction:", err.message);
        res.status(500).json({ error: "Expenditure aborted for safety." });
    } finally {
        client.release(); // Close the connection
    }
};

// --- FETCH EXPENDITURE HISTORY ---
exports.getExpenditureHistory = async (req, res) => {
    // Safety check: ensure baseId is either a number or null (not 'undefined')
    const baseId = req.query.baseId ? parseInt(req.query.baseId) : null;

    try {
        const query = `
            SELECT 
                ex.id, 
                ex.quantity, 
                COALESCE(ex.details, 'No details') as details, 
                ex.created_at, 
                e.name as equipment_name, 
                b.name as base_name
            FROM expenditures ex
            LEFT JOIN equipment_types e ON ex.equipment_type_id = e.id
            LEFT JOIN bases b ON ex.base_id = b.id
            WHERE ($1::int IS NULL OR ex.base_id = $1)
            ORDER BY ex.created_at DESC;
        `;
        
        const result = await db.query(query, [baseId]);
        res.json(result.rows);
    } catch (err) {
        // THIS LOG IS CRITICAL: check your terminal after you refresh the dashboard
        console.error("CRITICAL SQL ERROR in History Fetch:", err.message);
        
        res.status(500).json({ error: "Failed to fetch deployment history from grid." });
    }
};