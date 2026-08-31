<?php
  /**
  * Barking Bear — Contact / Booking request handler
  * Builds a clearly formatted HTML email with all submitted details and sends
  * it to barkingbearpetcare@gmail.com via the "PHP Email Form" library.
  * Also logs every submission to a Google Sheet (best-effort) — see
  * google-apps-script/Code.gs and GOOGLE_SHEET_WEBAPP_URL below.
  */

  $receiving_email_address = 'barkingbearpetcare@gmail.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php') ) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $contact = new PHP_Email_Form;
  $contact->ajax = true;
  $contact->to = $receiving_email_address;
  $contact->from_name = trim( ($_POST['first_name'] ?? '') . ' ' . ($_POST['last_name'] ?? '') );
  $contact->from_email = $_POST['email'] ?? '';
  $contact->subject = 'Contact / Booking Request — Barking Bear';
  // Honeypot: if filled, the library silently returns OK
  $contact->honeypot = $_POST['website'] ?? '';

  // ---- Email delivery ----
  // Default: send via the host's built-in PHP mail() (GoDaddy's local relay),
  // using a branded From address on the site's own domain. The submitter's
  // address is captured as the Reply-To automatically by the library.
  $contact->mailer = 'hello@barkingbearpetcare.com';

  // Optional override: if SMTP credentials are provided (for a host that blocks
  // mail() or requires authenticated SMTP), send through Gmail SMTP instead.
  $smtp_user = getenv('SMTP_USERNAME') ?: '';
  $smtp_pass = getenv('SMTP_PASSWORD') ?: '';
  if ( $smtp_user !== '' && $smtp_pass !== '' ) {
    $contact->smtp = array(
      'host'       => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
      'username'   => $smtp_user,
      'password'   => $smtp_pass,
      'port'       => (int) (getenv('SMTP_PORT') ?: 587),
      'encryption' => getenv('SMTP_ENCRYPTION') ?: 'tls',
    );
    $contact->mailer = $smtp_user;
  }

  // ---- Google Sheet (Apps Script web app) ----
  // Paste your deployed Apps Script web app URL here to log every submission
  // to a Google Sheet (see google-apps-script/Code.gs for setup).
  // Leave empty to skip — the email still sends either way.
  define('GOOGLE_SHEET_WEBAPP_URL', '');
  // Shared secret that proves a POST really comes from your website. Set the
  // SAME value in SECRET_TOKEN in google-apps-script/Code.gs. Leave empty to
  // allow any source (NOT recommended for a public repo). Generate a strong
  // one with:  openssl rand -hex 32
  define('GOOGLE_SHEET_TOKEN', '');

  /** Best-effort POST a submission to the Google Sheet Apps Script web app. */
  function bb_post_to_sheet($url, $payload) {
    if ( !function_exists('curl_init') ) { return; }
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 8);
    curl_exec($ch);
    curl_close($ch);
  }

  /** Append a styled section header to the email body. */
  function bb_section($contact, $title) {
    $contact->message .= '<div style="background:#776391;color:#fff;font-weight:700;padding:9px 12px;font-size:14px;border-radius:4px;margin:18px 0 8px;">'
      . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</div>';
  }

  /** Append a labeled detail row to the email body (blank values show an em dash). */
  function bb_row($contact, $label, $value) {
    $v = trim((string)($value ?? ''));
    if ($v === '') { $v = '—'; }
    $contact->message .= '<div style="margin:0 0 6px;line-height:1.45;">'
      . '<strong>' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . ':</strong> '
      . htmlspecialchars($v, ENT_QUOTES, 'UTF-8') . '</div>';
  }

  $contact->message .= '<div style="font-size:13px;color:#555;margin-bottom:6px;">'
    . 'A new inquiry was submitted from the Barking Bear website:</div>';

  // ---- Pet Parent Details ----
  bb_section($contact, 'Pet Parent Details');
  bb_row($contact, 'Name',          $contact->from_name);
  bb_row($contact, 'Email',         $_POST['email'] ?? '');
  bb_row($contact, 'Phone',         $_POST['phone'] ?? '');
  bb_row($contact, 'Street Address',$_POST['address1'] ?? '');
  bb_row($contact, 'City',          $_POST['address_city'] ?? '');
  bb_row($contact, 'State',         $_POST['address_state'] ?? '');
  bb_row($contact, 'ZIP',           $_POST['address_zip'] ?? '');

  // ---- Services Requested ----
  bb_section($contact, 'Services Requested');
  $services = $_POST['services'] ?? [];
  bb_row($contact, 'Services', is_array($services) ? implode(', ', $services) : '');
  if ( !empty($_POST['service_other']) ) {
    bb_row($contact, 'Service — Other (please specify)', $_POST['service_other']);
  }

  // ---- Boarding Dates Needed (check-in / check-out pairs) ----
  $checkins  = $_POST['boarding_checkin']  ?? [];
  $checkouts = $_POST['boarding_checkout'] ?? [];
  $pairs = [];
  if ( is_array($checkins) || is_array($checkouts) ) {
    $count = max( count((array)$checkins), count((array)$checkouts) );
    for ( $i = 0; $i < $count; $i++ ) {
      $ci = trim( $checkins[$i]  ?? '' );
      $co = trim( $checkouts[$i] ?? '' );
      if ( $ci !== '' || $co !== '' ) {
        $pairs[] = $ci . ' to ' . $co;
      }
    }
  }
  if ( count($pairs) ) {
    bb_section($contact, 'Boarding Dates Needed');
    foreach ( $pairs as $idx => $p ) {
      bb_row($contact, 'Stay ' . ($idx + 1), $p);
    }
  }

  // ---- Dog Details ----
  $dog_names     = $_POST['dog_name']     ?? [];
  $dog_sex       = $_POST['dog_sex']      ?? [];
  $dog_age       = $_POST['dog_age']      ?? [];
  $dog_breed     = $_POST['dog_breed']     ?? [];
  $crate_trained = $_POST['crate_trained'] ?? [];
  $crate_other   = $_POST['crate_other']  ?? [];
  $dog_notes     = $_POST['dog_notes']    ?? [];
  $dog_count     = count((array)$dog_names);
  $dogs          = [];
  if ( $dog_count ) {
    bb_section($contact, 'Dog Details');
    for ( $i = 0; $i < $dog_count; $i++ ) {
      $n = $i + 1;
      $contact->message .= '<div style="border:1px solid #e3e3e3;border-radius:6px;padding:10px 12px;margin:8px 0;background:#fafafa;">';
      $contact->message .= '<div style="font-weight:700;color:#776391;margin-bottom:6px;">Dog ' . $n . '</div>';
      bb_row($contact, 'Name',                $dog_names[$i]     ?? '');
      bb_row($contact, 'Sex & S/N',           $dog_sex[$i]       ?? '');
      bb_row($contact, 'Age',                 $dog_age[$i]       ?? '');
      bb_row($contact, 'Breed/Mix',           $dog_breed[$i]     ?? '');
      bb_row($contact, 'Crate Trained',       $crate_trained[$i] ?? '');
      if ( !empty($crate_other[$i]) ) {
        bb_row($contact, 'Crate Trained — Other', $crate_other[$i]);
      }
      bb_row($contact, 'Behavior/Medical Notes', $dog_notes[$i] ?? '');
      $dogs[] = array(
        'name'        => $dog_names[$i]     ?? '',
        'sex'         => $dog_sex[$i]       ?? '',
        'age'         => $dog_age[$i]       ?? '',
        'breed'       => $dog_breed[$i]     ?? '',
        'crate'       => $crate_trained[$i] ?? '',
        'crate_other' => $crate_other[$i]   ?? '',
        'notes'       => $dog_notes[$i]     ?? '',
      );
      $contact->message .= '</div>';
    }
  }

  // ---- Preferences ----
  bb_section($contact, 'Preferences');
  bb_row($contact, "I'd like to", $_POST['contact_preference'] ?? '');
  if ( !empty($_POST['like_to_other']) ) {
    bb_row($contact, "I'd like to — Other (please specify)", $_POST['like_to_other']);
  }
  bb_row($contact, 'How did you hear about us', $_POST['referral'] ?? '');
  if ( !empty($_POST['referral_name']) ) {
    bb_row($contact, 'Referral — Who can we thank', $_POST['referral_name']);
  }
  if ( !empty($_POST['referral_other']) ) {
    bb_row($contact, 'How did you hear — Other (please specify)', $_POST['referral_other']);
  }

  // ---- Best-effort log to Google Sheet ----
  $sheet_url = getenv('GOOGLE_SHEET_WEBAPP_URL') ?: GOOGLE_SHEET_WEBAPP_URL;
  if ( $sheet_url !== '' ) {
    bb_post_to_sheet($sheet_url, array(
      'token'               => getenv('GOOGLE_SHEET_TOKEN') ?: GOOGLE_SHEET_TOKEN,
      'submitted_at'        => date('c'),
      'name'                => $contact->from_name,
      'email'               => $_POST['email'] ?? '',
      'phone'               => $_POST['phone'] ?? '',
      'address1'            => $_POST['address1'] ?? '',
      'city'                => $_POST['address_city'] ?? '',
      'state'               => $_POST['address_state'] ?? '',
      'zip'                 => $_POST['address_zip'] ?? '',
      'services'            => is_array($services) ? implode(', ', $services) : '',
      'service_other'       => $_POST['service_other'] ?? '',
      'boarding_dates'      => $pairs,
      'dogs'                => $dogs,
      'contact_preference'  => $_POST['contact_preference'] ?? '',
      'like_to_other'       => $_POST['like_to_other'] ?? '',
      'referral'            => $_POST['referral'] ?? '',
      'referral_name'       => $_POST['referral_name'] ?? '',
      'referral_other'      => $_POST['referral_other'] ?? '',
    ));
  }

  echo $contact->send();
