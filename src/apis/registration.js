import axios from 'axios'

export default () => {
  return axios.create({
    baseURL: process.env.REACT_APP_REGISTRATION_API_BASE_URL,
  })
}
