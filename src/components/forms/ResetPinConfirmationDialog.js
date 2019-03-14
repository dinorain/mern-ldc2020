import _ from 'lodash'
import React, { Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { withStyles } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'

import * as formActions from '../../actions/form'
import * as snackbarActions from '../../actions/snackbar'

const styles = theme => ({
  textField: {
    margin: '0.5em 0'
  },
  formControl: {
    width: '380px',
  },
})

const SUBMITTING = 'SUBMITTING', IDLE = 'IDLE'

const INITIAL_STATE = {
  submitStatus: IDLE,
}

class ResetPinConfirmationDialog extends React.Component {

  state = INITIAL_STATE

  onSubmit = () => {
    const { requestResetPin, successSnackbar, errorSnackbar, toggleDialog, name } = this.props
    const { formId } = this.props.match.params
    this.setState({ submitStatus: SUBMITTING })
    requestResetPin(formId, error => {
      this.setState({ submitStatus: IDLE })
      if (error) {
        return errorSnackbar(_.get(error, 'response.data.error.msg', `Please try again!`))
      }
      successSnackbar(`An email with further instruction has been sent to you.`)
      this.setState(INITIAL_STATE)
      toggleDialog(name)(false)
    })
  }

  onClose = () => {
    const { name, toggleDialog } = this.props
    toggleDialog(name)(false)
    this.setState(INITIAL_STATE)
  }

  render() {
    const { submitStatus } = this.state
    const { state, name } = this.props

    return (
      <div>
        <Dialog
          open={Boolean(state[name])}
          aria-labelledby="form-dialog-title"
        >
          <Fragment>
            <DialogTitle id="form-dialog-title">
              Request a reset pin?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <Typography variant="subtitle1">
                  We will send furhter instruction to your email
                </Typography>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                color="primary"
                onClick={this.onClose}
                disabled={submitStatus === SUBMITTING}
              >
                No
              </Button>
              <Button 
                color="secondary" 
                onClick={this.onSubmit}
                disabled={submitStatus === SUBMITTING}
              >
                {
                  submitStatus === IDLE ? (
                    <Fragment>
                      Yes
                    </Fragment>
                  ) : (
                    <CircularProgress size={24} />
                  )
                }
              </Button>
            </DialogActions>
          </Fragment>
        </Dialog>
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  connect(null, { ...formActions, ...snackbarActions }),
  withRouter,
)(ResetPinConfirmationDialog)
