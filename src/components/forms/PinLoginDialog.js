import _ from "lodash";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reduxForm, Field } from "redux-form";
import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as formActions from "../../actions/form";
import * as snackbarActions from "../../actions/snackbar";
import CleanLink from "../misc/CleanLink";
import ResetPinConfirmationDialog from "./ResetPinConfirmationDialog";

const styles = theme => ({
  textField: {
    margin: "0.5em 0"
  }
});

const SUBMITTING = "SUBMITTING",
  IDLE = "IDLE";

const LOADING = "LOADING",
  ERROR = "ERROR",
  DONE = "DONE";

const INITIAL_STATE = {
  submitStatus: IDLE,
  loadingStatus: LOADING
};

class PinLoginDialog extends React.Component {
  state = INITIAL_STATE;

  toggleDialog = stateName => open =>
    this.setState(state => ({
      [stateName]: open === undefined ? !Boolean(state[stateName]) : open
    }));

  renderField = field => {
    let { touched, error } = field.meta;
    return (
      <TextField
        {...field}
        {...field.input}
        fullWidth
        variant="outlined"
        autoComplete="off"
        helperText={touched ? <div style={{ color: "red" }}>{error}</div> : ""}
      />
    );
  };

  fetchData = async () => {
    const { formId } = this.props.match.params;
    const { getFormById } = this.props;
    getFormById(formId, (error, form) => {
      if (error) {
        return this.setState({ loadingStatus: ERROR });
      }
      this.setState({
        form,
        loadingStatus: DONE
      });
    });
  };

  async componentDidMount() {
    await this.fetchData();
  }

  onSubmit = formProps => {
    const { pin } = formProps;
    const {
      checkPinValid,
      successSnackbar,
      errorSnackbar,
      toggleDialog,
      name,
      fetchData
    } = this.props;
    const { formId } = this.props.match.params;
    this.setState({ submitStatus: SUBMITTING });
    checkPinValid(formId, { pin }, error => {
      this.setState({ submitStatus: IDLE });
      if (error)
        return errorSnackbar(
          _.get(error, "response.data.error.msg", `Please try again!`)
        );
      successSnackbar(`Pin verified.`);
      this.setState(INITIAL_STATE);
      toggleDialog(name)(false);
      fetchData(pin);
    });
  };

  render() {
    const { submitStatus, loadingStatus, form } = this.state;
    const { classes, state, name, handleSubmit } = this.props;

    return (
      <div>
        <Dialog open={Boolean(state[name])} aria-labelledby="form-dialog-title">
          {loadingStatus === ERROR ? (
            <div style={{ textAlign: "center", margin: "1em 0" }}>
              <Typography variant="subtitle1">Failed to fetch data!</Typography>
              <Button
                color="primary"
                className={classes.button}
                onClick={this.fetchData}
              >
                Retry
              </Button>
            </div>
          ) : loadingStatus === DONE ? (
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <DialogTitle
                id="form-dialog-title"
                style={{ textAlign: "center" }}
              >
                Pin Login
              </DialogTitle>
              <DialogContent>
                <Field
                  name="pin"
                  type="password"
                  label="Pin (6 digits)"
                  component={this.renderField}
                  className={classes.textField}
                  style={{ flexGrow: "1" }}
                  disabled={submitStatus === SUBMITTING}
                />
                <br />
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={submitStatus === SUBMITTING}
                  fullWidth
                >
                  {submitStatus === IDLE ? (
                    "Enter"
                  ) : (
                    <CircularProgress size={24} />
                  )}
                </Button>
                <Typography
                  variant="subtitle2"
                  style={{ paddingTop: "1em", textAlign: "center" }}
                >
                  Forgot your pin?{" "}
                  <CleanLink
                    onClick={() =>
                      this.toggleDialog("ResetPinConfirmationDialog")(true)
                    }
                  >
                    Request a pin reset.
                  </CleanLink>
                </Typography>
                <Typography variant="subtitle2" style={{ textAlign: "center" }}>
                  Don't have a pin yet?{" "}
                  <CleanLink
                    to={`/events/${form.event._id}/formCategories/${
                      form.formCategory._id
                    }/forms/${form._id}/createPin`}
                  >
                    Create a pin.
                  </CleanLink>
                </Typography>
              </DialogContent>
            </form>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "200px",
                minHeight: "200px"
              }}
            >
              <CircularProgress size={36} />
            </div>
          )}
        </Dialog>
        <ResetPinConfirmationDialog
          name="ResetPinConfirmationDialog"
          state={this.state}
          toggleDialog={this.toggleDialog}
        />
      </div>
    );
  }
}
function validate(values, props) {
  const errors = {};
  const { pin } = values;
  const validatePinDigit = pin => /^[0-9]+$/.test(pin);
  const validatePinLength = pin => /^.{6}$/.test(pin);
  if (!pin) errors.pin = "Please provide a pin!";
  else if (!validatePinDigit(pin)) errors.pin = "Must be digits!";
  else if (!validatePinLength(pin)) errors.pin = "Must be 6 in length!";
  return errors;
}
export default compose(
  withStyles(styles),
  reduxForm({ validate, form: "PinLoginDialog" }),
  connect(
    null,
    { ...formActions, ...snackbarActions }
  ),
  withRouter
)(PinLoginDialog);
