import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import { Fade } from "react-reveal";
import {} from "@material-ui/icons";

import Form1 from "../forms/Form1";

const styles = theme => ({
  root: {
    minHeight: "100vh",
    background: "#ED4337",
    padding: "3.5em 1em"
  },
  title: {
    display: "inline",
    textAlign: "center",
    color: "white",
    fontFamily: "'Proxima Nova', Helvetica, Arial, sans-serif",
    fontWeight: "600",
    marginBottom: "1em",
    padding: "0 0.65em 0.5em 0.65em",
    borderBottom: "2px solid white"
  },
  bigImage: {
    color: "white",
    height: "6em"
  },
  medImage: {
    color: "white",
    height: "3em",
    position: "relative",
    left: "-1.5em"
  },
  medIcon: {
    color: "white",
    fontSize: "2.5em",
    position: "relative",
    left: "-0.5em"
  },
  smallIcon: {
    color: "white",
    marginRight: "0.25em"
    // fontSize: '1em',
  },
  name: {
    color: "white",
    fontWeight: "bold",
    fontFamily:
      "MyriadPro-Regular, 'Myriad Pro Regular', MyriadPro, 'Myriad Pro', Helvetica, Arial, sans-serif",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.03)",
    marginTop: "0.5em"
  },
  desc: {
    color: "white",
    display: "flex",
    alignItems: "center",
    fontFamily: "'Proxima Nova', Helvetica, Arial, sans-serif",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.03)",
    fontWeight: "300",
    margin: "0.35em 0"
  },
  compeGrid: {},
  actionDiv: {
    marginTop: "1em",
    marginBottom: "4em"
  },
  button: {
    color: "white",
    border: "2px solid white"
  }
});

class Description extends Component {
  render() {
    const { classes, passedRef } = this.props;

    return (
      <div ref={passedRef}>
        <Grid container justify="center" className={classes.root}>
          <Grid item sm={12}>
            <Grid container justify="center">
              <Grid item sm={10}>
                <Fade top>
                  <div style={{ textAlign: "center", marginBottom: "5em" }}>
                    <Typography
                      variant="h4"
                      gutterBottom
                      className={classes.title}
                    >
                      REGISTER
                    </Typography>
                  </div>
                </Fade>
                <Form1 />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Description);
