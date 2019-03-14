import _ from "lodash";
import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Fade } from "react-reveal";
import TopDisplay from "./TopDisplay";
import Description from "./Description";
import Slogan from "./Slogan";
import ComeAndJoinUs from "./ComeAndJoinUs";
import Competitions from "./Competitions";
import Footer from "./Footer";

import Poster from "../../res/images/poster.jpg";
import Smokey from "../../res/images/smokey.jpg";

const styles = theme => ({
  root: {
    display: "block",
    position: "fixed",
    left: "0",
    top: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-10",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover"
  },
  preloader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    left: "0",
    top: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "10",
    background: "white"
  }
});

class MainIndex extends Component {
  state = {
    backgroundImage: Poster,
    // showPerloader: document.readyState !== 'complete',
    showPerloader: false
  };

  constructor(props) {
    super(props);
    this.topDisplayRef = React.createRef();
    this.descriptionRef = React.createRef();
    // this.sloganRef = React.createRef();
    this.comeAndJoinUsRef = React.createRef();
    this.competitionsRef = React.createRef();
    this.footerRef = React.createRef();

    this.backgroundBreakpoints = [
      {
        node: this.topDisplayRef,
        backgroundImage: Poster
      },
      {
        node: this.descriptionRef,
        backgroundImage: Smokey
      }
    ];

    _.map(this.backgroundBreakpoints, bb => bb.backgroundImage).forEach(
      imagePath => {
        const img = new Image();
        img.src = imagePath;
      }
    );
  }

  componentDidMount() {
    window.onload = () => {
      this.setState({ showPerloader: false });
    };
    document.addEventListener("scroll", () => {
      const { scrollY } = window;
      if (!_.head(this.backgroundBreakpoints).node.current) return;
      const backgroundBreakpoint = _.findLast(
        this.backgroundBreakpoints,
        bb => scrollY >= bb.node.current.offsetTop
      );
      if (!backgroundBreakpoint) return;
      if (this.state.backgroundImage !== backgroundBreakpoint.backgroundImage)
        this.setState(() => ({
          backgroundImage: backgroundBreakpoint.backgroundImage
        }));
    });
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Fade when={this.state.showPerloader} collapse>
          <div className={classes.preloader}>
            <div style={{ textAlign: "center" }}>
              <CircularProgress size={48} />
            </div>
          </div>
        </Fade>
        <div
          className={classes.root}
          style={{ backgroundImage: `url(${this.state.backgroundImage})` }}
        />
        <div>
          <TopDisplay passedRef={this.topDisplayRef} />
          <Description passedRef={this.descriptionRef} />
          <Slogan passedRef={this.sloganRef} />
          <ComeAndJoinUs passedRef={this.comeAndJoinUsRef} />
          <Competitions passedRef={this.competitionsRef} />
          <Footer passedRef={this.footerRef} />
        </div>
      </div>
    );
  }
}

export default compose(
  withStyles(styles),
  connect(null)
)(MainIndex);
