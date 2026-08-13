const { Pool } = require("pg");
const schema = require("../models/schema");
require("dotenv").config();

// Standard connection for Cloud Hosting
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Supabase/Render connections
  }
});

/**
 * Cloud Bootstrap Function
 * Simplified for Render/Supabase
 */
const initializeSystem = async () => {
  try {
    const client = await db.connect();
    console.log(`📡 CLOUD CONNECTION: Syncing with Supabase...`);
    
    // In production, we only verify/create the TABLES, not the Database itself
    await client.query(schema);
    
    console.log("✅ MILITARY GRID READY: All tables are verified.");
    client.release();
  } catch (err) {
    console.error("❌ Schema Sync Error:", err.message);
    // Do not process.exit() here, let the server try to start
  }
};

initializeSystem();

module.exports = db;