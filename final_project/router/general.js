const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let axios = require('axios')
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username= req.body.username
  const password= req.body.password

  if(!username || !password){
    return res.send("Invalid credentials")
  }
  else if(users.some(user=> user.username==username)){
    return res.send("User already exists")
  }

  users.push({username,password})

  return res.send({"message":"User successfully registered. Now you can login"})
//   return res.status(300).json({message: "Yet to be implemented"});
});

// ----------------------
// Task 10: Get all books
// ----------------------
public_users.get('/', (req, res) => {
    new Promise((resolve, reject) => {
      if (!books) {
        return reject("No books available");
      }
      resolve(books);
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ message: err }));
  });
  
  // ----------------------
  // Task 11: Get book by ISBN
  // ----------------------
  public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
      if (!books[isbn]) {
        return reject("Book not found");
      }
      resolve(books[isbn]);
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
  });
  
  // ----------------------
  // Task 12: Get books by Author
  // ----------------------
  public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    new Promise((resolve, reject) => {
      const booksFound = Object.values(books).filter(b => b.author === author);
      if (booksFound.length === 0) return reject("Book not found");
      resolve(booksFound);
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
  });
  
  // ----------------------
  // Task 13: Get books by Title
  // ----------------------
  public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    new Promise((resolve, reject) => {
      const booksFound = Object.values(books).filter(b => b.title === title);
      if (booksFound.length === 0) return reject("Book not found");
      resolve(booksFound);
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
  });
  
  // ----------------------
  // Get book review
  // ----------------------
  public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {
      if (!books[isbn]) return reject("Book not found");
      resolve(books[isbn].reviews);
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(404).json({ message: err }));
  });

module.exports.general = public_users;
