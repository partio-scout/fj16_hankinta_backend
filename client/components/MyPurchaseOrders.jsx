var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var ReactRouterBootstrap = require('react-router-bootstrap');

var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var ButtonLink = ReactRouterBootstrap.ButtonLink;

var PurchaseOrderList = require('./PurchaseOrderList.jsx');
var PurchaseOrderLink = require('./PurchaseOrderLink.jsx');

var getMyPurchaseOrders = function(PurchaseOrderStore, PurchaseOrderActions) {
  return React.createClass({
    getInitialState() {
      return PurchaseOrderStore.getState();
    },

    componentDidMount() {
      PurchaseOrderStore.listen(this.onChange);
    },

    componentDidUnmount() {
      PurchaseOrderStore.listen(this.onChange);
    },

    onChange(state) {
      this.setState(state);
    },

    render: function () {
      return (
        <Row>
          <Col>
            <h1>
              Omat tilaukset
            </h1>
            <ButtonLink to="new_purchase_order" bsStyle="primary">
              Uusi tilaus
            </ButtonLink>
            <div>
              <PurchaseOrderLink />
              <PurchaseOrderLink />
            </div>
            <PurchaseOrderList purchaseOrders={ this.state.myPurchaseOrders } />
          </Col>
        </Row>
      );
    }
  });
};

module.exports = getMyPurchaseOrders;
