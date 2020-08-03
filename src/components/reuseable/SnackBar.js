import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const classes = withStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    },
  },
}));

const mapStateToProps = state => ({
    state: state.reducer
  })
  
class CustomizedSnackbars extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
        snackbarOpen: false,
        snackbarType: "success",
        snackbarMessage: "",
    }
}
componentDidMount(){
    this.setState({
        snackbarOpen: this.props.state.snackbar.snackbarOpen,
        snackbarType: this.props.state.snackbar.snackbarType,
        snackbarMessage: this.props.state.snackbar.snackbarMessage,
    })
}


  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.dispatch({
        type: 'SET_SNACKBAR',
        payload: {
            snackbarOpen: false,
            snackbarType: this.state.snackbarType,
            snackbarMessage: this.state.snackbarMessage}
      })
  };

  render (){
      return(
    <div className={classes.root}>
      <Snackbar
        open={this.state.snackbarOpen}
        autoHideDuration={3000}
        onClose={this.handleClose}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={this.handleClose}
          color={this.state.snackbarType}
        >
          {this.state.snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );}
};

export default connect(mapStateToProps)(CustomizedSnackbars)
