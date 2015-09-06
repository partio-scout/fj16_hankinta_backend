var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Panel = ReactBootstrap.Panel;

var ReactRouterBootstrap = require('react-router-bootstrap');
var ButtonLink = ReactRouterBootstrap.ButtonLink;
var PurchaseOrderRowTable = require('./PurchaseOrderRowTable.jsx');

var Price = require('./utils/Price.jsx');

var PurchaseOrder = React.createClass({
  getDefaultProps: function() {
    return {
      costCenter: { name: '...' }
    }
  },

  render: function () {
    var totalPrice = _.reduce(this.props.purchaseOrderRows, (total, row) => {
      var titlePrice = this.props.titles[row.titleId].priceWithTax;
      return total + row.amount * titlePrice;
    }, 0);
    return (
      <Panel>
        <h2>
          { this.props.costCenter.code } { this.props.purchaseOrder.name }
        </h2>
        <ButtonLink to="new_purchase_order_row" params={{ purchaseOrder: this.props.purchaseOrder.orderId }} bsStyle="primary">Lisää tuote</ButtonLink>
        <PurchaseOrderRowTable
          purchaseOrderRows={ this.props.purchaseOrderRows }
          titles={ this.props.titles }
          deliveries={ this.props.deliveries } />
        <div className="purchase-order-total-price">
          Yhteensä: <Price value={ totalPrice } />
        </div>
      </Panel>
    );
  }
});

module.exports = PurchaseOrder;
