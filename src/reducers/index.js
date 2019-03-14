import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import event from './event'
import regForm from './regForm'
import snackbar from './snackbar'

export default combineReducers({
  event,
  regForm,
  snackbar,
  form: formReducer,
})
