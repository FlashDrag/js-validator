import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const apiKey = process.env.API_KEY
const API_URL = "https://ci-jshint.herokuapp.com/api"


// https://docs.netlify.com/functions/build/?fn-language=js#create-function-file-2
export const handler = async (event, context) => {
  try {
    const queryString = `${API_URL}?api_key=${apiKey}`;
    const response = await axios.get(queryString);
    const data = await response.data;
    return {
      statusCode: response.status,
      body: JSON.stringify({ ...data }),
    }
  } catch (error) {
    // https://axios-http.com/docs/handling_errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status
      // get prepared error data from api server
      let data = error.response.data
      return {
        statusCode: status,
        body: JSON.stringify({ ...data }),
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      // or The request was made but no response was received
      return {
        statusCode: '',
        body: JSON.stringify({ ...error })
      }
    }
  }
};
