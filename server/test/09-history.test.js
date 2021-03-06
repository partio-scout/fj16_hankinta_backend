var app = require('../server');
var request = require('supertest');
var expect = require('chai').expect;
var testUtils = require('./utils/test-utils');
var Promise = require('bluebird');

describe('History', function() {
  var userId, orderId, accessToken;

  var purchaseUser = app.models.Purchaseuser;
  var findCostcenter = Promise.promisify(app.models.Costcenter.find, app.models.Costcenter);
  var findRole = Promise.promisify(app.models.Role.find, app.models.Role);

  beforeEach(function(done) {
    return Promise.join(
      findCostcenter({ where: { code: '00000' } }),
      findRole({ where: { name: 'orderer' } }),
      function (ccs, roles) {
        return purchaseUser.createWithRolesAndCostcenters({
          memberNumber: '0000010',
          username: 'newOrderer',
          password: 'salasana',
          name: 'Tanja Tilaaja',
          phone: '050 2345678',
          email: 'tanja@tilaa.ja',
          enlistment: 'Ostaja',
          userSection: 'Palvelut',
        }, roles, ccs, [], []);
      }).then(function(user) {
        userId = user.id;
        return testUtils.loginUser('newOrderer');
      }).then(function(newAccessToken) {
        accessToken = newAccessToken;
        return request(app).post('/api/Purchaseorders?access_token=' + accessToken.id)
          .send({
            'name': 'Historiallinen testitilaus',
            'costcenterId': 1,
            'subscriberId': accessToken.userId,
          })
          .expect(200)
          .expect(function(res) {
            orderId = res.body.orderId;
          });
      }).then(function() {
        return request(app).post('/api/Purchaseorderrows?access_token=' + accessToken.id)
        .send({
          'titleId': 1,
          'amount': 16,
          'deliveryId': 1,
          'orderId': orderId,
          'approved': false,
          'finished': false,
          'memo': 'Historiallinen tilausrivi',
        })
        .expect(200);
      }).nodeify(done);
  });

  afterEach(function(done) {
    Promise.join(
      // Remove only id > 2 because 1 and 2 are used by built-in fixtures
      testUtils.deleteFixturesIfExist('History', { 'historyId': { 'gt': 2 } }),
      testUtils.deleteFixturesIfExist('Purchaseorder', { 'name': 'Historiallinen testitilaus' }),
      testUtils.deleteFixturesIfExist('Purchaseorder', { 'name': 'Historiallinen muokkaus' }),
      testUtils.deleteFixturesIfExist('Purchaseorderrow', { 'memo': 'Historiallinen tilausrivi' }),
      testUtils.deleteFixtureIfExists('Purchaseuser', userId)
    ).nodeify(done);
  });

  // History is saved after sending response to client -> add small delay so that it has been
  // saved before expect()
  function expectHistoryToEventuallyExist(expectedHistory, cb) {
    setTimeout(function() {
      testUtils.find('History', expectedHistory).then(function(res) {
        expect(res).to.have.length(1);
        expect(res[0]).to.have.property('timestamp').that.is.not.null;
        cb();
      });
    }, 100);
  }

  function withOrderAndRowAndAccessToken(func) {
    testUtils.find('Purchaseorder', { 'name': 'Historiallinen testitilaus' }).then(function(orders) {
      testUtils.find('Purchaseorderrow', { 'memo': 'Historiallinen tilausrivi' }).then(function(rows) {
        testUtils.loginUser('newOrderer').then(function(accessToken) {
          func(orders[0], rows[0], accessToken);
        });
      });
    });
  }

  it('should be recorded when creating a purchase order', function(done) {
    withOrderAndRowAndAccessToken(function(order, row, accessToken) {
      expectHistoryToEventuallyExist({
        'comment': 'Historiallinen testitilaus',
        'eventtype': 'add',
        'accountId': accessToken.userId,
        'purchaseOrderId': order.id,
        'purchaseOrderRowId': null,
      }, done);
    });
  });

  it('should be recorded when updating a purchase order', function(done) {
    withOrderAndRowAndAccessToken(function(order, row, accessToken) {
      request(app).put('/api/Purchaseorders/' + order.orderId + '?access_token=' + accessToken.id)
        .send({
          'name': 'Historiallinen muokkaus',
          'costcenterId': 1,
          'subscriberId': accessToken.userId,
        })
        .end(function() {
          expectHistoryToEventuallyExist({
            'comment': 'Historiallinen muokkaus',
            'eventtype': 'update',
            'accountId': accessToken.userId,
            'purchaseOrderId': order.orderId,
            'purchaseOrderRowId': null,
          }, done);
        });
    });
  });

  it('should be recorded when creating a purchase order row', function(done) {
    withOrderAndRowAndAccessToken(function(order, row, accessToken) {
      expectHistoryToEventuallyExist({
        'purchaseOrderId': orderId,
        'purchaseOrderRowId': row.orderRowId,
        'eventtype': 'add row',
        'comment': '',
        'accountId': accessToken.userId,
      }, done);
    });
  });

  it('should be recorded when updating a purchase order row', function(done) {
    withOrderAndRowAndAccessToken(function(order, row, accessToken) {
      request(app).put('/api/Purchaseorders/' + orderId + '/order_rows/' + row.orderRowId + '?access_token=' + accessToken.id)
        .send({
          'orderRowId': row.orderRowId,
          'titleId': 2,
          'amount': 4,
          'deliveryId': 1,
          'orderId': orderId,
          'approved': false,
          'finished': false,
          'memo': 'Historiallinen tilausrivi',
        })
        .end(function() {
          expectHistoryToEventuallyExist({
            'purchaseOrderId': orderId,
            'purchaseOrderRowId': row.orderRowId,
            'eventtype': 'update row',
            'comment': null,
            'accountId': accessToken.userId,
          }, done);
        });
    });
  });

});
