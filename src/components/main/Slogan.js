import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { People as PeopleIcon, Money as MoneyIcon } from "@material-ui/icons";

import { Fade } from "react-reveal";

const styles = theme => ({
  root: {
    minHeight: "100vh"
  },
  title: {
    textAlign: "center",
    color: "rgb(26, 147, 201)",
    fontWeight: "bold",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.15)"
  },
  subtitle: {
    color: "white",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "1.25em",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.15)"
  },
  quotes: {
    color: "white",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.15)"
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
                <em>" ROLE MODEL "</em>
              </Typography>
            </Fade>
            <br />
            <Fade bottom>
              <Typography
                variant="subtitle1"
                gutterBottom
                className={classes.quotes}
              >
                “Perlakukanlah orang-orang yang berada di bawah pimpinanmu
                seperti yang engkau mau mereka perlakukan terhadap dirimu”.
                <br />- Lukas 6:31 -
              </Typography>
            </Fade>
            <br />
            <br />
            <br />
            <Fade bottom>
              <Typography variant="subtitle1" className={classes.subtitle}>
                <MoneyIcon style={{ fontWeight: "bold", fontSize: "1.1em" }} />
                &nbsp;&nbsp; Rp. 550.000
              </Typography>
              <Typography variant="subtitle1" className={classes.subtitle}>
                <PeopleIcon style={{ fontWeight: "bold", fontSize: "1.1em" }} />
                &nbsp;&nbsp; Only 100 slots
              </Typography>
            </Fade>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Slogan);
