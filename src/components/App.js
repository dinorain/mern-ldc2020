import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

import Snackbar from "./misc/Snackbar";
import MainIndex from "./main/Index";
import Form1 from "./forms/Form1";
import Form1Edit from "./forms/Form1Edit";
import CreatePin from "./pin/CreatePin";
import ResetPin from "./pin/ResetPin";
import PaymentReceipt from "./forms/PaymentReceipt";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Fragment>
          <Snackbar />
          <Switch>
            <Route path="/main" component={MainIndex} />

            <Route
              path={`/events/:eventId/formCategories/:formCategoryId/forms/:formId/createPin`}
              component={CreatePin}
            />
            <Route
              path={`/events/:eventId/formCategories/:formCategoryId/forms/:formId/paymentReceipt`}
              component={PaymentReceipt}
            />
            <Route
              path={`/events/:eventId/formCategories/:formCategoryId/forms/:formId/resetPin/token/:token`}
              component={ResetPin}
            />

            <Route
              path={`/events/${process.env.REACT_APP_EVENT_ID}/formCategories/${
                process.env.REACT_APP_FORM_CATEGORY_ID_1
              }/register`}
              component={Form1}
            />

            <Route
              path={`/events/${process.env.REACT_APP_EVENT_ID}/formCategories/${
                process.env.REACT_APP_FORM_CATEGORY_ID_1
              }/forms/:formId/edit`}
              component={Form1Edit}
            />

            <Route path="*" component={() => <Redirect to="/main" />} />
          </Switch>
        </Fragment>
      </BrowserRouter>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.auth
  };
}

export default connect(mapStateToProps)(App);
