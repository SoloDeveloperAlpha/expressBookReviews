const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  try {
    res.send(JSON.stringify({ books }, null, 4));
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      res.send(books[isbn]);
    } else {
      res.status(404).send("Book not found");
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving books by ISBN",
        error: error.message,
      });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const result = [];
    for (const id in books) {
      if (books[id].author.toLowerCase() === author.toLowerCase()) {
        result.push(books[id]);
      }
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send("Author not found");
    }
  } catch {
    res
      .status(500)
      .json({
        message: "Error retrieving books by author",
        error: error.message,
      });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  try {
    const title = req.params.title;
    const result = [];
    for (const id in books) {
      if (books[id].title.toLowerCase() === title.toLowerCase()) {
        result.push(books[id]);
      }
    }
    if (result.length > 0) {
      res.json(result);
    } else {
      res.status(404).send("Title not found");
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving books by title",
        error: error.message,
      });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
