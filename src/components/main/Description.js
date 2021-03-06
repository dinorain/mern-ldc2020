import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Logo from "../../res/images/logos/LDC_LOGO_2020_gradient.png";

const styles = theme => ({
  root: {
    minHeight: "100vh",
    background: "rgb(0, 0, 0)",
    padding: "2em 1em"
  },
  title: {
    color: "white",
    fontWeight: "600",
    fontFamily:
      "MyriadPro-Regular, 'Myriad Pro Regular', MyriadPro, 'Myriad Pro', Helvetica, Arial, sans-serif",
    textShadow: "4px 4px 8px rgba(0, 0, 0, 0.2)"
  },
  subtitle: {
    color: "white",
    fontSize: "1.25em",
    fontFamily: "'Proxima Nova', Helvetica, Arial, sans-serif",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.15)"
  },
  listItem: {
    color: "white",
    fontSize: "1.25em",
    fontFamily: "'Proxima Nova', Helvetica, Arial, sans-serif",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.15)",
    margin: "0.75em 0"
  },
  logo: {
    height: "18em",
    mozDropShadow: "(4px 4px 7px 5px rgba(0, 0, 0, 0.3))",
    webkitDropShadow: "(4px 4px 7px 5px rgba(0, 0, 0, 0.3))",
    dropShadow: "(4px 4px 7px 5px rgba(0, 0, 0, 0.3))"
  }
});

class Description extends Component {
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
          <Grid item sm={12} md={4} style={{ textAlign: "center" }}>
            <img src={Logo} alt="" className={classes.logo} />
          </Grid>
          <Grid item sm={12} md={6} style={{ padding: "1.5em" }}>
            <Typography
              variant="h4"
              gutterBottom
              className={classes.title}
              style={{
                display: "flex",
                alignItems: "center",
                color: "rgb(248, 147, 31)"
              }}
            >
              Leadership Development Camp 2020
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ display: "flex", alignItems: "center", color: "white" }}
            >
              Leadership Development Camp (LDC) 2020 adalah acara tahunan 
              yang berupa Latihan Dasar Kepemimpinan (LDK) yang diselenggarakan 
              oleh BEM-UPH 2019/2020 untuk mahasiswa/i guna mempersiapkan jebolan 
              intelektual muda yang matang akan jiwa kepemimpinannya dalam mengelola 
              organisasi maupun lembaga kemahasiswaan serta mampu menciptakan perbedaan 
              karakter kepemimpinan yang tidak monoton demi progresifitas dan perbaikan 
              tatanan sosial untuk mewujudkan nilai-nilai integritas dalam kehidupan kampus 
              yang demokratis.

            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Description);
