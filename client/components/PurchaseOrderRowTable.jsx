var _ = require('lodash');
var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var Table = ReactBootstrap.Table;
var Price = require('./utils/Price.jsx');

var PurchaseOrderRow = React.createClass({
  getDefaultProps: function() {
    return {
      titles: { },
      row: { },
      deliveries: { }
    }
  },

  render: function () {
    var row = this.props.row;
    var title = this.props.titles[row.titleId] || { };
    var delivery = this.props.deliveries[row.deliveryId] || { };
    return (
      <tr>
        <td>
          { title.name }
        </td>
        <td>
          { this.props.row.amount } { title.unit }
        </td>
        <td>
          <Price value={ title.priceWithTax * row.amount } />
        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>

        </td>
        <td>
          { delivery.description }
        </td>
      </tr>
    );
  }
});

var PurchaseOrderRowTable = React.createClass({
  render: function() {
    return (
      <Table>
        <thead>
          <tr>
            <th rowSpan="2">Tuote</th>
            <th rowSpan="2">Määrä</th>
            <th rowSpan="2">Summa</th>
            <th rowSpan="2">Huomiot</th>
            <th rowSpan="2">Hyväksyt&shy;täväksi</th>
            <th colSpan="3">Hyväksyntä</th>
            <th rowSpan="2">Tilattu</th>
            <th rowSpan="2">Toimitus</th>
          </tr>
          <tr>
            <th>päällikkö</th>
            <th>hankinta</th>
            <th>talous</th>
          </tr>
        </thead>
        <tbody>
          {_.map(this.props.purchaseOrderRows, (row) => {
            return <PurchaseOrderRow row={ row } titles={ this.props.titles } deliveries={ this.props.deliveries } />
          })}
        </tbody>
      </Table>
    );
  }
});

module.exports = PurchaseOrderRowTable;
