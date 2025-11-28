const { pool } = require('./src/config/database');

async function checkTableStructure() {
  try {
    console.log('Checking "users" table structure...');
    
    // Query to get column information
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table columns:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name} (${row.data_type}) - nullable: ${row.is_nullable}, default: ${row.column_default}`);
    });
    
  } catch (error) {
    console.error('Error checking table structure:', error.message);
  } finally {
    await pool.end();
  }
}

checkTableStructure();