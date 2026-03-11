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

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const response = await axios.get("http://localhost:5000/");
      return res.status(200).json(response.data);
    } catch (err) {
      return res.status(500).json({ message: "Error fetching books" });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn= req.params.isbn
  const getBook= ()=> {
    return new Promise((resolve,reject)=>{
        if(!books[isbn]){
            return reject("Book not found")
        }
        resolve(books[isbn])
    })
  }
  getBook()
  .then(book=> res.json(book))
  .catch(e=> res.status(404).json({message:e}))
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;
  
    const getBooks = () => {
  
      const booksFound = [];
  
      return new Promise((resolve, reject) => {
  
        for (let id in books) {
          if (books[id].author == author) {
            booksFound.push(books[id]);
          }
        }
  
        if (booksFound.length === 0) {
          return reject("Book not found");
        }
  
        resolve(booksFound);
  
      });
    };
  
    try {
      const data = await getBooks();
      res.status(200).json(data);
    } catch (err) {
      res.status(404).json({ message: err });
    }
  
  });

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title= req.params.title
  
  const getBooks=()=>{
    return new Promise((resolve,reject)=>{
        const booksFound=[]
        for(let i in books){
            if(books[i].title===title){
                booksFound.push(books[i])
            }
          }
          if(booksFound.length===0){
                return reject("Book not found");
        }
        resolve(booksFound)
    })
  }

  try {
    const data = await getBooks();
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn= req.params.isbn
  if(!books[isbn]){
    return res.status(404).json({message:"Book not found"})
  }
  
  return res.json(books[isbn].reviews)
});

module.exports.general = public_users;
