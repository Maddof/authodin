import pool from "../config/database.js";

const message = {
  async createMessage(title, content, user_id) {
    await pool.query(
      "INSERT INTO messages (title, content, user_id) VALUES ($1, $2, $3)",
      [title, content, user_id]
    );
  },
};

export { message };
