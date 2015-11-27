// Mocha's describe(), it() etc. are global

var app = require('../server');
var request = require('supertest');
var expect = require('chai').expect;
var testUtils = require('./utils/test-utils.js');

describe('CSVExport', function() {

  // REST API tests for unauthenticated and authenticated users (nothing posted)
  describe('REST API', function() {

    it('should decline access for unauthenticated users', function(done) {
      request(app).post('/api/Purchaseorderrows/CSVExport')
      .expect(401)
      .end(done);
    });

    it('should grant access for authenticated users', function(done) {
      testUtils.loginUser('procurementAdmin').then(function(accessToken) {
        request(app).post('/api/Purchaseorderrows/CSVExport')
        .query({ access_token: accessToken.id })
        .expect(200)
        .end(done);
      });
    });
  });

  describe('method', function() {

    before(function(done) {
      testUtils.createFixture('Costcenter',
        {
          'costcenterId': 12,
          'code': '00001',
          'name': 'Testikustannuspaikka',
          'approverUserId': 2,
          'controllerUserId': 3
        })
      .then(
        testUtils.createFixture('Purchaseorder',
          {
            'orderId': 12,
            	'name': 'Testitilaus',
            	'costcenterId': 12,
            	'usageobjectId': 1,
            	'subscriberId': 3
          }
        )
      )
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(err);
      });
    });

    after(function(done) {
      testUtils.deleteFixtureIfExists('Costcenter', 12)
      .then(
        testUtils.deleteFixtureIfExists('Purchaseorder', 12)
      )
      .then(function() {
        done();
      })
      .catch(function(err) {
        done(err);
      });
    });

    afterEach(function(done) {
      app.models.Purchaseorderrow.destroyById(12, done);
    });

    it('should add order name and costcenterId to purchaseorderrow', function(done) {
      var expectedCSV = "amount','approved','confirmed','controllerApproval','delivered','deliveryId','finished','memo','modified','orderId','orderName','costCenterId','orderRowId','ordered','providerApproval','purchaseOrderNumber','titleId','userSectionApproval','nameOverride','priceOverride','unitOverride' 0,'false','false','false','false',0,'false','2015-07-26 13:40:15.002+03','n/a',12,'Testitilaus',12,'false','false',0,0,'false','n/a',0,'n/a'";

      testUtils.loginUser('procurementAdmin').then(function(accessToken) {
        testUtils.createFixture('Purchaseorderrow',
          {
            'amount': 0,
            'approved': false,
            'confirmed': false,
            'controllerApproval': false,
            'delivered': false,
            'deliveryId': 0,
            'finished': false,
            'memo': 'n/a',
            'modified': '2015-07-26 13:40:15.002+03',
            'orderId': 12,
            'orderRowId': 12,
            'ordered': false,
            'providerApproval': false,
            'purchaseOrderNumber': 0,
            'titleId': 0,
            'userSectionApproval': false,
            'nameOverride': 'n/a',
            'priceOverride': 0,
            'unitOverride': 'n/a'
          }).then(function() {
            request(app).post('/api/Purchaseorderrows/CSVExport?access_token=' + accessToken.id )
            .expect(200)
            .expect(function(err, res) {
              if (err) {
                done(err);
              } else {
                expect(res.body.csv).to.equal(expectedCSV);
              }
            });
          })
        .then(function() {
          done();
        })
        .catch(function(err) {
          done(err);
        });
      });
    });
  });
});
