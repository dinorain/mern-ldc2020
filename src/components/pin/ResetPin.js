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
    backgroundColor: "rgb(26, 127, 181)",
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
  tokenStatus: VERIFYING,
  tokenError: ""
};

class ResetPassword extends React.Component {
  state = INITIAL_STATE;

  componentDidMount() {
    this.checkPinToken();
  }

  checkPinToken = () => {
    const { formId, token } = this.props.match.params;
    this.props.checkPinToken(formId, token, error => {
      if (error) {
        console.log({ error });
        return this.setState({
          tokenStatus: INVALID,
          tokenError: _.get(
            error,
            "response.data.error.msg",
            "Token is either expired or invalid!"
          )
        });
      }
      this.setState({ tokenStatus: VERIFIED });
    });
  };

  onSubmit = formProps => {
    const { updatePin, errorSnackbar } = this.props;
    const { newPin } = formProps;
    const { formId, token } = this.props.match.params;

    this.setState({ submitStatus: SUBMITTING });
    updatePin(formId, newPin, token, error => {
      if (error) {
        this.setState({ submitStatus: IDLE });
        return errorSnackbar(`Please try again`);
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
    const { eventId, formCategoryId, formId } = this.props.match.params;
    const { classes, handleSubmit } = this.props;
    const { submitStatus, tokenStatus, tokenError } = this.state;

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
                Reset Form Pin
              </Typography>
              {tokenStatus === VERIFYING ? (
                <div style={{ textAlign: "center", margin: "1.5em" }}>
                  <CircularProgress
                    size={36}
                    className={classes.buttonProgress}
                  />
                  <Typography variant="body1">Verifying token...</Typography>
                </div>
              ) : tokenStatus === INVALID ? (
                <Typography
                  variant="body1"
                  align="center"
                  style={{ margin: "1em 0" }}
                >
                  {tokenError}
                </Typography>
              ) : [IDLE, SUBMITTING].includes(submitStatus) ? (
                <Fragment>
                  <Typography
                    component="p"
                    align="center"
                    style={{ margin: "1em 0" }}
                  >
                    Please provide your new password
                  </Typography>
                  <form onSubmit={handleSubmit(this.onSubmit)}>
                    <FormControl component="fieldset" style={{ width: "100%" }}>
                      <FormGroup>
                        <Field
                          name="newPin"
                          type="password"
                          label="New Pin (6 digits)"
                          component={this.renderField}
                          className={classes.passwordField}
                        />
                        <Field
                          name="confirmNewPin"
                          type="password"
                          label="Confirm New Pin (6 digits)"
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
                        "Reset Pin"
                      )}
                    </Button>
                  </form>
                </Fragment>
              ) : (
                <Fragment>
                  <Typography
                    variant="body1"
                    align="center"
                    style={{ margin: "1em 0" }}
                  >
                    New Pin Saved!
                    <br />
                    You can login now.
                  </Typography>
                  <CleanLink
                    to={`/events/${eventId}/formCategories/${formCategoryId}/forms/${formId}/edit`}
                  >
                    <Button variant="contained" color="primary" fullWidth>
                      Edit form
                    </Button>
                  </CleanLink>
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
  const { newPin, confirmNewPin } = values;

  const validatePinDigit = pin => /^[0-9]+$/.test(pin);
  const validatePinLength = pin => /^.{6}$/.test(pin);

  if (!newPin) errors.newPin = "Please provide a new pin!";
  else if (!validatePinDigit(newPin)) errors.newPin = "Must be digits!";
  else if (!validatePinLength(newPin)) errors.newPin = "Must be 6 in length!";

  if (!confirmNewPin) errors.confirmNewPin = "Please rewrite your pin!";
  else if (newPin !== confirmNewPin)
    errors.confirmNewPin = "Pins doesn't match";

  return errors;
}

export default compose(
  withStyles(styles),
  reduxForm({ validate, form: "ResetPin" }),
  connect(
    null,
    { ...formActions, ...snackbarActions }
  )
)(ResetPassword);
