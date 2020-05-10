import _ from "lodash";
import moment from "moment";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import { reduxForm, getFormValues, Field } from "redux-form";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import MuiPhoneNumber from "material-ui-phone-number";

import Logo from "../../res/images/logos/LDC_LOGO_landscape.png";

import {
  Typography,
  TextField,
  Button,
  FormControl,
  MenuItem,
  CircularProgress,
} from '@material-ui/core';
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
    backgroundColor: "rgb(0, 0, 0)",
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
    padding: "2em 1em",
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
  "Gender",
  "LINE ID",
  "Phone Number",
  "Student Email",
  "Birthdate",
  "Parent/Guardian",
  "Vegetarian",
  "Fasting",
  "MBTI Personality Test Result"
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
    PinLoginDialog: true,
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
    personality2: "",
    purpose: "",
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

  renderMenuItem = field => {
    const { error, touched } = field.meta;
    const { classes, ...props } = field;
    return (
      <TextField 
        fullWidth 
        select 
        label={field.label}
        className={classes}
        style={{ flexGrow: 1, marginBottom: "1.5em" }}
        required
        helperText={
          touched ? (
            <span style={{ color: "red" }}>{error}</span>
          ) : (
            <p>&nbsp;</p>
          )
        }
      >
        <MenuItem {...props} {...field.input} required>
          {field.children}
        </MenuItem>
      </TextField>
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

  onPersonalityChange = e => {
    this.setState({ personality: e.target.value });

    // this.setState({ personality: e.target.value }, () => {
    //   console.log(`Before: ${this.state.personality}`);
    //   this.setState({ personality: this.state.personality }, () => {
    //     console.log(`Before: ${this.state.personality}`);
    //   });
    // }); 
  };

  onBirthdateChange = e => {
    this.setState({ birthdate: e.target.value });
  };

  onGenderChange = e => {
    this.setState({ gender: e.target.value });
  };

  onParentGuardianChange = e => {
    this.setState({ parentGuardian: e.target.value });
  };

  onPhoneNumberChange = e => {
    this.setState({ phoneNumber: e });
  };


  onSubmit = formProps => {
    const { pin } = this.state;
    const { formId } = this.props.match.params;
    const formCategoryId = process.env.REACT_APP_FORM_CATEGORY_ID_1;
    const { updateFormById, successSnackbar, errorSnackbar } = this.props;


    const formData = new FormData();

    this.setState({ gender: this.state.gender }, () => {
      formData.delete("Gender");
      formData.append("Gender", this.state.gender);
    }); 

    this.setState({ birthdate: this.state.birthdate }, () => {
      formData.delete("Birthdate");
      formData.append("Birthdate", this.state.birthdate);
    }); 

    this.setState({ gender: this.state.gender }, () => {
      formData.delete("Gender");
      formData.append("Gender", this.state.gender);
    }); 

    this.setState({ personality: this.state.personality }, () => {
      formData.delete("MBTI");
      formData.append("MBTI", this.state.personality);
    }); 
    

    const data = {
      uid: `${formCategoryId}#${this.state.nim}`,
      name: `${this.state.name} (${this.state.nim})`,
      recipientEmails: [formProps["Email"].toLowerCase()],
      "NIM": this.state.nim,
      "Name": this.state.name,
      "Study Program": this.state.studyProgram,
      "Class": formProps["Email"],
      "LINE ID": formProps["LINE ID"],
      "Phone Number": this.state.phoneNumber,
      "Parent/Guardian": formProps["Parent/Guardian"],
      "Vegetarian": formProps["Vegetarian"],
      "Fasting": formProps["Fasting"],
      "Food Allergy": formProps["Food Allergy"],
      "Chronic Disease": formProps["Chronic Disease"],
      "Purpose of Joining": formProps["Purpose of Joining"],
      ...formProps
    };
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

    const { classes, handleSubmit, formValues } = this.props;
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
            <Grid item sm={6}>
              <Fade bottom>
                <img alt="LDC_2020" src={Logo} style={{ width: "100%" }} />
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
                        <Grid item xs={11} sm={6} md={4} lg={4}>
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
                              style={{ marginBottom: "1.5em" }}
                              component={this.renderField}
                              className={classes.textField}
                              required
                              helperText="e.g: 18M3"
                            />
                          </div>

                          <div className={classes.textField}>
                            <TextField
                              name="Gender" 
                              fullWidth 
                              select 
                              label="Gender"
                              value={ this.state.gender !== '' ? this.state.gender: formValues["Gender"] } 
                              className={classes.textField}
                              style={{ flexGrow: 1, marginBottom: "1.5em" }}
                              onChange={this.onGenderChange}
                              required
                            >
                              <MenuItem name="Gender" value="Male">Male</MenuItem>
                              <MenuItem name="Gender" value="Female">Female</MenuItem>
                            </TextField>
                          </div>

                          <div>
                            <Field
                              name="LINE ID"
                              type="text"
                              label="LINE ID"
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
                              value={ this.state.phoneNumber !== '' ? this.state.phoneNumber: formValues["Phone Number"] } 
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
                              required
                            />
                          </div>

                          <div>
                            <TextField
                              name="Birthdate"
                              label="Birthdate"
                              fullWidth
                              type="date"
                              style={{ marginBottom: "1.5em" }}
                              value={ this.state.birthdate !== '' ? moment(this.state.birthdate).format("YYYY-MM-DD") : moment(formValues["Birthdate"]).format("YYYY-MM-DD")}
                              className={classes.textField}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={this.onBirthdateChange}
                              required
                            />

                          </div>

                          <div>
                            <Field
                              name="Parent/Guardian" 
                              label="Parent/Guardian"
                              type="text"
                              style={{ marginBottom: "1.5em" }}
                              component={this.renderField}
                              className={classes.textField}
                              required
                              helperText="e.g. +628227328xxx - Budi - Parent"
                            />
                          </div>

                          

                          <div className={classes.radioGroup}>
                            <Field
                              name="Vegetarian"
                              type="text"
                              label="Vegetarian/Non Vegetarian"
                              component={this.renderRadio}
                              style={{ marginBottom: "1.5em" }}
                              required
                            >
                              <FormControlLabel
                                name="Vegetarian"
                                value="Vegetarian"
                                control={<Radio />}
                                label="Vegetarian"
                              />
                              <FormControlLabel
                                name="Vegetarian"
                                value="Non Vegetarian"
                                control={<Radio />}
                                label="Non Vegetarian"
                              />
                            </Field>
                          </div>

                          <div className={classes.radioGroup}>
                            <Field
                              name="Fasting"
                              type="text"
                              label="Fasting/Not Fasting (Puasa/Tidak)"
                              component={this.renderRadio}
                              required
                            >
                              <FormControlLabel
                                name="Fasting"
                                value="Fasting"
                                control={<Radio />}
                                label="Fasting (Puasa)"
                              />
                              <FormControlLabel
                                name="Fasting"
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

                          <div className={classes.textField}>
                            <TextField
                              name="MBTI" 
                              fullWidth 
                              select 
                              label="MBTI Personality Test Result"
                              value={ this.state.personality !== '' ? this.state.personality: formValues["MBTI"] } 
                              className={classes.textField}
                              style={{ flexGrow: 1 }}
                              onChange={this.onPersonalityChange}
                              required
                            >
                              <MenuItem name="MBTI" value="INTJ">INTJ</MenuItem>
                              <MenuItem name="MBTI" value="INTP">INTP</MenuItem>
                              <MenuItem name="MBTI" value="ENTJ">ENTJ</MenuItem>
                              <MenuItem name="MBTI" value="ENTP">ENTP</MenuItem>
                              <MenuItem name="MBTI" value="INFJ">INFJ</MenuItem>
                              <MenuItem name="MBTI" value="INFP">INFP</MenuItem>
                              <MenuItem name="MBTI" value="ENFJ">ENFJ</MenuItem>
                              <MenuItem name="MBTI" value="ENFP">ENFP</MenuItem>
                              <MenuItem name="MBTI" value="ISTJ">ISTJ</MenuItem>
                              <MenuItem name="MBTI" value="ISFJ">ISFJ</MenuItem>
                              <MenuItem name="MBTI" value="ESTJ">ESTJ</MenuItem>
                              <MenuItem name="MBTI" value="ESFJ">ESFJ</MenuItem>
                              <MenuItem name="MBTI" value="ISTP">ISTP</MenuItem>
                              <MenuItem name="MBTI" value="ISFP">ISFP</MenuItem>
                              <MenuItem name="MBTI" value="ESTP">ESTP</MenuItem>
                              <MenuItem name="MBTI" value="ESFP">ESFP</MenuItem>
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
            ...form.data,
          }
        : {},
    ...form,
    formValues: getFormValues('Form1Edit')(state),
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
