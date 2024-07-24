const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

const authenticatedUser = (username, password) => {
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    // Store access token and username in session
    req.session.authorization = {
      accessToken,
      username,
    };
    console.log("User logged in:", username);
    return res.status(200).send("User successfully logged in");
  } else {
    console.log("Invalid login attempt for:", username);
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    books[isbn].reviews[username] = review;
    return res
      .status(200)
      .json({
        message: "Review successfully added/updated",
        book: books[isbn],
      });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//DELETE a book
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    if (books[isbn].reviews && books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res
        .status(200)
        .json({ message: "Review successfully deleted", book: books[isbn] });
    } else {
      return res
        .status(404)
        .json({ message: "Review not found for this user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
