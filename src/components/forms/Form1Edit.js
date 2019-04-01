import _ from "lodash";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import { Fade } from "react-reveal";

import * as eventActions from "../../actions/event";
import * as formActions from "../../actions/form";
import * as snackbarActions from "../../actions/snackbar";
import CleanLink from "../misc/CleanLink";
import PinLoginDialog from "./PinLoginDialog";

const styles = theme => ({
  wallpaper: {
    display: "block",
    position: "fixed",
    left: "0",
    top: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-10",
    backgroundColor: "rgb(6, 124, 108)",
    // backgroundImage: `url(${Smokey})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  topDisplay: {
    minHeight: "100vh"
  },
  title: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    marginTop: "1.5em"
  },
  paper: {
    padding: "2em",
    margin: "1em 0"
  },
  formGrid: {
    minHeight: "100vh",
    background: "white"
  },
  textField: {
    margin: "0.25em 0"
  },
  submitButton: {
    marginTop: "1.25em"
  },
  divider: {
    margin: "1em 0"
  },
  uploadPaper: {
    padding: "3em",
    textAlign: "center"
  },
  errorPaper: {
    padding: "3em",
    textAlign: "left",
    background: "lightred"
  },
  filename: {
    margin: "1em"
  }
});

const fieldNames = [
  "Class",
  "Line ID",
  "Phone Number",
  "Email",
  "Vegetarian/Non Vegetarian",
  "Personality Test Result"
];

// FETCHING DATA STATUS
const LOADING = "LOADING",
  ERROR = "ERROR",
  DONE = "DONE";
const SUBMITTING = "SUBMITTING",
  IDLE = "IDLE";

class Form1Edit extends React.Component {
  state = {
    status: LOADING,
    submitStatus: IDLE,
    pin: null,
    PinLoginDialog: true
  };

  fetchData = async pin => {
    pin = pin || this.state.pin;
    const { formId } = this.props.match.params;
    const { getFormById } = this.props;
    this.setState({ status: LOADING, pin });
    getFormById(formId, (error, form) => {
      if (error) {
        console.log({ error });
        return this.setState({ status: ERROR });
      }
      this.setState({
        status: DONE
      });
    });
  };

  renderRadio = field => {
    const { error, touched } = field.meta;
    const { classes, ...props } = field;
    return (
      <FormControl component="fieldset" className={classes} required>
        <FormLabel component="legend">{field.label}</FormLabel>
        <RadioGroup {...props} {...field.input} required>
          {field.children}
        </RadioGroup>
        <p>
          {touched ? (
            <span style={{ color: "red" }}>{error}</span>
          ) : (
            <p>&nbsp;</p>
          )}
        </p>
      </FormControl>
    );
  };

  renderMultiField = field => {
    const { error, touched } = field.meta;
    return (
      <div>
        <Typography variant="subtitle1" style={{ color: "gray" }}>
          {field.label}
        </Typography>
        <TextField
          {..._.omit(field, "label")}
          {...field.input}
          autoComplete="off"
          rows="4"
          multiline
          fullWidth
          variant="outlined"
          helperText={
            touched ? (
              <span style={{ color: "red" }}>{error}</span>
            ) : (
              <p>&nbsp;</p>
            )
          }
        />
      </div>
    );
  };

  renderField = field => {
    const { helperText } = field;
    const { error, touched } = field.meta;
    return (
      <TextField
        {...field.input}
        {...field}
        fullWidth
        autoComplete="off"
        helperText={
          touched ? (
            <span style={{ color: "red" }}>{error}</span>
          ) : helperText ? (
            helperText
          ) : (
            <p>&nbsp;</p>
          )
        }
      />
    );
  };

  toggleDialog = stateName => open =>
    this.setState(state => ({
      [stateName]: open === undefined ? !Boolean(state[stateName]) : open
    }));

  onSubmit = formProps => {
    const { pin } = this.state;
    const { formId } = this.props.match.params;
    const formCategoryId = process.env.REACT_APP_FORM_CATEGORY_ID_1;
    const { updateFormById, successSnackbar, errorSnackbar } = this.props;

    const data = {
      uid: `${formCategoryId}#${formProps["Name"].toLowerCase()}`,
      name: `${formProps["Name"]} (${formProps["NIM"]})`,
      recipientEmails: [formProps["Email"].toLowerCase()],
      ...formProps
    };
    const formData = new FormData();
    _.each(data, (value, key) => formData.append(key, value));
    formData.append("pin", pin);

    this.setState({ submitStatus: SUBMITTING });
    updateFormById(formId, formData, (error, form) => {
      this.setState({ submitStatus: IDLE });
      if (error)
        return errorSnackbar(
          _.get(error, "response.data.error.msg", `Please try again!`)
        );
      successSnackbar("Changes saved!");
    });
  };

