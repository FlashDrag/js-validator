/*
// triggering Bootstrap modals using JavaScript
$('#status-btn').click(function () {
  let resultsModal = new bootstrap.Modal(document.getElementById('resultsModal'))
  resultsModal.show()
})
// triggering Bootstrap modals using JavaScript or jQuery
$('#status-btn').click(function () {
  $('#resultsModal').modal('show');
})
*/

$('#status-btn').click(displayStatus)
$('#submit').click(postForm)


/* --- GET --- */

function displayStatus() {
  getStatus()
    .then(status => {
      let heading = 'API Key Status';
      let strStatus = `<p>${status.msg}</p><p>${status.date}</p>`;

      $('#resultsModalTitle').text(heading);
      $('#results-content').html(strStatus);
      $('#resultsModal').modal('show');
    })
    .catch(err => console.error(err))
}

async function getStatus() {
  const response = await fetch('/.netlify/functions/getStatus', {
    method: "GET",
    headers: { accept: "application/json" },
  });

  const data = await response.json();

  if (!response.ok) {
    displayException(data);
    throw new Error(data.error);
  }
  const [day, month, year] = data.expiry.split('-').map(Number);
  const expiryDate = new Date(year, month - 1, day);
  const isValid = expiryDate >= new Date();
  let msg = isValid ? 'Your key is valid until' :
    'The service is no longer available!\nThe API key is expired by';

  return { msg: msg, date: expiryDate.toLocaleDateString('tr-TR') };
}


/* --- POST --- */

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

  // TODO: validate the form before sending it to the API
  /* If any input field fails validation,
  the function displays an error message and returns false
  and the form is not sent to the API */

  // if (!validateForm()) {return;}

  try {
    const form = processOptions(new FormData(document.getElementById("checksform")));
    const response = await fetch('/.netlify/functions/postForm', {
      method: "POST",
      // convert FormData object to a JSON object
      body: JSON.stringify(Object.fromEntries(form)),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle the server response if successful (status code 200)
      displayResult(data);
    } else {
      // Handle api errors
      displayException(data);
      console.error(data.error);
    }
  } catch (err) {
    // Handle network errors
    console.error(err);
    alert('Network error. Please try again later.');
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

  $("#resultsModalTitle").text(heading);
  $("#results-content").html(result);
  $('#resultsModal').modal('show');
}

function displayException(data) {
  let heading = '<span class="red">An Exception Occurred</span>';
  let resultStr = `
            <p>The API returned status code ${data.status_code}</p>
            <p>Error number: <strong>${data.error_no}</strong></p>
            <p>Error text: <strong>${data.error}</strong></p>`

  $("#resultsModalTitle").html(heading);
  $("#results-content").html(resultStr);

  $('#resultsModal').modal('show');
}