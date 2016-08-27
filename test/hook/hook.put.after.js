var bookSchema, conn, odata, request, should, support;

should = require('should');

request = require('supertest');

odata = require('../../.');

support = require('../support');

conn = 'mongodb://localhost/odata-test';

bookSchema = {
  author: String,
  description: String,
  genre: String,
  price: Number,
  publish_date: Date,
  title: String
};

describe('hook.put.after', function() {
  it('should work', function(done) {
    var PORT, server;
    PORT = 0;
    server = odata(conn);
    server.resource('book', bookSchema).put().after(function(newEntity, oldEntity) {
      newEntity.should.be.have.property('title');
      oldEntity.should.be.have.property('title');
      newEntity.title.should.not.be.equal(oldEntity.title);
      return done();
    });
    return support(conn, function(books) {
      var s;
      return s = server.listen(PORT, function() {
        PORT = s.address().port;
        return request("http://localhost:" + PORT).put("/book(" + books[0].id + ")").send({
          title: 'new'
        }).end();
      });
    });
  });
  return it('should work with multiple hooks', function(done) {
    var PORT, doneTwice, server;
    PORT = 0;
    doneTwice = function() {
      return doneTwice = done;
    };
    server = odata(conn);
    server.resource('book', bookSchema).put().after(function() {
      return doneTwice();
    }).after(function() {
      return doneTwice();
    });
    return support(conn, function(books) {
      var s;
      return s = server.listen(PORT, function() {
        PORT = s.address().port;
        return request("http://localhost:" + PORT).put("/book(" + books[0].id + ")").send({
          title: 'new'
        }).end();
      });
    });
  });
});

// ---
// generated by coffee-script 1.9.2