  render() {
    const { classes, handleSubmit } = this.props;
    const { status, submitStatus, pin } = this.state;

    return pin ? (
      status === DONE ? (
        <div>
          <div className={classes.wallpaper} />

          <Grid
            container
            justify="center"
            alignItems="center"
            className={classes.topDisplay}
          >
            <Grid item sm={10}>
              <Fade bottom>
                <Typography variant="h3" gutterBottom className={classes.title}>
                  Leadership Development Camp 2019
                </Typography>
              </Fade>
              <Fade bottom>
                <Typography variant="subtitle1" className={classes.subtitle}>
                  - Edit Form -
                </Typography>
              </Fade>
            </Grid>
          </Grid>

          <Grid container justify="center" className={classes.formGrid}>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Grid item xs={11}>
                  <form onSubmit={handleSubmit(this.onSubmit)}>
                    <Paper className={classes.paper} elevation={3}>
                      <Grid container justify="center">
                        <Grid item xs={10} sm={6} md={4} lg={4}>
                          <Typography
                            variant="h5"
                            align="center"
                            style={{ margin: "1.25em 0" }}
                          >
                            Edit Form
                          </Typography>

                          <div>
                            <Field
                              name="NIM"
                              type="text"
                              label="NIM"
                              disabled
                              component={this.renderField}
                              className={classes.textField}
                            />
                          </div>

                          <div>
                            <Field
                              name="Name"
                              type="text"
                              label="Name"
                              disabled
                              component={this.renderField}
                              className={classes.textField}
                            />
                          </div>

                          <div>
                            <Field
                              name="Study Program"
                              type="text"
                              label="Study Program"
                              disabled
                              component={this.renderField}
                              className={classes.textField}
                            />
                          </div>

                          <div>
                            <Field
                              name="Class"
                              type="text"
                              label="Class"
                              component={this.renderField}
                              className={classes.textField}
                              required
                            />
                          </div>

                          <div>
                            <Field
                              name="Line ID"
                              type="text"
                              label="Line ID"
                              component={this.renderField}
                              className={classes.textField}
                              required
                            />
                          </div>

                          <div>
                            <Field
                              name="Phone Number"
                              type="number"
                              label="Phone Number"
                              component={this.renderField}
                              className={classes.textField}
                              required
                            />
                          </div>

                          <div>
                            <Field
                              name="Email"
                              type="email"
                              label="Email"
                              component={this.renderField}
                              className={classes.textField}
                              required
                              helperText={
                                "Either student or private email is allowed."
                              }
                            />
                          </div>

                          <br />
                          <br />
                          <div className={classes.radioGroup}>
                            <Field
                              name="Vegetarian/Non Vegetarian"
                              type="text"
                              label="Vegetarian/Non Vegetarian"
                              component={this.renderRadio}
                              required
                            >
                              <FormControlLabel
                                value="Vegetarian"
                                control={<Radio />}
                                label="Vegetarian"
                              />
                              <FormControlLabel
                                value="Non Vegetarian"
                                control={<Radio />}
                                label="Non Vegetarian"
                              />
                            </Field>
                          </div>

                          <div>
                            <Field
                              name="Food Alergic"
                              type="text"
                              label="Food Alergic (Optional)"
                              component={this.renderField}
                              className={classes.textField}
                            />
                          </div>

                          <div>
                            <Field
                              name="Chronic Disease"
                              type="text"
                              label="Chronic Disease (Optional)"
                              component={this.renderField}
                              className={classes.textField}
                            />
                          </div>

                          <div>
                            <Field
                              name="Personality Test Result"
                              type="text"
                              label="Personality Test Result (Ex: ENFJ)"
                              component={this.renderField}
                              className={classes.textField}
                              required
                            />
                            <Typography
                              variant="body2"
                              style={{ color: "#9C9C9C" }}
                            >
                              <p>
                                Take the test{" "}
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href="https://www.16personalities.com/free-personality-test"
                                >
                                  here
                                </a>
                              </p>
                            </Typography>
                          </div>

                          <br />
                          <br />
                          <div>
                            <Field
                              name="Purpose of Joining"
                              type="text"
                              label="Purpose of Joining (Optional)"
                              component={this.renderMultiField}
                            />
                          </div>

                          <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            className={classes.submitButton}
                            disabled={submitStatus === SUBMITTING}
                            fullWidth
                          >
                            {submitStatus === IDLE ? (
                              <Fragment>Save</Fragment>
                            ) : (
                              <CircularProgress size={24} />
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </form>
                </Grid>
              </Grid>

              <Grid container justify="center">
                <Grid item xs={11}>
                  <CleanLink to="/main">
                    <Button
                      type="submit"
                      color="secondary"
                      variant="outlined"
                      className={classes.submitButton}
                      fullWidth
                    >
                      Exit
                    </Button>
                  </CleanLink>
                </Grid>
              </Grid>
              <br />
            </Grid>
          </Grid>
        </div>
      ) : status === ERROR ? (
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
      ) : (
        <CircularProgress
          size={50}
          style={{ display: "block", margin: "1em auto" }}
        />
      )
    ) : (
      <PinLoginDialog
        name="PinLoginDialog"
        state={this.state}
        toggleDialog={this.toggleDialog}
        fetchData={this.fetchData}
      />
    );
  }
}

function validate(values, props) {
  const errors = {};

  for (const fieldName of fieldNames) {
    if (!values[fieldName])
      errors[fieldName] = `Please provide your ${fieldName}!`;
  }

  const emailTest = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
  if (emailTest(values.Email)) errors.Email = "Invalid email address!";

  return errors;
}

function mapStateToProps(state, ownProps) {
  const { form } = state.regForm;

  return {
    initialValues:
      form && form.data
        ? {
            ...form.data
          }
        : {},
    ...form
  };
}

const withStylesDecorated = withStyles(styles)(Form1Edit);
const reduxFormDecorated = reduxForm({
  validate,
  form: "Form1Edit",
  enableReinitialize: true
})(withStylesDecorated);
const connectDecorated = connect(
  mapStateToProps,
  { ...eventActions, ...formActions, ...snackbarActions }
)(reduxFormDecorated);
export default connectDecorated;
