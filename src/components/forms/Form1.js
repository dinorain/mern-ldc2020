import _ from "lodash";
import regApi from "../../apis/registration";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {
  Close as CloseIcon,
  Done as DoneIcon,
  Send as SendIcon
} from "@material-ui/icons";

import * as eventActions from "../../actions/event";
import * as formActions from "../../actions/form";
import * as snackbarActions from "../../actions/snackbar";
import Smokey from "../../res/images/smokey.jpg";

const styles = theme => ({
  wallpaper: {
    display: "block",
    position: "fixed",
    left: "0",
    top: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-10",
    backgroundImage: `url(${Smokey})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%"
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
    margin: "2em 0"
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
  submitInfo: {
    marginBottom: "1.5em",
    color: "red"
  }
});

const fieldNames = ["Class", "Phone Number", "Email", "Line ID"];

// FETCHING DATA STATUS
const LOADING = "LOADING",
  ERROR = "ERROR",
  DONE = "DONE";
const SUBMITTING = "SUBMITTING",
  IDLE = "IDLE";
const AVAILABLE = "AVAILABLE",
  CHECKING = "CHECKING",
  UNAVAILABLE = "UNAVAILABLE";

class Form1 extends React.Component {
  state = {
    status: LOADING,
    submitStatus: IDLE,
    nim: "",
    name: "",
    studyProgram: "",
    submitInfo: " ",
    checkingStatus: null
  };

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    this.setState({ status: LOADING });
    const { getEvent } = this.props;
    getEvent((error, { event }) => {
      if (error) {
        console.log({ error });
        return this.setState({ status: ERROR });
      }
      console.log({ event });
      this.setState({ status: DONE });
    });
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

  verifyEmailAvailbility = _.debounce(async () => {
    const nim = this.state.nim.trim();
    if (!nim)
      return this.setState({
        checkingStatus: UNAVAILABLE,
        submitInfo: "Please provde your NIM!"
      });
    try {
      this.setState({ checkingStatus: CHECKING, submitInfo: " " });
      const { data: student } = await regApi().post(`/students/nim/get`, {
        nim
      });
      if (nim !== this.state.nim.trim()) return;
      if (student) {
        this.setState({
          checkingStatus: AVAILABLE,
          name: student.name,
          studyProgram: student.studyProgram
        });
      } else {
        this.setState({
          checkingStatus: UNAVAILABLE,
          submitInfo: "NIM not found!"
        });
      }
    } catch (error) {
      console.log({ error });
      this.setState({
        checkingStatus: UNAVAILABLE,
        submitInfo: "Can't verify NIM!"
      });
    }
  }, 500);

  onTextChange = e => {
    this.setState({ nim: e.target.value, checkingStatus: null });
    this.verifyEmailAvailbility();
  };

  onSubmit = formProps => {
    const eventId = process.env.REACT_APP_EVENT_ID;
    const formCategoryId = process.env.REACT_APP_FORM_CATEGORY_ID_1;
    const { createForm, errorSnackbar } = this.props;
    const { checkingStatus } = this.state;

    if (checkingStatus !== AVAILABLE) {
      return errorSnackbar("NIM not found!");
    }

    const newForm = {
      uid: `${formCategoryId}#${this.state.nim}`,
      name: `${this.state.name} (${this.state.nim})`,
      recipientEmails: [formProps["Email"].toLowerCase()],
      NIM: this.state.nim,
      Name: this.state.name,
      "Study Program": this.state.studyProgram,
      ...formProps
    };
    const formData = new FormData();
    _.each(newForm, (value, key) => formData.append(key, value));

    this.setState({ submitStatus: SUBMITTING });
    createForm({ eventId, formCategoryId, formData }, (error, form) => {
      this.setState({ submitStatus: IDLE });
      if (error)
        return errorSnackbar(
          _.get(error, "response.data.error.msg", `Please try again!`)
        );
      this.props.history.push(
        `/events/${process.env.REACT_APP_EVENT_ID}/formCategories/${
          process.env.REACT_APP_FORM_CATEGORY_ID_1
        }/forms/${form._id}/createPin`
      );
    });
  };

  render() {
    const { classes, handleSubmit, event } = this.props;
    const { status, submitStatus, checkingStatus, submitInfo } = this.state;

    return status === DONE && event && event.forms && event.formCategories ? (
      <div>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <Paper className={classes.paper} elevation={3}>
            <Grid container justify="center">
              <Grid item xs={9} sm={6} md={3} lg={3}>
                {event.forms.length >= event.formCategories[0].seatCount ? (
                  <Typography
                    variant="h5"
                    align="center"
                    style={{ margin: "1.25em 0" }}
                  >
                    Sorry, the registration is already full.
                  </Typography>
                ) : (
                  <Fragment>
                    <Typography
                      variant="h5"
                      align="center"
                      style={{ margin: "1.25em 0" }}
                    >
                      Please fill in the form.
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <TextField
                        name="nim"
                        type="text"
                        label="NIM"
                        className={classes.textField}
                        style={{ flexGrow: 1 }}
                        onChange={this.onTextChange}
                        autoComplete="off"
                      />
                      {checkingStatus === AVAILABLE ? (
                        <DoneIcon style={{ color: "green" }} />
                      ) : checkingStatus === UNAVAILABLE ? (
                        <CloseIcon style={{ color: "red" }} />
                      ) : checkingStatus === CHECKING ? (
                        <CircularProgress size={20} />
                      ) : null}
                    </div>
                    <Typography variant="body1" className={classes.submitInfo}>
                      {submitInfo}
                    </Typography>

                    <div>
                      <TextField
                        name="name"
                        type="text"
                        label="Name"
                        value={this.state.name}
                        className={classes.textField}
                        style={{ marginBottom: "1.5em" }}
                        fullWidth
                        disabled
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <TextField
                        name="studyProgram"
                        type="text"
                        label="Study Program"
                        value={this.state.studyProgram}
                        className={classes.textField}
                        style={{ marginBottom: "1.5em" }}
                        disabled
                        fullWidth
                        autoComplete="off"
                      />
                    </div>

                    <div>
                      <Field
                        name="Class"
                        type="text"
                        label="Class"
                        component={this.renderField}
                        className={classes.textField}
                      />
                    </div>

                    <div>
                      <Field
                        name="Phone Number"
                        type="number"
                        label="Phone Number"
                        component={this.renderField}
                        className={classes.textField}
                      />
                    </div>

                    <div>
                      <Field
                        name="Email"
                        type="email"
                        label="Email"
                        component={this.renderField}
                        className={classes.textField}
                        helperText={
                          "Either student or private email is allowed."
                        }
                      />
                    </div>

                    <div>
                      <Field
                        name="Line ID"
                        type="text"
                        label="Line ID"
                        component={this.renderField}
                        className={classes.textField}
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
                        <Fragment>
                          Submit <SendIcon style={{ marginLeft: "0.5em" }} />
                        </Fragment>
                      ) : (
                        <CircularProgress size={24} />
                      )}
                    </Button>
                  </Fragment>
                )}
              </Grid>
            </Grid>
          </Paper>
        </form>
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
  return { event: state.event.event };
}

const withStylesDecorated = withStyles(styles)(Form1);
const reduxFormDecorated = reduxForm({ validate, form: "Form1" })(
  withStylesDecorated
);
const connectDecorated = connect(
  mapStateToProps,
  { ...eventActions, ...formActions, ...snackbarActions }
)(reduxFormDecorated);
export default withRouter(connectDecorated);
