import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Fade } from "react-reveal";

import * as eventActions from "../../actions/event";
import * as formActions from "../../actions/form";
import * as snackbarActions from "../../actions/snackbar";
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
  paper: {
    padding: "2em",
    margin: "1em 0"
  },
  formGrid: {
    minHeight: "100vh",
    background: "white"
  },
  formGroup: {
    marginTop: "2.5em",
    marginBottom: "3em"
  },
  textField: {
    // margin: '0.2em 0',
  },
  radioGroup: {
    marginTop: "0.75em"
  },
  submitButton: {
    marginTop: "1em"
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

// FETCHING DATA STATUS
const LOADING = "LOADING",
  ERROR = "ERROR",
  DONE = "DONE";

class PaymentReceipt extends React.Component {
  state = {
    uploadedOnce: false,
    status: LOADING,
    uploadStatus: null,
    PinLoginDialog: true,
    pin: null,
    imageUrl: null
  };

  handleFileChange = async e => {
    const { pin } = this.state;
    const { formId } = this.props.match.params;
    const { updatePaymentReceiptById, successSnackbar } = this.props;

    const imageFile = _.head(e.target.files);
    if (
      !imageFile.name.endsWith(".png") &&
      !imageFile.name.endsWith(".jpeg") &&
      !imageFile.name.endsWith(".jpg")
    ) {
      this.refs.upload.value = "";
      return this.props.errorSnackbar("Invalid image format!");
    } else if (imageFile.size > 9437184) {
      this.refs.upload.value = "";
      return this.props.errorSnackbar("Image is too big (max. 9MB)!");
    }

    const formData = new FormData();
    formData.append("paymentReceipt", imageFile);
    formData.append("pin", pin);
    this.setState({ uploadStatus: LOADING });
    updatePaymentReceiptById(formId, formData, (error, form) => {
      this.refs.upload.value = "";
      if (error) {
        console.log({ error });
        return this.setState({ uploadStatus: ERROR });
      }
      this.setState({
        uploadStatus: DONE,
        imageUrl: form.paymentReceipt.secureUrl,
        uploadedOnce: true
      });
      successSnackbar("Changes saved!");
    });
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
        status: DONE,
        imageUrl: (form.paymentReceipt || {}).secureUrl
      });
    });
  };

  renderField = field => {
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

  render() {
    const {
      classes,
      form: { status: formStatus },
      history
    } = this.props;
    const { status, uploadStatus, pin, imageUrl, uploadedOnce } = this.state;

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
                <Typography
                  variant="h4"
                  gutterBottom
                  align="center"
                  style={{ color: "white", fontWeight: "bold" }}
                >
                  Leadership Development Camp 2019
                </Typography>
              </Fade>
              <Fade bottom>
                <Typography
                  variant="subtitle1"
                  align="center"
                  style={{ color: "white" }}
                >
                  - Payment Receipt -
                </Typography>
              </Fade>
            </Grid>
          </Grid>

          <Grid container justify="center" className={classes.formGrid}>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Grid item xs={11}>
                  <Typography variant="h5" style={{ marginTop: "1em" }}>
                    Upload Payment Receipt
                  </Typography>
                  <Divider light className={classes.divider} />
                  <Paper className={classes.uploadPaper} elevation={3}>
                    <Grid container justify="center">
                      <Grid item xs={10} sm={8} md={6} lg={4}>
                        {imageUrl && (
                          <img
                            src={imageUrl}
                            alt=""
                            style={{ maxHeight: "75vh", width: "100%" }}
                          />
                        )}
                      </Grid>
                    </Grid>
                    <br />
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      // capture="camera"
                      style={{ display: "none" }}
                      ref="upload"
                      onChange={this.handleFileChange}
                    />
                    <Typography
                      variant="body1"
                      align="center"
                      style={{ marginTop: "1em" }}
                    >
                      {formStatus === "ACCEPTED"
                        ? "Your form has been accepted!"
                        : formStatus === "WAITING_APPROVAL"
                        ? "Please wait for our admin's approval"
                        : ""}
                    </Typography>

                    {uploadedOnce && (
                      <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        onClick={() => history.push("/main")}
                        className={classes.submitButton}
                        disabled={uploadStatus === LOADING}
                      >
                        Done
                      </Button>
                    )}
                    <br />
                    <br />
                    <Button
                      variant={uploadedOnce ? "outlined" : "contained"}
                      color="primary"
                      disabled={
                        uploadStatus === LOADING ||
                        formStatus === "ACCEPTED" ||
                        formStatus === "WAITING_APPROVAL"
                      }
                      onClick={e => console.log(this.refs.upload.click())}
                    >
                      {uploadedOnce ? "Upload again..." : "Upload..."}
                    </Button>

                    <div>
                      <Typography
                        variant="subtitle2"
                        className={classes.filename}
                      >
                        {uploadStatus === LOADING ? (
                          <span>
                            Saving... <CircularProgress size={20} />
                          </span>
                        ) : uploadStatus === DONE ? (
                          <span style={{ color: "green" }}>(SAVED)</span>
                        ) : uploadStatus === ERROR ? (
                          <span style={{ color: "red" }}>(FAILED)</span>
                        ) : null}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        className={classes.filename}
                      >
                        Only *.jpeg, *.jpg, or *.png allowed (max. 9MB).
                      </Typography>
                    </div>
                  </Paper>
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
  return errors;
}

function mapStateToProps(state, ownProps) {
  const { form } = state.regForm;

  return {
    initialValues: form
      ? {
          ...form.data
        }
      : {},
    ...form
  };
}

const withStylesDecorated = withStyles(styles)(PaymentReceipt);
const reduxFormDecorated = reduxForm({
  validate,
  form: "PaymentReceipt",
  enableReinitialize: true
})(withStylesDecorated);
const connectDecorated = connect(
  mapStateToProps,
  { ...eventActions, ...formActions, ...snackbarActions }
)(reduxFormDecorated);
export default connectDecorated;
