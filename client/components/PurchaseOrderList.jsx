var _ = require('lodash');
var React = require('react');

function getPurchaseOrderList(PurchaseOrder) {
  var PurchaseOrderList = React.createClass({
    propTypes: {
      purchaseOrders: React.PropTypes.object,
      purchaseOrderRows: React.PropTypes.object,
      titles: React.PropTypes.object,
      costCenters: React.PropTypes.object,
      deliveries: React.PropTypes.object,
      externalOrders: React.PropTypes.object,
      readOnly: React.PropTypes.bool,
      disableAddPurchaseNumber: React.PropTypes.bool,
    },

    getDefaultProps: function() {
      return {
        purchaseOrders: [],
        readOnly: false,
      };
    },

    render: function() {
      if (this.props.purchaseOrders && this.props.purchaseOrders.length === 0) {
        return <div>Ei tilauksia.</div>;
      }

      return (
        <div>
          {
            _(this.props.purchaseOrders)
              .values()
              .sortBy('orderId')
              .reverse()
              .map((purchaseOrder) => {
                var rows = _.filter(this.props.purchaseOrderRows, { orderId: purchaseOrder.orderId });
                var costCenter = this.props.costCenters[purchaseOrder.costcenterId] || { };
                var titles = this.props.titles || { };
                var deliveries = this.props.deliveries || { };

                return (
                  <PurchaseOrder
                    key={ purchaseOrder.orderId }
                    purchaseOrder={ purchaseOrder }
                    purchaseOrderRows={ rows }
                    costCenter={ costCenter }
                    titles={ titles }
                    deliveries={ deliveries }
                    externalOrders={ this.props.externalOrders }
                    readOnly={ this.props.readOnly }
                    disableAddPurchaseNumber={ this.props.disableAddPurchaseNumber }
                  />
                );
              })
              .value()
          }
        </div>
      );
    },
  });

  return PurchaseOrderList;
}

module.exports = getPurchaseOrderList;
