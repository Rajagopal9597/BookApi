const express = require('express');
const router = express.Router();
const Book = require('../models/Book');


/*router.get('/getbooks', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    console.log(req.query)
    const books = await Book.find().limit(parseInt(limit)).skip(parseInt(offset));
    res.status(200).json({status:"success",data:books});
  } catch (error) {
    res.status(500).json({ status:"failure", error: error });
  }
});*/
router.get('/getbooks', async (req, res) => {
  try {
    const { limit = 10, offset = 0, sortField, sortOrder } = req.query;

    // Create a sort object based on the query parameters
    const sortOptions = {};
    if (sortField && sortOrder) {
      sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1;
    }
    const books = await Book.find()
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    res.status(500).json({ status: 'failure', error: error });
  }
});

router.get('/getbook/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ status: "failure", error: 'Book not found' });
    }
    res.status(200).json({ status: "success", data: book });
  } catch (error) {
    res.status(500).json({ status: "failure", error: error });
  }
});

router.post('/insert', async (req, res) => {
  try {
    
    const { title, author, description, publicationYear } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and Author are required fields' });
    }
    
    const newBook = await Book.create({ title, author, description, publicationYear });
    res.status(200).json({status:"success",data:newBook});
  } catch (error) {
    res.status(500).json({ status:"failure", error: error });
  }
});


router.put('/updatebook/:id', async (req, res) => {
  try {
    const { title, author, description, publicationYear } = req.body;
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and Author are required fields' });
    }
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, publicationYear },
      { new: true }
    );
    if (updatedBook) {
      res.status(200).json({status:"success",data:updatedBook});
    } else {
      res.status(404).json({ status:"failure",error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ status:"failure", error: error });
  }
});

router.delete('/deletebook/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (deletedBook) {
      res.status(200).json({status:"success",data:deletedBook});
    } else {
      res.status(404).json({ status:"failure",error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } }, 
        { author: { $regex: query, $options: 'i' } }, 
        { description: { $regex: query, $options: 'i' } }, 
      ],
    });
    res.status(200).json({status:"success",data:books});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
