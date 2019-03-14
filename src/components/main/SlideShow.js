import "../../res/stylesheets/slideshow.css";
import React, { Component } from "react";
import { Fade } from "react-slideshow-image";
import { withStyles } from "@material-ui/core/styles";

import LDC1 from "../../res/images/ldc_1.jpg";
import LDC2 from "../../res/images/ldc_2.jpg";
import LDC3 from "../../res/images/ldc_3.jpg";
import LDC4 from "../../res/images/ldc_4.jpg";
import LDC5 from "../../res/images/ldc_5.jpg";

const styles = theme => ({
  root: {
    display: "block",
    position: "fixed",
    left: "0",
    top: "0",
    width: "100vw",
    height: "100vh",
    zIndex: "-8"
  }
});

const slideImages = [LDC3, LDC1, LDC2, LDC4, LDC5];

const properties = {
  duration: 2000,
  transitionDuration: 500,
  infinite: true,
  indicators: true,
  arrows: false,
  autoplay: true
};

class Slideshow extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <Fade className={classes.root} {...properties}>
          {slideImages.map((slideImage, index) => (
            <div key="index" className="each-slide">
              <div
                style={{
                  backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(${slideImage})`
                }}
              />
            </div>
          ))}
        </Fade>
      </div>
    );
  }
}

export default withStyles(styles)(Slideshow);
