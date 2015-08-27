require('./styles.scss');

var Cookie = require('js-cookie');
var accessToken = Cookie.getJSON('accessToken');

var request = require('superagent');
var RestfulResource = require('./utils/rest.js')(request);
var User = new RestfulResource('/api/User', accessToken);

var alt = require('./alt');
var UserActions = require('./actions/UserActions')(alt, User);
var UserStore = require('./stores/UserStore')(alt, UserActions);

var React = require('react');

var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var ReactBootstrap = require('react-bootstrap');
var Navbar = ReactBootstrap.Navbar;
var Grid = ReactBootstrap.Grid;

var App = React.createClass({

  render() {
    return (
      <div>
        <Navbar brand='HANKI' />
        <Grid>
          <RouteHandler />
        </Grid>
      </div>
    );
  }
});

var LoginPage = require('./components/LoginPage.jsx')(UserStore, UserActions);
var MyPurchaseOrders = require('./components/MyPurchaseOrders.jsx');

var routes = (
  <Route handler={ App } path="/">
    <DefaultRoute handler={ LoginPage } />
    <Route name="login" path="login" handler={ LoginPage } />
    <Route name="my_purchase_orders" path="own" handler={ MyPurchaseOrders }>
      <Route name="new_purchase_order" path="new" handler={ MyPurchaseOrders } />
    </Route>
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
