import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { Done as DoneIcon } from "@material-ui/icons";

import { Fade } from "react-reveal";

const styles = theme => ({
  root: {
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
    marginTop: "1.5em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.35em"
  }
});

class Slogan extends Component {
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
            <Fade bottom>
              <Typography variant="h3" gutterBottom className={classes.title}>
                <em>" Pemilu Berdaulat, Negara Kuat "</em>
              </Typography>
            </Fade>
            <br />
            <br />
            <Fade bottom>
              <Typography variant="subtitle1" className={classes.subtitle}>
                <DoneIcon style={{ fontWeight: "bold", fontSize: "1.35em" }} />{" "}
                Free
              </Typography>
              <Typography variant="subtitle1" className={classes.subtitle}>
                <DoneIcon style={{ fontWeight: "bold", fontSize: "1.35em" }} />{" "}
                Certificate Provided
              </Typography>
            </Fade>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Slogan);
