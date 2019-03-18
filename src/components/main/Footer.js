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
    const { classes, passedRef } = this.props;

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

    // return (
    //   <div ref={passedRef}>
    //     <Grid
    //       container
    //       justify="center"
    //       alignItems="center"
    //       className={classes.root}
    //     >
    //       <Grid item xs={10} sm={1} md={1} lg={1}>
    //         <Typography variant="body2" className={classes.title}>
    //           Organized by:
    //         </Typography>
    //         <div>
    //           <img
    //             alt=""
    //             src={require("../../res/images/logos/bem_logo.png")}
    //             className={classes.logo}
    //           />
    //         </div>
    //       </Grid>
    //       <Hidden xsDown>
    //         <Grid
    //           item
    //           sm={1}
    //           md={1}
    //           lg={1}
    //           style={{
    //             display: "flex",
    //             alignItems: "center",
    //             justifyContent: "center"
    //           }}
    //         >
    //           <Divider className={classes.divider} />
    //         </Grid>
    //       </Hidden>
    //       <Hidden smUp>
    //         <Grid item xs={10} sm={10} md={10} lg={10}>
    //           <Divider style={{ margin: "0.65em 0" }} />
    //         </Grid>
    //       </Hidden>
    //       <Grid item xs={10} sm={6} md={7} lg={6}>
    //         <Typography variant="body2" className={classes.title}>
    //           Supported by:
    //         </Typography>
    //         <div>
    //           {[
    //             "hmfik_logo.png",
    //             "hmpsm_logo.png",
    //             "hmpsa_logo.png",
    //             "hmfh_logo.png",
    //             "sgs_logo.png",
    //             "sl_logo.png",
    //             "uph_logo.jpeg"
    //           ].map(logoName => (
    //             <img
    //               alt=""
    //               src={require(`../../res/images/logos/${logoName}`)}
    //               className={classes.logo}
    //             />
    //           ))}
    //         </div>
    //       </Grid>
    //     </Grid>
    //   </div>
    // );
  }
}

export default compose(withStyles(styles))(Footer);
