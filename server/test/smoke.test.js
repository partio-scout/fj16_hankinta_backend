// Mocha's describe(), it() etc. are global

var app = require('../server');
var request = require('supertest');
var assert = require('assert');
var expect = require('chai').expect;

describe('Server', function() {
  it('should start up', function(done) {
    request(app).get('/')
      .expect(200)
      .expect(function(res) {
      	expect(res.body.started).to.be.a('string');
      })
      .end(done);
  });
});
