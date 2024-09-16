import { body, validationResult } from "express-validator";
import { message } from "../db/messageQueries.js";

const validateMessage = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 50 })
    .blacklist('<>"/') // Remove specific unwanted characters
    .withMessage(`Title has to be between 1 and 50 char. long`)
    .escape(), // Escape HTML characters
  body("content")
    .trim()
    .isLength({ min: 1, max: 50 })
    .blacklist('<>"/') // Remove specific unwanted characters
    .withMessage(`Message has to be between 1 and 50 char. long`)
    .escape(), // Escape HTML characters
];

const renderNewMessageForm = (req, res, next) => {
  res.render("newMessage", { title: "New message", errors: null });
};

const createMessage = [
  validateMessage,
  async (req, res, next) => {
    const errors = validationResult(req);
    let allErrors = errors.array();

    // Check if the user is logged in
    if (!req.user) {
      // Append the unauthorized error to the errors array
      allErrors.push({
        msg: "Unauthorized: You need to be logged in to post a message",
      });

      return res.status(401).render("newMessage", {
        title: "Unauthorized",
        errors: allErrors, // Pass the updated array of errors
      });
    }

    if (!errors.isEmpty()) {
      console.error(errors);
      return res.status(400).render("newMessage", {
        title: "Error with your message",
        errors: errors.array(),
      });
    }
    const { title, content } = req.body;
    const currentUserId = req.user.id;

    try {
      await message.createMessage(title, content, currentUserId);
      return res.status(201).redirect("/");
    } catch (error) {
      return next(error);
    }
  },
];

const deleteMessage = async (req, res, next) => {
  const messageId = req.params.id;

  try {
    // Delete the message with the given ID
    const result = message.deleteMessage(messageId);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// @desc Render index
// @route GET /

const renderIndex = async (req, res, next) => {
  const allMessages = await message.getAllMessages();
  res.render("index", { title: "Homepage", messages: allMessages });
};

export { createMessage, deleteMessage, renderNewMessageForm, renderIndex };
