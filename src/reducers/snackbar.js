import _ from 'lodash'
export const SNACKBAR_SHOW = 'SNACKBAR_SHOW'
export const SNACKBAR_HIDE = 'SNACKBAR_HIDE'

const INITIAL_STATE = {
  toasters: {}
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SNACKBAR_SHOW: {
      const { variant, message } = action.payload
      return { 
        toasters: {
          ..._.pickBy(state.toasters, value => value.open),
          [_.uniqueId()]: {
            open: true, 
            variant, 
            message     
          }
        }
      }
    }
    case SNACKBAR_HIDE: {
      const { snackbarId } = action.payload
      return { 
        toasters: {
          ..._.pickBy(state.toasters, value => value.open),
          [snackbarId]: {
            ...state.toasters[snackbarId],
            open: false
          }
        }
      }
    }
    default:
      return state
  }
}
