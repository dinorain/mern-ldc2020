import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Hidden, Divider } from "@material-ui/core";

const styles = theme => ({
  root: {
    padding: "0.2em",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch"
  },
  title: {
    color: "black"
  },
  icon: {
    color: "crimson",
    margin: "0 0.15em"
  },
  logo: {
    height: "2.5em",
    margin: "0 0.35em"
  },
  divider: {
    color: "gray",
    width: 1.5,
    height: "3.5em",
    margin: "0 0.75em"
  }
});

class Footer extends Component {
  render() {
    const { classes, passedRef } = this.props;

    return (
      <div ref={passedRef}>
        <div className={classes.root}>
          <div>
            <Typography variant="body2" className={classes.title}>
              Organized by:
            </Typography>
            <div>
              <img
                alt=""
                src={require("../../res/images/logos/bem_logo.png")}
                className={classes.logo}
              />
            </div>
          </div>
          <Hidden smDown>
            <Divider className={classes.divider} />
          </Hidden>
          <Hidden smUp>
            <br />
            <br />
          </Hidden>
          <div>
            <Typography variant="body2" className={classes.title}>
              Supported by:
            </Typography>
            <div>
              {[
                "hmfik_logo.png",
                "hmpsm_logo.png",
                "hmpsa_logo.png",
                "hmfh_logo.png",
                "sgs_logo.png",
                "sl_logo.png",
                "uph_logo.jpeg"
              ].map(logoName => (
                <img
                  alt=""
                  src={require(`../../res/images/logos/${logoName}`)}
                  className={classes.logo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Footer);
