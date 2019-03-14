import moment from "moment";
import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Grid, Button } from "@material-ui/core";
import { Fade, LightSpeed } from "react-reveal";

import * as eventActions from "../../actions/event";
import KageBunshin from "../../res/images/kage_bunshin.jpg";

const styles = theme => ({
  root: {
    minHeight: "100vh",
    padding: "2em 1em",
    background: `url(${KageBunshin}), lightgray`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  title: {
    color: "#ED4337",
    textAlign: "center",
    marginBottom: "1em",
    fontWeight: "bold"
  },
  subtitle: {
    color: "black",
    textAlign: "center"
  },
  clockUnit: {
    fontSize: "0.25em !important"
  }
});

const LOADING = "LOADING",
  DONE = "DONE",
  ERROR = "ERROR";

class ComeAndJoinUs extends Component {
  state = {
    status: LOADING,
    dd: "--",
    hh: "--",
    mm: "--",
    ss: "--"
  };

  fetchData = () => {
    this.setState({ status: LOADING });
    this.props.getEvent(error => {
      if (error) {
        return this.setState({ status: ERROR });
      }
      this.setState({ status: DONE });
    });
  };

  componentDidMount() {
    this.fetchData();
    setInterval(() => {
      const { event } = this.props;
      if (event && event.formCategories) {
        const openMoment = moment(event.formCategories[0].openDate);
        const closeMoment = moment(event.formCategories[0].closeDate);
        if (moment().isBefore(openMoment)) {
          const dd = Math.abs(openMoment.diff(moment(), "days"));
          const [hh, mm, ss] = moment
            .utc(moment(openMoment).diff(moment()))
            .format("HH:mm:ss")
            .split(":");
          this.setState({ dd, hh, mm, ss });
        } else if (moment().isBefore(closeMoment)) {
          const dd = Math.abs(closeMoment.diff(moment(), "days"));
          const [hh, mm, ss] = moment
            .utc(moment(closeMoment).diff(moment()))
            .format("HH:mm:ss")
            .split(":");
          this.setState({ dd, hh, mm, ss });
        } else {
          this.setState({ dd: "--", hh: "--", mm: "--", ss: "--" });
        }
      }
    }, 1000);
  }

  render() {
    const { classes, passedRef, event } = this.props;
    const { status, dd, hh, mm, ss } = this.state;

    if (!event) return null;

    const openMoment = moment(event.formCategories[0].openDate);
    const closeMoment = moment(event.formCategories[0].closeDate);

    return status === DONE && event ? (
      <div ref={passedRef}>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item sm={10}>
            <LightSpeed left>
              <Typography variant="h3" gutterBottom className={classes.title}>
                Register Now!
              </Typography>
            </LightSpeed>
            <Fade>
              <Typography
                variant="h2"
                gutterBottom
                className={classes.subtitle}
              >
                {dd}
                <span className={classes.clockUnit}>d</span> {hh}
                <span className={classes.clockUnit}>h</span> {mm}
                <span className={classes.clockUnit}>m</span> {ss}
                <span className={classes.clockUnit}>s</span>
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                className={classes.subtitle}
              >
                {moment().isBefore(openMoment) ? (
                  <p>
                    Until{" "}
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      Opening
                    </span>
                  </p>
                ) : moment().isBefore(closeMoment) ? (
                  <p>
                    Until{" "}
                    <span style={{ color: "orange", fontWeight: "bold" }}>
                      Closing
                    </span>
                  </p>
                ) : (
                  <p>
                    Registration{" "}
                    <span style={{ color: "red", fontWeight: "bold" }}>
                      Closed
                    </span>
                  </p>
                )}
              </Typography>
            </Fade>
          </Grid>
        </Grid>
      </div>
    ) : status === ERROR ? (
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item sm={10} style={{ textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            className={classes.subtitle}
          >
            Connection issue!
          </Typography>
          <Button color="primary" variant="outlined" onClick={this.fetchData}>
            Retry
          </Button>
        </Grid>
      </Grid>
    ) : (
      <Grid
        container
        justify="center"
        alignItems="center"
        className={classes.root}
      >
        <Grid item sm={10} style={{ textAlign: "center" }}>
          <CircularProgress size={48} />
        </Grid>
      </Grid>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.event
  };
}

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    { ...eventActions }
  )
)(ComeAndJoinUs);
