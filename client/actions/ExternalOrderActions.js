var _ = require('lodash');

function getExternalOrderActions(alt, ExternalOrder) {
  class ExternalOrderActions {

    externalOrderUpdateFailed(error) {
      this.dispatch(error);
    }

    updateExternalOrders(externalOrders) {
      this.dispatch(externalOrders);
    }

    fetchExternalOrders() {
      this.dispatch();
      ExternalOrder.findAll((err, externalOrders) => {
        if (err) {
          this.actions.externalOrderUpdateFailed(null);
        } else {
          this.actions.updateExternalOrders(_.indexBy(externalOrders, 'externalorderId'));
        }
      }, 'filter={"include":{"relation":"order_rows","scope":{"fields":["orderRowId"]}}}');
    }

    saveExternalOrderFailed(error) {
      this.dispatch(error);
    }

    createExternalOrder(externalOrder) {
      this.dispatch(externalOrder);
      ExternalOrder.create(externalOrder, (err) => {
        if (err) {
          this.actions.saveExternalOrderFailed(null);
        } else {
          this.actions.fetchExternalOrders();
        }
      });
    }
  }
  return alt.createActions(ExternalOrderActions);
}

module.exports = getExternalOrderActions;
