// import _ from 'lodash'
export const FORM_GET = 'FORM_GET'

const INITIAL_STATE = {
  form: {}
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case FORM_GET: {
      const { form } = action.payload
      return { 
        ...state,
        form,
      }
    }
    default: {
      return state
    }
  }
}
