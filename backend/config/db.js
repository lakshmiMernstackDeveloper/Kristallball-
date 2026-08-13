const { Pool } = require("pg");
require("dotenv").config();


const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});

const initializeSystem = async () => {
  try {
    const poolClient = await db.connect();
    console.log("📡 CONNECTION SUCCESS: Connected to Supabase Cloud.");
    
    const schema = require("../models/schema");
    await poolClient.query(schema);
        console.log("✅ MILITARY GRID READY: Tables are live on Supabase.");
    poolClient.release();
  } catch (err) {
    console.error("❌ Supabase Initialization Error:", err.message);
    console.log("HINT: Check if DATABASE_URL in .env matches the Transaction Pooler string.");
  }
};

initializeSystem();

module.exports = db;