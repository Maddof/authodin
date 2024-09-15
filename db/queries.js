import pool from "../config/database.js";

const checkUniqueUser = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1`;
  const { rows } = await pool.query(query, [username]);
  return rows.length > 0;
};

const insertUser = async (username, password) => {
  const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id`;
  try {
    const result = await pool.query(query, [username, password]);
    return result.rows[0];
  } catch (error) {
    console.log("Error inserting user:", error);
  }
};

// const checkSecretPassword = async(inputPass) => {
//   const query = ``
// }

// const checkSecretMember = async (username) => {
//   const query = `SELECT `
// }

export { checkUniqueUser, insertUser };
