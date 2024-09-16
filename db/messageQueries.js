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
      SELECT  messages.id AS msg_id, 
              messages.title,
              messages.content,
              users.username,
              TO_CHAR(messages.timestamp, 'YYYY-MM-DD') AS date
                FROM messages
                JOIN users ON users.id = messages.user_id
                ORDER BY messages.timestamp DESC;
      `);
    return rows;
  },

  async deleteMessage(msgid) {
    const query = `
                  DELETE FROM messages WHERE id = $1 RETURNING *
    `;
    const { rows } = await pool.query(query, [msgid]);
    return rows;
  },
};

export { message };
