import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Text1 from "../../res/images/text1.png";

const styles = theme => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  logo: {
    height: "12em"
  },
  title: {
    color: "rgb(140, 140, 140)",
    fontWeight: "bold",
    fontSize: "3em",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.1)"
  },
  text1: {
    width: "600px",
    maxWidth: "85vw"
  },
  text2: {
    width: "800px",
    maxWidth: "90vw"
  }
});

class TopDisplay extends Component {
  render() {
    const { classes, passedRef } = this.props;

    return (
      <div ref={passedRef}>
        <div className={classes.root}>
          <img src={Text1} alt="" className={classes.text1} />
        </div>
      </div>
    );
  }
}

export default compose(withStyles(styles))(TopDisplay);
