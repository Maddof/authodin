import pg from "pg";
const { Pool } = pg;

// Create a new Pool instance for PostgreSQL connection
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Export the pool instance so you can use it in other files
export default pool;
