const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
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

  return res.send(`User created with Username: ${username}`)
//   return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn= req.params.isbn
  if(!books[isbn]){
    res.send("No book found")
  }
//   const book = books.find(b=> b.isbn==isbn)
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const booksFound=[]
  const author= req.params.author
  for(var isbn in books){
    if(books[isbn].author==author){
        // res.json(books[isbn])
        booksFound.push(books[isbn])
    }
  }
  if(booksFound.length==0){
    return res.json({message: "Book not found"});
  }
  res.json(booksFound)
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title= req.params.title
  const booksFound=[]
  Object.keys(books).forEach(id => {
    if(books[id].title==title){
        booksFound.push(books[id])
    }
  });
  if(booksFound.length==0){
    return res.status(300).send("No books found");
  }
  return res.status(300).json(booksFound);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn= req.params.isbn
  return res.json(books[isbn].reviews)
//   return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
