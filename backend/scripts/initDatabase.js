const { pool } = require('../src/config/database');
const fs = require('fs');
const path = require('path');

// Read the schema SQL file
const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

const initDatabase = async () => {
  let client;
  try {
    console.log('🚀 Starting database initialization...');
    client = await pool.connect();
    
    console.log('📋 Creating database tables...');
    await client.query(schemaSQL);
    console.log('✅ Database tables created successfully!');
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  } finally {
    if (client) {
      client.release();
    }
  }
};

// Run the initialization if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(success => {
      if (success) {
        console.log('🎉 Database initialization completed successfully!');
        process.exit(0);
      } else {
        console.log('💥 Database initialization failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Unexpected error during database initialization:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;