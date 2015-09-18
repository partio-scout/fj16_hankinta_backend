var _ = require('lodash');

function getPurchaseOrderActions(alt, PurchaseOrder, PurchaseOrderRow, MyPurchaseOrder) {
  class PurchaseOrderActions {

    updateMyPurchaseOrders(myPurchaseOrders) {
      this.dispatch(myPurchaseOrders);
    }

    updatePurchaseOrderRows(myPurchaseOrders) {
      this.dispatch(myPurchaseOrders);
    }

    loadingMyPurchaseOrdersFailed(error) {
      this.dispatch(error);
    }

    fetchMyPurchaseOrders(userId) {
      this.dispatch();

      MyPurchaseOrder.findAll((err, res) => {
        if (err) {
          this.actions.loadingMyPurchaseOrdersFailed(err);
        } else {
          this.actions.updateMyPurchaseOrders(res);
        }
      }, 'filter[order]=orderId%20DESC');

      MyPurchaseOrder.findAll((err, res) => {
        if (err) {
          this.actions.loadingMyPurchaseOrdersFailed(err);
        } else {
          var orderRows = _(res).pluck('order_rows').flatten().indexBy('orderRowId').value();
          this.actions.updatePurchaseOrderRows(orderRows);
        }
      }, 'filter[order]=orderId%20DESC&filter[include]=order_rows');
    }

    creatingPurchaseOrderFailed(error) {
      this.dispatch(error);
    }

    purchaseOrderCreated(purchaseOrder) {
      this.dispatch(purchaseOrder);
    }

    creatingPurchaseOrderRowFailed(error) {
      this.dispatch(error);
    }

    purchaseOrderRowCreated(row) {
      this.dispatch(row);
    }

    createPurchaseOrder(purchaseOrder) {
      this.dispatch(purchaseOrder);
      PurchaseOrder.create(purchaseOrder, (err, savedPurchaseOrder) => {
        if (err) {
          this.actions.creatingPurchaseOrderFailed(err);
        } else {
          this.actions.purchaseOrderCreated(savedPurchaseOrder);
        }
      });
    }

    createPurchaseOrderRow(row) {
      this.dispatch(row);
      PurchaseOrderRow.create(row, (err, savedRow) => {
        if (err) {
          this.actions.creatingPurchaseOrderRowFailed(err);
        } else {
          this.actions.purchaseOrderRowCreated(savedRow);
        }
      });
    }

    purchaseOrderRowDeleted(row) {
      this.dispatch(row);
    }

    deletingPurchaseOrderRowFailed(err) {
      this.dispatch(err);
    }

    deletePurchaseOrderRow(row) {
      // Delete row via purchase order endpoint
      PurchaseOrder.raw('DELETE', row.orderId + '/order_rows/' + row.orderRowId, (err, deletedRow) => {
        if (err) {
          this.actions.deletingPurchaseOrderRowFailed(err);
        } else {
          this.actions.purchaseOrderRowDeleted(row);
        }
      });
    }
  }
  return alt.createActions(PurchaseOrderActions);
}

module.exports = getPurchaseOrderActions;
