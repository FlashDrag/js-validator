import dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

const apiKey = process.env.API_KEY;
const API_URL = "https://ci-jshint.herokuapp.com/api";


export const handler = async (event, context) => {
	try {
		const inputFormData = JSON.parse(event.body);

		// Create a new FormData instance as API expects FormData object
		// js method:
		/*
		const formData = new FormData();
		for (const [key, value] of Object.entries(inputFormData)) {
			formData.append(key, value);
		}
		*/
		// new axios method for converting js object to form data:
		const formData = axios.toFormData(inputFormData)

		const response = await axios.post(API_URL, formData, {
			headers: {
				"Authorization": apiKey,
			}
		});

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
				statusCode: '500',
				body: JSON.stringify({ "error":'Internal server error', "error_no":0,"status_code":500 })
			}
		}
	}
};