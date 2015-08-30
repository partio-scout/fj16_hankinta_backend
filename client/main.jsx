require('./styles.scss');

// Get REST API access token

var Cookie = require('js-cookie');
var accessToken = Cookie.getJSON('accessToken');
var deleteAccessToken = function() {
  Cookie.remove('accessToken');
};

// Setup REST resources

var request = require('superagent');
var RestfulResource = require('./utils/rest.js')(request);
var User = new RestfulResource('/api/Users', accessToken);
var PurchaseOrder = new RestfulResource('/api/Purchaseorders', accessToken);

// Set up Flux

var Alt = require('alt');
var alt = new Alt();

var UserActions = require('./actions/UserActions')(alt, User, deleteAccessToken);
var UserStore = require('./stores/UserStore')(alt, UserActions);

var PurchaseOrderActions = require('./actions/PurchaseOrderActions')(alt, PurchaseOrder);
var PurchaseOrderStore = require('./stores/PurchaseOrderStore')(alt, PurchaseOrderActions);

// Setup main views

var App = require('./components/AppComponent.jsx')(UserStore, UserActions);
var HomePage = require('./components/HomePage.jsx')(UserStore, UserActions);
var MyPurchaseOrders = require('./components/MyPurchaseOrders.jsx')(PurchaseOrderStore, PurchaseOrderActions);
var NewPurchaseOrder = require('./components/NewPurchaseOrder.jsx')(PurchaseOrderActions);

// Setup routes

var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var routes = (
  <Route handler={ App } path="/">
    <DefaultRoute name="home" handler={ HomePage } />
    <Route name="my_purchase_orders" path="own" handler={ MyPurchaseOrders }>
      <Route name="new_purchase_order" path="new" handler={ NewPurchaseOrder } />
    </Route>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

// Check if current user is logged in

if (accessToken && accessToken.userId) {
  UserActions.fetchCurrentUser(accessToken.userId);
  PurchaseOrderActions.fetchMyPurchaseOrders(accessToken.userId);
} else {
  UserActions.fetchCurrentUser();
}
