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
    alert(data.error);
    throw `Error no ${data.error_no}: ${data.error}\nStatus code: ${data.status_code}`;
  }
  const [day, month, year] = data.expiry.split('-').map(Number);
  const expiryDate = new Date(year, month - 1, day);
  const isValid = expiryDate >= new Date();
  let msg = isValid ? 'Your key is valid until' :
    'The service is no longer available!\nThe API key is expired by';

  return { msg: msg, date: expiryDate.toLocaleDateString('tr-TR') };
}