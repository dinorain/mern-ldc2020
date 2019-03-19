import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
// import Typography from "@material-ui/core/Typography";
// import { Grid, Divider, Hidden } from "@material-ui/core";

const styles = theme => ({
  root: {
    padding: "0.2em",
    // background: "rgb(15, 100, 160)"
    background: "white"
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
    width: 2,
    height: "3.5em",
    margin: "0 0.5em"
  }
});

class Footer extends Component {
  render() {
    const { passedRef } = this.props;

    return (
      <div
        ref={passedRef}
        style={{ textAlign: "center", backgroundColor: "white" }}
      >
        <img
          alt=""
          src={require("../../res/images/footer.png")}
          style={{ width: "100%", maxWidth: "800px" }}
        />
      </div>
    );
  }
}

export default compose(withStyles(styles))(Footer);
