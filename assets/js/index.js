const API_KEY = ""
const API_URL = "https://ci-jshint.herokuapp.com/api"

const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status-btn").addEventListener("click", getStatus);
document.getElementById("submit").addEventListener("click", postForm);


async function getStatus() {

  const queryString = `${API_URL}?api_key=${API_KEY}`;

  const response = await fetch(queryString);

  const data = await response.json();

  if (response.ok) {
    displayStatus(data);
  } else {
    displayException(data);
    throw new Error(data.error);
  }

}

function displayStatus(data) {

  let heading = "API Key Status";
  let results = `<div>Your key is valid until</div>`;
  results += `<div class="key-status">${data.expiry}</div>`;

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;
  resultsModal.show();

}


/**
 * It takes a FormData object, loops through the options fields and
 * joins them into a comma separated string. It then deletes the
 * option fields and appends the new string with the options to the form data object.
 * @param FormData - The form data object that is passed to the function.
 * @returns FormData with options separated by commas.
 */
function processOptions(form) {
  let options = [];

  for (let e of form.entries()) {
    if (e[0] === "options") {
      options.push(e[1]);
    }
  }

  form.delete('options');

  form.append('options', options.join());

  return form;
}

/**
 * It takes the form data, sends it to the API, and displays the result
 */
async function postForm() {

  // the processOptions is called to join the options into a comma separated string,
  // as the API expects a comma separated list e.g. ['options', 'es6', 'jquery']
  const form = processOptions(new FormData(document.getElementById("checksform")));

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Authorization": API_KEY,
    },
    body: form,
  });

  const data = await response.json();

  if (response.ok) {
    displayResult(data);
  } else {
    displayException(data);
    throw new Error(data.error);
  }
}

function displayResult(data) {
  let heading = `JSHint Result for "${data.file}"`;
  let result;
  if (data.total_errors > 0) {
    result = `<h6>Total Errors: <span class='red'>${data.total_errors}</span></h6>
              <ul>`;
    for (let error of data.error_list) {
      let item = `
              <li><small>Line: <span class='red'>${error.line}</span>
                  | Column: <span class='red'>${error.col}</span></small>
              <br>
              <span><i>Error:</i> ${error.error}</span></li>`;
      result += item;
    }
    result += "</ul>";

  } else {
    result = '<div class="no_errors">No errors reported</div>';
  }

  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = result;
  resultsModal.show();
}

function displayException(data) {
  let heading = '<span class="red">An Exception Occurred</span>';
  document.getElementById("resultsModalTitle").innerHTML = heading;
  document.getElementById("results-content").innerHTML = `
  <p>The API returned status code ${data.status_code}</p>
  <p>Error number: <strong>${error_no}</strong></p>
  <p>Error text: <strong>${data.error}</strong></p>`;
  resultsModal.show();
}