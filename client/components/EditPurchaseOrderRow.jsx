var _ = require('lodash');
var React = require('react');
var ReactAddons = require('react/addons').addons;
var Router = require('react-router');

var PurchaseOrderRowForm = require('./PurchaseOrderRowForm.jsx');

var validatePurchaseOrderRow = require('../validation/purchaseOrderRow');

var connectToStores = require('alt/utils/connectToStores');

var getEditPurchaseOrderRow = function(PurchaseOrderActions, PurchaseOrderStore, TitleStore, DeliveryStore) {
  var EditPurchaseOrderRow = React.createClass({
    mixins: [ Router.Navigation, ReactAddons.LinkedStateMixin ],

    statics: {
      getStores() {
        return [ TitleStore, DeliveryStore ]
      },

      getPropsFromStores() {
        return {
          titles: TitleStore.getState(),
          deliveries: DeliveryStore.getState()
        }
      }
    },

    transformState: function(state) {
      var rows = state.purchaseOrderRows || { };
      var rowState = rows[this.props.params.purchaseOrderRow] || { };
      var selectedTitle = _.find(this.props.titles.titles, { titleId: rowState.titleId }) || { };
      rowState.titlegroupId = selectedTitle.titlegroupId;
      return rowState;
    },

    getInitialState: function() {
      return this.transformState(PurchaseOrderStore.getState());
    },

    componentDidMount: function() {
      PurchaseOrderStore.listen(this.onOrderChange);
    },

    componentWillUnmount: function() {
      PurchaseOrderStore.unlisten(this.onOrderChange);
    },

    onOrderChange: function(state) {
      this.setState(this.transformState(state));
    },

    onCancel: function() {
      this.transitionTo('my_purchase_orders');
    },

    onSave: function() {
      var row = {
        orderRowId: this.props.params.purchaseOrderRow,
        titleId: this.state.titleId,
        amount: this.state.amount,
        approved: false,
        deliveryId: this.state.deliveryId,
        memo: this.state.memo,
        orderId: this.state.orderId
      }

      var validationErrors = validatePurchaseOrderRow(row);

      this.setState({ validationErrors: validationErrors });

      if (validationErrors.length === 0) {
        PurchaseOrderActions.updatePurchaseOrderRow(row);
        this.transitionTo('my_purchase_orders');
      }
    },

    render: function () {
      var valueLinks = {
        selectedTitleGroup: this.linkState('titlegroupId'),
        selectedTitleId: this.linkState('titleId'),
        amount: this.linkState('amount'),
        delivery: this.linkState('deliveryId'),
        memo: this.linkState('memo')
      };

      return (
        <PurchaseOrderRowForm
          title="Muokkaa tuotetta"
          titleGroups={ this.props.titles.titleGroups }
          titles={ this.props.titles.titles }
          deliveries={ this.props.deliveries.deliveries }
          valueLinks={ valueLinks }
          validationErrors={ this.state.validationErrors }
          onSave={ this.onSave }
          onCancel={ this.onCancel } />
      );
    }
  });

  return connectToStores(EditPurchaseOrderRow);
};

module.exports = getEditPurchaseOrderRow;