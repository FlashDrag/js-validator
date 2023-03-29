const API_KEY = ""
const API_URL = "https://ci-jshint.herokuapp.com/api"
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


async function displayStatus() {
  try {
    const status = await getStatus();
    let heading = 'API Key Status';
    let strStatus = `<p>${status.msg}</p><p>${status.date}</p>`;

    $('#resultsModalTitle').text(heading);
    $('#results-content').html(strStatus);
    $('#resultsModal').modal('show');
  } catch (err) {
    console.error(err);
  }
}

async function getStatus() {
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  const response = await fetch(queryString);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }

  const [day, month, year] = data.expiry.split('-').map(Number);
  const expiryDate = new Date(year, month - 1, day);
  const isValid = expiryDate >= new Date();
  let msg = isValid ? 'Your key is valid until' :
    'The service is no longer available!\nThe API key is expired by';

  return { msg: msg, date: expiryDate.toLocaleDateString('tr-TR') };
}