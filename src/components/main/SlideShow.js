import "../../res/stylesheets/slideshow.css";
import React, { Component } from "react";
import { Fade } from "react-slideshow-image";
import { withStyles } from "@material-ui/core/styles";

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

const slideImages = [...Array(15).keys()].map((_, index) =>
  require(`../../res/images/ldcs/${index + 1}.jpg`)
);

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
