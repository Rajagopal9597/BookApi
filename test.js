const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app'); // Replace with the actual path to your Express app

// Configure chai to use chai-http plugin
chai.use(chaiHttp);
const expect = chai.expect;

// Set up authentication for testing
const TOKEN = "your-secret-key";

describe('Book Routes', () => {
  
  let bookId;

  // Before each test, insert a book to test the retrieval, update, and delete
beforeEach(async () => {
  const newBook = {
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test Description',
    publicationYear: 2023,
  };
  
  try {
    const res = await chai.request(app).post('/insert').set('Authorization', `${TOKEN}`).send(newBook);
    bookId = res.body.data._id; 
  } catch (error) {
    console.error('Error while inserting the book:', error);
  }
});



  afterEach(async () => {
    await chai.request(app).delete(`/deletebook/${bookId}`);
  });

  describe('GET /getbooks', () => {
    it('should get a list of books', async () => {
      const res = await chai
        .request(app)
        .get('/getbooks')
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('array');
    });
  });

  describe('GET /getbook/:id', () => {
    it('should get a book by ID', async () => {
      const res = await chai
        .request(app)
        .get(`/getbook/${bookId}`)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.title).to.equal('Test Book');
    });

    it('should return 404 if the book is not found', async () => {
      const nonExistentBookId = '64be7a0d5273de057695ecfe';

      const res = await chai
        .request(app)
        .get(`/getbook/${nonExistentBookId}`)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Book not found');
    });
  });

  describe('POST /insert', () => {
    it('should insert a new book', async () => {
      const newBook = {
        title: 'New Test Book',
        author: 'New Test Author',
        description: 'New Test Description',
        publicationYear: 2025,
      };

      const res = await chai
        .request(app)
        .post('/insert')
        .send(newBook)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.title).to.equal('New Test Book');
      
    });

    it('should return 400 if title or author are missing', async () => {
      const invalidBook = {
        description: 'Invalid Book without title and author',
        publicationYear: 2023,
      };

      const res = await chai
        .request(app)
        .post('/insert')
        .send(invalidBook)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Title and Author are required fields');
    });
  });

  describe('PUT /updatebook/:id', () => {
    it('should update a book', async () => {
      const updatedBook = {
        title: 'Updated Test Book',
        author: 'Updated Test Author',
        description: 'Updated Test Description',
        publicationYear: 2024,
      };

      const res = await chai
        .request(app)
        .put(`/updatebook/${bookId}`)
        .send(updatedBook)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data.title).to.equal('Updated Test Book');
      
    });

    it('should return 404 if the book is not found', async () => {
      const nonExistentBookId = '64be7a0d5273de057695ecfe';

      const updatedBook = {
        title: 'Updated Test Book',
        author: 'Updated Test Author',
        description: 'Updated Test Description',
        publicationYear: 2024,
      };

      const res = await chai
        .request(app)
        .put(`/updatebook/${nonExistentBookId}`)
        .send(updatedBook)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Book not found');
    });

    it('should return 400 if title or author are missing', async () => {
      const invalidBook = {
        description: 'Invalid Book without title and author',
        publicationYear: 2023,
      };

      const res = await chai
        .request(app)
        .put(`/updatebook/${bookId}`)
        .send(invalidBook)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Title and Author are required fields');
    });
  });

  describe('DELETE /deletebook/:id', () => {
    it('should delete a book', async () => {
      const res = await chai
        .request(app)
        .delete(`/deletebook/${bookId}`)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data._id).to.equal(bookId);
    });

    it('should return 404 if the book is not found', async () => {
      const nonExistentBookId = '64be7a0d5273de057695ecfe';

      const res = await chai
        .request(app)
        .delete(`/deletebook/${nonExistentBookId}`)
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(404);
      expect(res.body.error).to.equal('Book not found');
    });
  });

  describe('GET /search', () => {
    it('should search for books', async () => {
      const query = 'Test'; // Replace with the search query you want to test

      const res = await chai
        .request(app)
        .get('/search')
        .query({ query })
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(200);
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('array');
      
    });

    it('should return 400 if the search query is missing', async () => {
      const res = await chai
        .request(app)
        .get('/search')
        .set('Authorization', `${TOKEN}`);

      expect(res).to.have.status(400);
      expect(res.body.error).to.equal('Search query is required');
    });
  });

  // ...
});
