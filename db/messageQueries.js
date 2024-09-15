import pool from "../config/database.js";

const message = {
  async createMessage(title, content, user_id) {
    await pool.query(
      "INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3)",
      [title, content, user_id]
    );
  },
  async getAllMessages() {
    const { rows } = await pool.query(`
      SELECT title, content, TO_CHAR(timestamp, 'YYYY-MM-DD') as date, username FROM messages
      JOIN users ON users.id = messages.user_id
      `);
    return rows;
  },
};

export { message };
