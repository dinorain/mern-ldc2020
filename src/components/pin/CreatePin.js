import _ from "lodash";
import React, { Fragment } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import blue from "@material-ui/core/colors/blue";

import * as formActions from "../../actions/form";
import * as snackbarActions from "../../actions/snackbar";
import CleanLink from "../misc/CleanLink";

const styles = theme => ({
  passwordField: {
    margin: "0.5em 0"
  },
  button: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 2
  },
  paper: {
    padding: theme.spacing.unit * 3,
    maxHeight: "auto"
  },
  buttonProgress: {
    color: blue[500]
  },
  wallpaper: {
    height: "100vh",
    background: "orange",
    backgroundColor: "rgb(6, 124, 108)",
    // backgroundImage: `url(${Smokey})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  }
});

const SUBMITTED = "SUBMITTED",
  SUBMITTING = "SUBMITTING",
  IDLE = "IDLE";
const VERIFYING = "VERIFYING",
  VERIFIED = "VERIFIED",
  INVALID = "INVALID";

const INITIAL_STATE = {
  submitStatus: IDLE,
  pinStatus: VERIFYING,
  pinError: ""
};

class CreatePin extends React.Component {
  state = INITIAL_STATE;

  componentDidMount() {
    this.checkPinSet();
  }

  checkPinSet = () => {
    const { formId } = this.props.match.params;
    this.props.checkPinSet(formId, (error, payload) => {
      if (error) {
        console.log({ error });
        return this.setState({
          pinStatus: INVALID,
          pinError: _.get(
            error,
            "response.data.error.msg",
            "Error on checking.."
          )
        });
      }
      if (payload.set) {
        return this.setState({
          pinStatus: INVALID,
          pinError: "Pin already set!"
        });
      } else if (!payload.set) {
        this.setState({ pinStatus: VERIFIED });
      }
    });
  };

  onSubmit = formProps => {
    const { createPin, errorSnackbar } = this.props;
    const { pin } = formProps;
    const { formId } = this.props.match.params;

    this.setState({ submitStatus: SUBMITTING });
    createPin(formId, pin, (error, payload) => {
      if (error) {
        this.setState({ submitStatus: IDLE });
        return errorSnackbar(
          _.get(error, "response.data.error.msg", `Please try again!`)
        );
      }
      this.setState({ submitStatus: SUBMITTED });
    });
  };

  renderField = field => {
    let { touched, error } = field.meta;
    if (error && Array.isArray(error)) {
      error = error.length
        ? error.map(rule => (
            <li key={rule} style={{ marginLeft: "0.35em" }}>
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

  render() {
    const { classes, handleSubmit } = this.props;
    const { submitStatus, pinStatus, pinError } = this.state;

    return (
      <Fragment>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.wallpaper}
        >
          <Grid item xs={10} sm={6} md={4} lg={3}>
            <Paper elevation={6} className={classes.paper}>
              <Typography variant="h5" align="center">
                Create Pin
              </Typography>
              {pinStatus === VERIFYING ? (
                <div style={{ textAlign: "center", margin: "1.5em" }}>
                  <CircularProgress
                    size={36}
                    className={classes.buttonProgress}
                  />
                  <Typography variant="body1">Checking...</Typography>
                </div>
              ) : pinStatus === INVALID ? (
                <Fragment>
                  <Typography
                    variant="body1"
                    align="center"
                    style={{ margin: "1em 0" }}
                  >
                    {pinError}
                  </Typography>
                  <Typography variant="body1" align="center">
                    <CleanLink to="/main">Back to Homepage</CleanLink>
                  </Typography>
                </Fragment>
              ) : [IDLE, SUBMITTING].includes(submitStatus) ? (
                <Fragment>
                  <Typography
                    component="p"
                    align="center"
                    style={{ margin: "1em 0" }}
                  >
                    Please create a pin, this pin is required for uploading
                    payment receipt and editing your own form.
                  </Typography>
                  <form onSubmit={handleSubmit(this.onSubmit)}>
                    <FormControl component="fieldset" style={{ width: "100%" }}>
                      <FormGroup>
                        <Field
                          name="pin"
                          type="password"
                          label="Pin (6 digits)"
                          component={this.renderField}
                          className={classes.passwordField}
                        />
                        <Field
                          name="confirmPin"
                          type="password"
                          label="Confirm Pin (6 digits)"
                          component={this.renderField}
                          className={classes.passwordField}
                        />
                      </FormGroup>
                    </FormControl>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth={true}
                      className={classes.button}
                      disabled={submitStatus === SUBMITTING}
                    >
                      {submitStatus === SUBMITTING ? (
                        <CircularProgress
                          size={24}
                          className={classes.buttonProgress}
                        />
                      ) : (
                        "Create Pin"
                      )}
                    </Button>
                  </form>
                </Fragment>
              ) : (
                <Fragment>
                  <Typography variant="body1" style={{ margin: "1em 0" }}>
                    Pin created!
                    <br />
                    <br />
                    Further instruction has been sent your email(s).
                  </Typography>
                  <Typography variant="body1" align="center">
                    <CleanLink to="/main">Back to Homepage</CleanLink>
                  </Typography>
                </Fragment>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

function validate(values) {
  const errors = {};
  const { pin, confirmPin } = values;

  const validatePinDigit = pin => /^[0-9]+$/.test(pin);
  const validatePinLength = pin => /^.{6}$/.test(pin);

  if (!pin) errors.pin = "Please provide a pin!";
  else if (!validatePinDigit(pin)) errors.pin = "Must be digits!";
  else if (!validatePinLength(pin)) errors.pin = "Must be 6 in length!";

  if (!confirmPin) errors.confirmPin = "Please rewrite your pin!";
  else if (pin !== confirmPin) errors.confirmPin = "Pins doesn't match";

  return errors;
}

export default compose(
  withStyles(styles),
  reduxForm({ validate, form: "CreatePin" }),
  connect(
    null,
    { ...formActions, ...snackbarActions }
  )
)(CreatePin);
