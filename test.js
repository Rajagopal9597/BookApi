const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./app'); // Replace with the actual path to your Express app

// Configure chai to use chai-http plugin
chai.use(chaiHttp);
const expect = chai.expect;

// Set the Mocha timeout for the entire test suite to 10000ms (10 seconds)
const timeout = 10000;
describe('Your Test Suite Description', function () {
  this.timeout(timeout);

  // Test the /getbooks endpoint
  it('should get a list of books', async function () {
    const res = await chai.request(app).get('/getbooks');
    expect(res).to.have.status(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.data).to.be.an('array');
  });

  // Test the /insert endpoint
  it('should insert a new book', async function () {
    const newBook = {
      title: 'Sample Book',
      author: 'John Doe',
      description: 'A sample book description',
      publicationYear: 2023,
    };

    const res = await chai.request(app).post('/insert').send(newBook);
    expect(res).to.have.status(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.data).to.be.an('object');
    // Add more specific assertions to check if the book was inserted correctly
    expect(res.body.data.title).to.equal(newBook.title);
    expect(res.body.data.author).to.equal(newBook.author);
  });

  // Test the /search endpoint
  it('should search for books', async function () {
    const query = 'sample'; // Replace with the search query you want to test

    const res = await chai.request(app).get('/search').query({ query });
    expect(res).to.have.status(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.data).to.be.an('array');
    // You can add more specific assertions to check the search results
  });
});
