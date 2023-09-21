/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const bodyParser = require('body-parser');
const { Book } = require('../models/model')

module.exports = function(app) {

  app.route('/api/books')
    .get(async function(req, res) {
      let books = await Book.find();
      let mapBooks = books.map((item) => {
        return {
          _id: item._id,
          title: item.title,
          commentcount: item.comments.length
        }
      })

      res.json(mapBooks)
    })

    .post(async function(req, res) {
      let title = req.body.title;

      if (title == '' || title == null) res.send('missing required field title')
      else {
        let book = new Book({ title: title, comments: [] });
        await book.save();

        res.json(book)
      }
    })

    .delete(async function(req, res) {
      let delAll = await Book.deleteMany({});
      if (delAll) res.send('complete delete successful')
    });



  app.route('/api/books/:id')
    .get(async function(req, res) {
      let bookid = req.params.id;

      let book = await Book.findById(bookid);

      if (book) res.json(book)
      else res.send('no book exists')
    })

    .post(async function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (comment == '' || comment == null) res.send('missing required field comment')
      else {
        let book = await Book.findByIdAndUpdate(bookid,
          { $push: { comments: comment } }, { new: true });

        if (book) res.json(book);
        else res.send('no book exists')
      }
    })

    .delete(async function(req, res) {
      let bookid = req.params.id;
      let delBook = await Book.findByIdAndDelete(bookid);

      if (delBook) res.send('delete successful')
      else res.send('no book exists')
    });

};
