#! /usr/bin/env node

import pkg from "pg";
import bcrypt from "bcryptjs";

const { Client } = pkg;

const SQL = `

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR (255) NOT NULL,
  password VARCHAR (255) NOT NULL,
  admin BOOLEAN DEFAULT false,
  s_member BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);
`;

async function insertUser(
  client,
  username,
  plainPassword,
  isAdmin = false,
  isMember = false
) {
  const hashedPassword = await bcrypt.hash(plainPassword, 10); // 10 is the salt rounds
  const insertSQL = `
    INSERT INTO users (username, password, admin, s_member)
    VALUES ($1, $2, $3, $4)
  `;
  await client.query(insertSQL, [username, hashedPassword, isAdmin, isMember]);
}

async function getUserId(client, username) {
  const result = await client.query(
    `SELECT id FROM users WHERE username = $1`,
    [username]
  );
  if (result.rows.length === 0) {
    throw new Error(`User ${username} not found`);
  }
  return result.rows[0].id;
}

async function insertMessage(client, title, content, userId) {
  const insertSQL = `
    INSERT INTO messages (title, content, user_id)
    VALUES ($1, $2, $3)
  `;
  await client.query(insertSQL, [title, content, userId]);
}

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  await client.query(SQL);

  // Insert some users with hashed passwords
  await insertUser(client, "user1", "password123");
  await insertUser(client, "adminuser", "adminpassword", true);
  await insertUser(client, "secretmember", "secretsafe", false, true);

  // Get user IDs
  const user1Id = await getUserId(client, "user1");
  const adminUserId = await getUserId(client, "adminuser");
  const secretMemberId = await getUserId(client, "secretmember");

  // Insert dummy messages
  const messages = [
    {
      title: "Hello World",
      content: "This is my first post!",
      userId: user1Id,
    },
    {
      title: "Admin Post",
      content: "This is a post by an admin user.",
      userId: adminUserId,
    },
    {
      title: "Secret Post",
      content: "This post is anonymous!",
      userId: secretMemberId,
    },
    { title: "Fun Fact", content: "Did you know...?", userId: user1Id },
    {
      title: "News",
      content: "Breaking news from around the world.",
      userId: user1Id,
    },
    {
      title: "Update",
      content: "Admin update on site status.",
      userId: adminUserId,
    },
    {
      title: "Secret Meeting",
      content: "Meeting at the usual place.",
      userId: secretMemberId,
    },
    {
      title: "Joke of the Day",
      content: "Why did the chicken cross the road?",
      userId: user1Id,
    },
    {
      title: "Site Maintenance",
      content: "The site will be down for maintenance.",
      userId: adminUserId,
    },
    {
      title: "Secret Code",
      content: "The code is: 12345.",
      userId: secretMemberId,
    },
  ];

  for (const message of messages) {
    await insertMessage(client, message.title, message.content, message.userId);
  }

  await client.end();
  console.log("done");
}

main().catch((err) => console.error(err));
