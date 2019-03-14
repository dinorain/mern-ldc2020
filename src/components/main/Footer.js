import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

const styles = theme => ({
  root: {
    padding: "0.2em",
    background: "rgb(15, 100, 160)"
  },
  title: {
    display: "flex",
    alignItems: "center",
    color: "lightgray",
    textAlign: "center",
    justifyContent: "center"
  },
  icon: {
    color: "crimson",
    margin: "0 0.15em"
  },
  img: {
    height: "1.35em",
    margin: "0 0.35em"
  }
});

class Footer extends Component {
  render() {
    const { classes, passedRef } = this.props;

    return (
      <div ref={passedRef}>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <Grid item sm={10}>
            <Typography variant="subtitle1" className={classes.title}>
              Copyright &copy; 2019 HMFIK UPH Medan Campus
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Footer);
