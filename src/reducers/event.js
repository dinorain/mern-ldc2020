// import _ from 'lodash'
export const EVENT_GET = 'EVENT_GET'

const INITIAL_STATE = {
  event: null
}

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case EVENT_GET: {
      const { event } = action.payload
      return { 
        ...state,
        event,
      }
    }
    default: {
      return state
    }
  }
}
