import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Logo from "../../res/images/ldc_logo.png";

const styles = theme => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
    height: "12em"
  },
  title: {
    color: "white",
    fontWeight: "bold",
    fontSize: "2.75em",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.1)",
    textAlign: "left"
  }
});

class TopDisplay extends Component {
  render() {
    const { classes, passedRef } = this.props;

    return (
      <div ref={passedRef}>
        <div className={classes.root}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={6} sm={3} md={2} lg={2}>
              <img alt="" src={Logo} style={{ width: "100%" }} />
            </Grid>
            <Grid item xs={8} sm={6} md={2} lg={3}>
              <Typography
                variant="h3"
                className={classes.title}
                style={{ marginLeft: "0.5em" }}
              >
                Leadership
                <br />
                Development
                <br />
                Camp 2019
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default compose(withStyles(styles))(TopDisplay);
