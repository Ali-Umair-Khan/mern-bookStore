
import express from "express";
import {PORT,mongo_uri} from './config.js';
import mongoose from 'mongoose';
import {Book} from './models/bookModel.js';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.status(200).send('Welcome to mern app');
    return;
})

// route for saving a book

app.post('/books',async(req,res)=>{
    try{
        if(
            !req.body.title ||
            !req.body.author ||
            !req.body.publishYear
        ){
            return res.status(400).send({
                message:"send all required fields:author,title,publishYear"
            })
        }
        const newBook = {
            title: req.body.title,
            author:req.body.author,
            publishYear: req.body.publishYear
        };
        const book = await Book.create(newBook);
        res.status(201).json(book);
    } catch(error) {
        console.log(error.message);
        res.status(500).send({message:error.message})
    }
})

// route for getting all books

app.get('/books',async(req,res)=>{
    try{
        const books = await Book.find({});
        return res.status(201).json({
            count:books.length,
            data: books
        });
    } catch(e){
        console.log(e.message);
        res.status(500).send({message:e.message})
    }
})

// route for getting one book

app.get('/books/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const book = await Book.findById(id);
        return res.status(201).json(book);
    } catch(e){
        console.log(e.message);
        res.status(500).send({message:e.message})
    }
})

// updating a book detail

app.put('/books/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const {title,author,publishYear}=req.body;
        console.log('Request Body:', req.body);

        const book = await Book.findById(id);
        if (title) book.title=title;
        if (author) book.author=author;
        if (publishYear) book.publishYear=publishYear;
        // const bookUpdated = {
        //     title: book.title,
        //     author:book.author,
        //     publishYear: book.publishYear
        // };
        const updatedBook = await book.save();
        console.log("updated book:", updatedBook);
        return res.status(200).json(updatedBook);
    } catch(e){
        console.log(e.message);
        res.status(500).send({message:e.message})
    }
})

// delete a book 

app.delete('/books/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        // const bookUpdated = {
        //     title: book.title,
        //     author:book.author,
        //     publishYear: book.publishYear
        // };
        if(!deletedBook) return res.status(404).send({message:"book not found"});
        console.log("deleted book:", deletedBook);
        return res.status(200).json(deletedBook);
    } catch(e){
        console.log(e.message);
        res.status(500).send({message:e.message})
    }
})


mongoose.connect(mongo_uri)
.then(()=>{
    console.log('conected to database');
    app.listen(PORT,()=>{
        console.log(`listening on port ${PORT}`)
    });    
})
.catch((e)=>{console.log(e)})