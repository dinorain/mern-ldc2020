import React, { Component } from "react";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Logo from "../../res/images/kpu_logo.png";

const styles = theme => ({
  root: {
    minHeight: "100vh",
    background: "#ED4337",
    padding: "2em 1em"
  },
  title: {
    color: "white",
    fontWeight: "600",
    fontFamily:
      "MyriadPro-Regular, 'Myriad Pro Regular', MyriadPro, 'Myriad Pro', Helvetica, Arial, sans-serif",
    textShadow: "4px 4px 7px rgba(0, 0, 0, 0.1)"
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
    height: "15em",
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
          <Grid item sm={12} md={6} style={{ textAlign: "center" }}>
            <img src={Logo} alt="" className={classes.logo} />
          </Grid>
          <Grid item sm={12} md={6} style={{ padding: "1.5em" }}>
            <Typography
              variant="h4"
              gutterBottom
              className={classes.title}
              style={{ display: "flex", alignItems: "center" }}
            >
              KPU Goes to Campus
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              style={{ display: "flex", alignItems: "center", color: "white" }}
            >
              Kami dari organisasi BEM UPH Kampus Medan mengadakan seminar dalam
              rangkaian KPU Goes to Campus dengan tujuan agar para mahasiswa
              yang termasuk kedalam pemilih pemula dapat memiliki pandangan
              politik yang terarah dan memiliki pengetahuan tentang cara dan
              tata pemilihan umum yang diselenggarakan di Indonesia, sehingga
              dari diadakannya seminar ini dapat memenuhi tujuan dari pemilihan
              umum yaitu untuk mewujudkan demokratisasi, mewujudkan hak-hak
              rakyat, dan mewujudkan partisipasi rakyat dalam politik.
            </Typography>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Description);
