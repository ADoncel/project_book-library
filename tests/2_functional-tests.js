/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const { Book } = require('../models/model')

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done) {
  //   chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res) {
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       if (res.body.length > 0) {
  //         assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //         assert.property(res.body[0], 'title', 'Books in array should contain title');
  //         assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       }
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  let book = new Book({ title: 'Func. test book', comments: [] });
  book.save();
  let book2DEL = new Book({ title: 'Func. test DELETE book', comments: [] });
  book2DEL.save();

  suite('Routing tests', async function() {

    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({
            title: "Func. test 1",
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.equal(res.body.title, "Func. test 1");
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments, "Array of comments")
            done();
          });
      });

      test('Test POST /api/books with no title given', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });

    });


    suite('GET /api/books => array of books', function() {

      test('Test GET /api/books', function(done) {
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            if (res.body.length > 0) {
              res.body.forEach((book) => {
                assert.property(book, 'commentcount', 'Books in array should contain commentcount');
                assert.property(book, 'title', 'Books in array should contain title');
                assert.property(book, '_id', 'Books in array should contain _id');
              })
            }
            done();
          });
      });

    });


    suite('GET /api/books/[id] => book object with [id]', function() {

      test('Test GET /api/books/[id] with id not in db', function(done) {
        chai.request(server)
          .get(`/api/books/65045ec5b7bb063d56111111`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function(done) {
        chai.request(server)
          .get(`/api/books/${book._id}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, `${book._id}`)
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments, "Array of comments")
            done();
          });
      });

    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function() {

      test('Test POST /api/books/[id] with comment', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${book._id}`)
          .send({
            comment: "Func. test 2"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'application/json');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, `${book._id}`)
            assert.property(res.body, 'title');
            assert.property(res.body, 'comments');
            assert.isArray(res.body.comments, "Array of comments")
            assert.include(res.body.comments, "Func. test 2")
            done();
          });
      });

      test('Test POST /api/books/[id] without comment field', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post(`/api/books/${book._id}`)
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done) {
        chai
          .request(server)
          .keepOpen()
          .post('/api/books/65045ec5b7bb063d56111111')
          .send({
            comment: "Func. test 3"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

    suite('DELETE /api/books/[id] => delete book object id', function() {


      test('Test DELETE /api/books/[id] with valid id in db', function(done) {
        chai
          .request(server)
          .keepOpen()
          .delete(`/api/books/${book2DEL._id}`)
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done) {
        chai
          .request(server)
          .keepOpen()
          .delete('/api/books/65045ec5b7bb063d56111111/')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.type, 'text/html');
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

  });

});
