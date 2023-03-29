# JSValidator - JavaScript Code Validator
The JSValidator is a service that uses the JSHint API to check your JavaScript code for errors and potential problems. The service is a code quality tool that useful for everyone who wants to validate their JavaScript code regularly. It also can be used to check the code of [Code Institute](https://codeinstitute.net/) students' projects before they submit them for review.

## Technologies Used
The project is built using the following technologies:
- [HTML5](https://www.w3.org/TR/html52/)
- [CSS3](https://www.w3.org/Style/CSS/Overview.en.html)
- [JavaScript](https://www.javascript.com/)
- [CI JSHint API](https://ci-jshint.herokuapp.com/)
- [Bootstrap 5.0.2](https://getbootstrap.com/docs/5.0/getting-started/introduction/)
- [Font Awesome](https://fontawesome.com/)
- [jQuery](https://jquery.com/)
- [Netlify Serverless Functions](https://docs.netlify.com/functions/overview/)
- [Node.js](https://nodejs.org/en/)

## Deployment
Live link of the JSValidator:
https://js-validator.netlify.app/

_The JSValidator is a static web service that deployed on Netlify from GitHub and using Netlify Serverless Functions to hide the JSHint API key from the public_

**The Simple implementation** of the JSValidator with exposed API key and withouth using the back-end code can be found on the branch [no-netlify](). This branch is not deployed.


### How to receive and use the CodeInstitute JSHint API?
The JSValidator uses the JSHint API which allows developer to run [JSHint](https://jshint.com/) on your code without having to install anything.

The CodeInstitute JSHint API is free but it does require an API key, so  you’ll need to complete the sign-up process.

**The key is only available to current students of Code Institute, and the API will check that before giving you the key. All API keys are valid for a period of 1 year.**


To receive a key go to https://ci-jshint.herokuapp.com/ and type your email address that you used when you signed up for the Code Institute course. You will be issued with a key if you are a current student of Code Institute.

Usage Instructions can be found on [the same page](https://ci-jshint.herokuapp.com/) under the registration form.

### Netlify Serverless Functions
**Hide the JSHint API Key using Netlify Serverless Functions**
The API key is sensitive information and should not be exposed to the public. To hide the API key from the public, I used [Netlify](https://netlify.com) Serverless Functions. The Netlify functions are a way to run server-side code without having to manage or maintain a server. The function make a request to the `JSHint API` using `axios` on the server side without exposing our API key and returns the response in form of a `JSON object` with `status code` and `body`. Then the client side fetches the response using `fetch()` and displays the result to the user.

To use the Netlify Serverless Functions, you need to create a Netlify account and link it to your GitHub repository. You can find more information about the Netlify Serverless Functions by following the links:
- [Intro to Serverless Functions](https://www.netlify.com/blog/intro-to-serverless-functions/)
- [How to Hide API Keys in Frontend Apps using Netlify Functions](https://www.freecodecamp.org/news/hide-api-keys-in-frontend-apps-using-netlify-functions/)

#### Netlify Requirements
##### Files:
The Netlify Serverless Functions require the following files:
- `netlify.toml` - Netlify configuration file
- `package.json` - Node.js package file
- `netlify/functions/` - directory for the Netlify Serverless Functions

##### Dependencies:
The Netlify Serverless Functions require the following dependencies:
- `netlify-cli` - Netlify CLI
- `netlify-lambda` - Netlify Lambda
- `dotenv` - loads environment variables from a `.env` file
- `axios` - Promise based HTTP client for the browser and node.js

**Run the development server** to test the Netlify Serverless Functions locally:

```
netlify dev
```
