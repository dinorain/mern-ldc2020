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
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import MenuItem from '@material-ui/core/MenuItem';
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MuiPhoneNumber from "material-ui-phone-number";
import {
  Close as CloseIcon,
  Done as DoneIcon,
  Send as SendIcon
} from "@material-ui/icons";

import * as eventActions from "../../actions/event";
import * as formActions from "../../actions/form";
import * as snackbarActions from "../../actions/snackbar";

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
    padding: "2em 1em",
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
  },
  formcontrol: {
    margin: "1.25em"
  }
});

const fieldNames = [
  "Class",
  "Gender",
  "LINE ID",
  "Phone Number",
  "Student Email",
  "Birthdate",
  "Parent/Gurdian",
  "Vegetarian/Non Vegetarian",
  "Fasting/Not Fasting",
  "MBTI Personality Test Result"
];

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
    email: "",
    phoneNumber: "",
    phoneNumber2: "",
    lineId: "",
    gender: "",
    birthdate: "",
    parentGuardian: "",
    vegetarian: "",
    fasting: "",
    foodAllergy: "",
    chronicDisease: "",
    personality: "",
    purpose: "",
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
      this.setState({ status: DONE });
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

  renderField2 = field => {
    const { helperText } = field;
    const { error, touched } = field.meta;
    return (
      <TextField
        {...field.input}
        {...field}
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
        submitInfo: "Please provide your NIM!"
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

  onPersonalityChange = e => {
    this.setState({ personality: e.target.value });
  };

  onBirthdateChange = e => {
    this.setState({ birthdate: e.target.value });
  };

  onGenderChange = e => {
    this.setState({ gender: e.target.value });
  };

  onPhoneNumberChange = e => {
    this.setState({ phoneNumber: e });
  };

  onPhoneNumber2Change = e => {
    this.setState({ phoneNumber2: e });
  };

  onParentGuardianChange = e => {
    this.setState({ parentGuardian: e.target.value });
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
      "NIM": this.state.nim,
      "Name": this.state.name,
      "Study Program": this.state.studyProgram,
      "Class": formProps["Email"],
      "Gender": this.state.gender,
      "LINE ID": formProps["LINE ID"],
      "Phone Number": this.state.phoneNumber,
      "Birthdate": this.state.birthdate,
      "Parent/Guardian": `${this.state.phoneNumber2} - ${formProps["NameOfParent/Guardian"]} - ${this.state.parentGuardian}`,
      "Vegetarian": formProps["Vegetarian/Non Vegetarian"],
      "Fasting": formProps["Fasting/Not Fasting"],
      "Food Allergy": formProps["Food Allergy"],
      "Chronic Disease": formProps["Chronic Disease"],
      "MBTI": this.state.personality,
      "Purpose of Joining": formProps["Purpose of Joining"],
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
              <Grid item xs={11} sm={6} md={4} lg={4}>
              <Fragment>
                    <Typography
                      variant="h5"
                      align="center"
                      style={{ margin: "1.25em 0", color: "rgb(0, 0, 0)" }}
                    >
                      Please fill in the form
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center"
                      }}
                    >
                      <TextField
                        name="NIM"
                        type="text"
                        label="NIM"
                        required
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
                        name="Name"
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
                        name="Study Program"
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
                        style={{ marginBottom: "1.5em" }}
                        component={this.renderField}
                        className={classes.textField}
                        value={this.state.class} 
                        required
                        helperText="e.g: 18M3"
                      />
                    </div>

                    <div>
                    <TextField 
                        name="Gender" 
                        fullWidth 
                        select 
                        label="Gender"
                        value={this.state.gender} 
                        className={classes.textField}
                        style={{ flexGrow: 1, marginBottom: "1.5em" }}
                        onChange={this.onGenderChange}
                        required
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                      </TextField>
                    </div>

                    <div>
                      <Field
                        name="LINE ID"
                        type="text"
                        label="LINE ID"
                        value={this.state.lineId} 
                        component={this.renderField}
                        className={classes.textField}
                        required
                      />
                    </div>

                    <div>
                      <MuiPhoneNumber
                        name="Phone Number"
                        label="Phone Number"
                        defaultCountry={'id'}
                        onlyCountry={'id'}
                        countryCodeEditable={false}
                        disableDropdown={true}
                        fullWidth
                        style={{ margin: "1.5em 0" }}
                        required
                        onChange={this.onPhoneNumberChange}
                      />
                    </div>

                    <div>
                      <Field
                        name="Email"
                        type="email"
                        label="Student Email"
                        style={{ marginBottom: "1.5em" }}
                        component={this.renderField}
                        className={classes.textField}
                        value={this.state.email} 
                        required
                        
                      />
                    </div>

                    <div>
                      <TextField
                        name="Birthdate"
                        label="Birthdate"
                        type="date"
                        fullWidth
                        style={{ marginBottom: "1.5em" }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={this.onBirthdateChange}
                        required
                      />
                    </div>
                    

                    <fieldset style={{ padding: "0 1em", margin: "1.5em 0 3em 0" }}>
                      <legend style={{ padding: "0 0.5em", color:"grey" }}>Parent/Guardian</legend>
                      <div>
                        <div className="d-flex">

                        <div className={classes.textField}>
                            <TextField
                              name="Parent/Guardian" 
                              label="Parent/Guardian"
                              fullWidth
                              select 
                              className={classes.textField}
                              style={{ flexGrow: 1, marginBottom: "1em" }}
                              value={this.state.parentGuardian} 
                              onChange={this.onParentGuardianChange}
                              required
                            >
                              <MenuItem name="Parent/Guardian" value="Parent">Parent</MenuItem>
                              <MenuItem name="Parent/Guardian" value="Guardian">Guardian</MenuItem>
                            </TextField>
                          </div>

                          <Field
                            name="NameOfParent/Guardian"
                            type="text"
                            label="Name"
                            component={this.renderField}
                            className={classes.textField}
                            required
                          />

                          <MuiPhoneNumber
                            name="PhoneNumberOfParent/Guardian"
                            label="Phone Number"
                            defaultCountry={'id'}
                            onlyCountry={'id'}
                            countryCodeEditable={false}
                            disableDropdown={true}
                            fullWidth
                            style={{ margin: "1.5em 0" }}
                            required
                            onChange={this.onPhoneNumber2Change}
                          />
                        </div>
                      </div>
                    </fieldset>

                    <div className={classes.radioGroup}>
                      <Field
                        name="Vegetarian/Non Vegetarian"
                        type="text"
                        label="Vegetarian/Non Vegetarian"
                        component={this.renderRadio}
                        style={{ marginBottom: "1.5em" }}
                        value={this.state.vegetarian} 
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

                    <div className={classes.radioGroup}>
                      <Field
                        name="Fasting/Not Fasting"
                        type="text"
                        label="Fasting/Not Fasting (Puasa/Tidak)"
                        component={this.renderRadio}
                        value={this.state.fasting} 
                        required
                      >
                        <FormControlLabel
                          value="Fasting"
                          control={<Radio />}
                          label="Fasting (Puasa)"
                        />
                        <FormControlLabel
                          value="Not Fasting"
                          control={<Radio />}
                          label="Not Fasting (Tidak Puasa)"
                        />
                      </Field>
                    </div>

                    <div>
                      <Field
                        name="Food Allergy"
                        type="text"
                        label="Food Allergy (Optional)"
                        component={this.renderField}
                        className={classes.textField}
                        value={this.state.foodAllergy} 
                      />
                    </div>

                    <div>
                      <Field
                        name="Chronic Disease"
                        type="text"
                        label="Chronic Disease (Optional)"
                        component={this.renderField}
                        className={classes.textField}
                        value={this.state.chronicDisease} 
                      />
                    </div>

                    <div>
                      <TextField 
                        name="MBTI" 
                        fullWidth 
                        select 
                        label="MBTI Personality Test Result"
                        value={this.state.personality} 
                        className={classes.textField}
                        style={{ flexGrow: 1 }}
                        onChange={this.onPersonalityChange}
                        required
                      >
                        <MenuItem value="INTJ">INTJ</MenuItem>
                        <MenuItem value="INTP">INTP</MenuItem>
                        <MenuItem value="ENTJ">ENTJ</MenuItem>
                        <MenuItem value="ENTP">ENTP</MenuItem>
                        <MenuItem value="INFJ">INFJ</MenuItem>
                        <MenuItem value="INFP">INFP</MenuItem>
                        <MenuItem value="ENFJ">ENFJ</MenuItem>
                        <MenuItem value="ENFP">ENFP</MenuItem>
                        <MenuItem value="ISTJ">ISTJ</MenuItem>
                        <MenuItem value="ISFJ">ISFJ</MenuItem>
                        <MenuItem value="ESTJ">ESTJ</MenuItem>
                        <MenuItem value="ESFJ">ESFJ</MenuItem>
                        <MenuItem value="ISTP">ISTP</MenuItem>
                        <MenuItem value="ISFP">ISFP</MenuItem>
                        <MenuItem value="ESTP">ESTP</MenuItem>
                        <MenuItem value="ESFP">ESFP</MenuItem>
                      </TextField>

                      <Typography variant="body2" style={{ color: "#9C9C9C", marginBottom: "1.5em" }}>
                        <p>
                          Take a MBTI personality test{" "}
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
                        <Fragment>
                          Submit <SendIcon style={{ marginLeft: "0.5em" }} />
                        </Fragment>
                      ) : (
                        <CircularProgress size={24} />
                      )}
                    </Button>
                  </Fragment>
              </Grid>
            </Grid>
            <Typography
              variant="body2"
              align="center"
              gutterBottom
              style={{ color: "black", marginTop: "2em", fontWeight: "bold" }}
            >
              If you encounter any issues, please feel free to contact us at BEM
              UPHMC Official Line Account @bemuphmedan.
            </Typography>
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
    // value && !/^[a-zA-Z0-9_.+-]+@(?:(?:[a-zA-Z0-9-]+\.)?[a-zA-Z]+\.)?(student.uph.edu)$/i.test(value);
  if (emailTest(values.Email)) errors.Email = "Invalid student email address!";

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
