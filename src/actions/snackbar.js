import { 
  SNACKBAR_SHOW,
  SNACKBAR_HIDE,
} from '../reducers/snackbar'

export const hideSnackbar = (snackbarId) => {
  return({ 
    type: SNACKBAR_HIDE,
    payload: { snackbarId }
  })
}

export const successSnackbar = (message) => {
  return({ 
    type: SNACKBAR_SHOW,
    payload: {
      variant: 'success',
      message
    }
  })
}

export const errorSnackbar = (message) => {
  return({ 
    type: SNACKBAR_SHOW,
    payload: {
      variant: 'error',
      message
    }
  })
}

export const warningSnackbar = (message) => {
  return({ 
    type: SNACKBAR_SHOW,
    payload: {
      variant: 'warning',
      message
    }
  })
}

export const infoSnackbar = (message) => {
  return({ 
    type: SNACKBAR_SHOW,
    payload: {
      variant: 'info',
      message
    }
  })
}
