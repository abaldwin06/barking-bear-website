/**
 * Barking Bear — Contact form submission logger
 * Appends every contact-form submission as a new row in this Google Sheet.
 *
 * SETUP (one time):
 *  1. Open your Google Sheet (or create a new one — any name).
 *  2. Extensions → Apps Script. Delete any code in the editor and paste
 *     this entire file. Click Save (💾).
 *  3. Generate a strong secret, e.g. run in a terminal:
 *       openssl rand -hex 32
 *     Paste it into SECRET_TOKEN below (between the quotes).
 *  4. Deploy → New deployment → (gear icon) → Web app.
 *       - Description: "Barking Bear form logger"
 *       - Execute as: Me
 *       - Who has access: Anyone
 *     Click Deploy and authorize the prompts.
 *  5. Copy the "Web app URL" (looks like
 *     https://script.google.com/macros/s/AKfyc.../exec).
 *  6. In forms/contact.php on your site, paste that URL into
 *     GOOGLE_SHEET_WEBAPP_URL and paste the SAME secret into
 *     GOOGLE_SHEET_TOKEN, then deploy the site.
 *  7. Submit the contact form once — a new row should appear in the sheet.
 *
 * SECURITY: a POST is only logged when it carries the SECRET_TOKEN. Without it,
 * the script returns "Forbidden" and writes nothing, so even someone who finds
 * the Web app URL cannot inject rows. Keep your site repository PRIVATE so the
 * URL and token are not exposed in its history.
 *
 * To update this script later: edit here, then Deploy → Manage deployments →
 * (pencil) → Version: New version → Deploy. The URL stays the same.
 */

var HEADERS = [
  'Timestamp', 'Name', 'Email', 'Phone', 'Street Address', 'City', 'State', 'ZIP',
  'Services', 'Service Other', 'Boarding Dates', 'Dogs',
  "I'd Like To", "I'd Like To - Other",
  'How did you hear', 'Referral Name', 'Referral Other',
  'Raw JSON'
];

// Shared secret — must match GOOGLE_SHEET_TOKEN in forms/contact.php. Only
// POSTs carrying this token are logged. Leave empty to accept any source
// (NOT recommended if your site repo is public).
var SECRET_TOKEN = '';

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureHeaders_(sheet);

    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Reject anything that doesn't carry the shared secret.
    if (SECRET_TOKEN && data.token !== SECRET_TOKEN) {
      return ContentService.createTextOutput('Forbidden')
        .setMimeType(ContentService.MimeType.TEXT);
    }

    var dogs = Array.isArray(data.dogs) ? data.dogs : [];
    var dogsSummary = dogs.map(function (d, i) {
      var parts = [];
      if (d.name) parts.push('Name: ' + d.name);
      if (d.sex)  parts.push('Sex/SN: ' + d.sex);
      if (d.age)  parts.push('Age: ' + d.age);
      if (d.breed) parts.push('Breed: ' + d.breed);
      if (d.crate) parts.push('Crate: ' + d.crate);
      if (d.crate_other) parts.push('Crate other: ' + d.crate_other);
      if (d.notes) parts.push('Notes: ' + d.notes);
      return 'Dog ' + (i + 1) + ' — ' + parts.join(' | ');
    }).join('\n');

    var boarding = (data.boarding_dates && data.boarding_dates.length)
      ? data.boarding_dates.join('  ;  ')
      : '';

    sheet.appendRow([
      data.submitted_at || new Date(),
      data.name || '', data.email || '', data.phone || '',
      data.address1 || '', data.city || '', data.state || '', data.zip || '',
      data.services || '', data.service_other || '',
      boarding, dogsSummary,
      data.contact_preference || '', data.like_to_other || '',
      data.referral || '', data.referral_name || '', data.referral_other || '',
      JSON.stringify(data)
    ]);

    return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// Health check: open the Web app URL in a browser — you should see "OK".
function doGet() {
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}
