import _ from "lodash";
import React, { Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { reduxForm, Field } from "redux-form";
import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as formActions from "../../actions/form";
import * as snackbarActions from "../../actions/snackbar";
import CleanLink from "../misc/CleanLink";
import ResetPinConfirmationDialog from "./ResetPinConfirmationDialog";

const styles = theme => ({
  textField: {
    margin: "0.5em 0"
  },
  formControl: {
    width: "100%"
  }
});

const SUBMITTING = "SUBMITTING",
  IDLE = "IDLE";

const INITIAL_STATE = {
  submitStatus: IDLE
};

class PinLoginDialog extends React.Component {
  state = INITIAL_STATE;

  toggleDialog = stateName => open =>
    this.setState(state => ({
      [stateName]: open === undefined ? !Boolean(state[stateName]) : open
    }));

  renderField = field => {
    let { touched, error } = field.meta;
    if (error && Array.isArray(error)) {
      error = error.length
        ? error.map(rule => (
            <li key={rule} style={{ marginLeft: "1.2em", color: "red" }}>
              {rule}
            </li>
          ))
        : null;
    }
    return (
      <TextField
        {...field}
        {...field.input}
        fullWidth
        autoComplete="off"
        helperText={touched ? <div style={{ color: "red" }}>{error}</div> : ""}
      />
    );
  };

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
    const { submitStatus } = this.state;
    const { classes, state, name, handleSubmit } = this.props;

    return (
      <div>
        <Dialog open={Boolean(state[name])} aria-labelledby="form-dialog-title">
          <Fragment>
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <DialogTitle id="form-dialog-title">Pin Login</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  <Typography variant="subtitle1">Enter your pin</Typography>
                </DialogContentText>
                <FormControl
                  component="fieldset"
                  className={classes.formControl}
                >
                  <FormGroup>
                    <Field
                      name="pin"
                      type="password"
                      label="Pin (6 digits)"
                      component={this.renderField}
                      className={classes.textField}
                    />
                  </FormGroup>
                  <br />
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={submitStatus === SUBMITTING}
                    fullWidth
                  >
                    {submitStatus === IDLE ? (
                      <Fragment>Login</Fragment>
                    ) : (
                      <CircularProgress size={24} />
                    )}
                  </Button>
                </FormControl>
                <div style={{ paddingTop: "1em", textAlign: "center" }}>
                  Forgot your pin?{" "}
                  <CleanLink
                    onClick={() =>
                      this.toggleDialog("ResetPinConfirmationDialog")(true)
                    }
                  >
                    Request a pin reset.
                  </CleanLink>
                </div>
              </DialogContent>
            </form>
          </Fragment>
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
