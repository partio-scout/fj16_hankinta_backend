var _ = require('lodash');
var React = require('react');
var ReactAddons = require('react/addons').addons;
var ReactBootstrap = require('react-bootstrap');

var Table = ReactBootstrap.Table;
var Button = ReactBootstrap.Button;
var Input = ReactBootstrap.Input;
var Glyphicon = ReactBootstrap.Glyphicon;

var ErrorMessages = require('./utils/ErrorMessages');
var validateArrivedDelivery = require('../validation/arrivedDelivery');

function getArrivedDelivery(ArrivedDeliveryActions) {
  var ArrivedDeliveryTableRow = React.createClass({
    mixins: [ ReactAddons.LinkedStateMixin ],

    propTypes: {
      row: React.PropTypes.object,
      deliveryRow: React.PropTypes.object,
      title: React.PropTypes.object,
      order: React.PropTypes.object,
      costCenter: React.PropTypes.object,
      onArrivedAmountChange: React.PropTypes.func,
      onFinalDeliveryChange: React.PropTypes.func,
    },

    getInitialState() {
      return {
        amount: this.props.deliveryRow.amount,
        finalDelivery: this.props.deliveryRow.finalDelivery,
      };
    },

    componentWillReceiveProps(newProps) {
      this.setState({
        amount: newProps.deliveryRow.amount,
        finalDelivery: newProps.deliveryRow.finalDelivery,
      });
    },

    onArrivedAmountChange(e) {
      this.setState({ amount: e.target.value });
      this.props.onArrivedAmountChange(this.props.row.orderRowId, e.target.value);
    },

    onFinalDeliveryChange(e) {
      this.setState({ finalDelivery: e.target.checked });
      this.props.onFinalDeliveryChange(this.props.row.orderRowId, e.target.checked);
    },

    render: function() {
      var arrivedAmountInput = '';
      var lastDeliveryCheckbox = '';
      if (this.props.row.arrivedStatus != 2) {
        arrivedAmountInput = (
          <Input type="text" value={ this.state.amount } onChange={ this.onArrivedAmountChange } wrapperClassName="col-xs-4" />
        );
        lastDeliveryCheckbox = (
          <Input type="checkbox" checked={ this.state.finalDelivery } onChange={ this.onFinalDeliveryChange } wrapperClassName="col-xs-3"/>
        );
      } else {
        lastDeliveryCheckbox = (
          <span> <Glyphicon glyph="ok" bsClass="glyphicon accepted" /> </span>
        );
      }

      return (
        <tr>
          <th>{ this.props.title.name }</th>
          <th>{ this.props.costCenter.code } { this.props.order.name }</th>
          <th>{ this.props.row.amount } { this.props.title.unit }</th>
          <th>{ this.props.row.arrivedAmount || 0 } { this.props.title.unit }</th>
          <th>{ arrivedAmountInput }</th>
          <th>{ lastDeliveryCheckbox }</th>
        </tr>
      );
    },
  });

  var ArrivedDelivery = React.createClass({
    mixins: [ ReactAddons.LinkedStateMixin ],

    propTypes: {
      externalOrder: React.PropTypes.object,
      purchaseOrderRows: React.PropTypes.object,
      purchaseOrders: React.PropTypes.object,
      costCenters: React.PropTypes.object,
      titles: React.PropTypes.object,
      readOnly: React.PropTypes.bool,
      onDone: React.PropTypes.func,
    },

    getDefaultProps: function() {
      return {
        readOnly: false,
      };
    },

    getInitialState: function() {
      var createDeliveryRowArray = function(orderRow) {
        return {
          orderRowId: orderRow.orderRowId,
          amount: orderRow.amount - orderRow.arrivedAmount,
          finalDelivery: false,
        };
      };
      return {
        arrivalDate: null,
        memo: '',
        deliveryRows: _.map(this.props.purchaseOrderRows, createDeliveryRowArray),
      };
    },

    componentWillReceiveProps(newProps) {
      var createDeliveryRowArray = function(orderRow) {
        return {
          orderRowId: orderRow.orderRowId,
          amount: orderRow.amount - orderRow.arrivedAmount,
          finalDelivery: false,
        };
      };
      this.setState({ deliveryRows: _.map(newProps.purchaseOrderRows, createDeliveryRowArray) });
    },

    onArrivedAmountChange(rowId, arrivedAmount) {
      var index = _.findIndex(this.state.deliveryRows, { orderRowId: rowId });
      var deliveryRows = this.state.deliveryRows;
      deliveryRows[index].amount = arrivedAmount;
      this.setState({ deliveryRows: deliveryRows });
    },

    onFinalDeliveryChange(rowId, finalDelivery) {
      var index = _.findIndex(this.state.deliveryRows, { orderRowId: rowId });
      var deliveryRows = this.state.deliveryRows;
      deliveryRows[index].finalDelivery = finalDelivery;
      this.setState({ deliveryRows: deliveryRows });
    },

    onSave: function() {
      var arrivedDelivery = {
        arrivalDate: this.state.arrivalDate,
        memo: this.state.memo,
        externalorderId: this.props.externalOrder.externalorderId,
      };

      var validationErrors = validateArrivedDelivery(arrivedDelivery);

      this.setState({ validationErrors: validationErrors });

      // don't want to create row if nothing is delivered
      var deliveryRows = _.filter(this.state.deliveryRows, function(r) {
        return (!!r.amount);
      });

      if (validationErrors.length === 0) {
        ArrivedDeliveryActions.createArrivedDeliveryWithRows(arrivedDelivery, deliveryRows);
        this.props.onDone();
      }
    },

    selectAllFinalDeliveries() {
      var deliveryRows = _.map(this.state.deliveryRows, function(row) {
        row.finalDelivery = true;
        return row;
      });
      this.setState({ deliveryRows: deliveryRows });
    },

    emptyAllAmounts() {
      var deliveryRows = _.map(this.state.deliveryRows, function(row) {
        row.amount = 0;
        return row;
      });
      this.setState({ deliveryRows: deliveryRows });
    },

    render: function() {
      var valueLinks = {
        arrivalDate: this.linkState('arrivalDate'),
        memo: this.linkState('memo'),
      };

      var saveButton = (
        <Button bsStyle="primary" onClick={ this.onSave } className="save" ><span> Tallenna </span> </Button>
      );

      var checkAllFinalDeliveriesButton = (
        <Button bsStyle="link" bsSize="xsmall" onClick={ this.selectAllFinalDeliveries } ><span> Valitse kaikki </span> </Button>
      );

      var emptyAllAmountsButton = (
        <Button bsStyle="link" bsSize="xsmall" onClick={ this.emptyAllAmounts } ><span> Tyhjennä kaikki </span> </Button>
      );

      return (
        <div>
          { saveButton }
          <form className="form-horizontal">
            <ErrorMessages messages={ this.state.validationErrors } />
            <Input type="date" label="Saapumispäivä" valueLink={ valueLinks.arrivalDate } labelClassName="col-xs-3" wrapperClassName="col-xs-3"/>
          </form>
          <Table>
            <thead>
              <tr>
                <th>Tuote</th>
                <th>Tilaus</th>
                <th>Tilattu</th>
                <th>Tullut</th>
                <th>Saapui <span>{ emptyAllAmountsButton }</span></th>
                <th>Viimeinen erä <span>{ checkAllFinalDeliveriesButton }</span></th>
              </tr>
            </thead>
            <tbody>
            {
              _.map(this.props.purchaseOrderRows, row =>
                <ArrivedDeliveryTableRow
                  row={ row }
                  title={ this.props.titles[row.titleId] || {} }
                  order={ this.props.purchaseOrders[row.orderId] }
                  costCenter={ this.props.costCenters[this.props.purchaseOrders[row.orderId].costcenterId] }
                  deliveryRow={ _.find(this.state.deliveryRows, { orderRowId: row.orderRowId }) }
                  onArrivedAmountChange={ this.onArrivedAmountChange }
                  onFinalDeliveryChange={ this.onFinalDeliveryChange }
                />
              )
            }
            </tbody>
          </Table>
          <form className="form-horizontal">
            <Input type="textarea" label="Kommentti" valueLink={ valueLinks.memo } labelClassName="col-xs-3" wrapperClassName="col-xs-3"/>
          </form>
          { saveButton }
        </div>
      );
    },
  });

  return ArrivedDelivery;
}

module.exports = getArrivedDelivery;
