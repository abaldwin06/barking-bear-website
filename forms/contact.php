<?php
  /**
  * Barking Bear — Contact / Booking request handler
  * Requires the "PHP Email Form" library (vendor/php-email-form/php-email-form.php)
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

  $contact->add_message( $contact->from_name, 'Pet Parent Name' );
  $contact->add_message( $_POST['email'] ?? '', 'Email' );
  $contact->add_message( $_POST['phone'] ?? '', 'Phone' );

  // Address
  $contact->add_message( $_POST['address1'] ?? '', 'Street Address' );
  $contact->add_message( $_POST['address_city'] ?? '', 'City' );
  $contact->add_message( $_POST['address_state'] ?? '', 'State' );
  $contact->add_message( $_POST['address_zip'] ?? '', 'ZIP' );

  // Services (checkbox array)
  $services = $_POST['services'] ?? [];
  if ( is_array($services) ) {
    $contact->add_message( implode(', ', $services), 'Services' );
  }

  // Boarding dates (multiple date pickers — only sent when boarding / board & train selected)
  $boarding_dates = $_POST['boarding_dates'] ?? [];
  if ( is_array($boarding_dates) ) {
    $boarding_dates = array_filter($boarding_dates, function ($d) { return trim($d) !== ''; });
    if ( count($boarding_dates) ) {
      $contact->add_message( implode(', ', $boarding_dates), 'Boarding Dates Needed' );
    }
  }

  // Dogs (parallel arrays)
  $dog_names      = $_POST['dog_name']      ?? [];
  $dog_sex        = $_POST['dog_sex']       ?? [];
  $dog_age        = $_POST['dog_age']       ?? [];
  $dog_breed      = $_POST['dog_breed']     ?? [];
  $crate_trained  = $_POST['crate_trained'] ?? [];
  $dog_notes      = $_POST['dog_notes']     ?? [];
  $dog_count      = count($dog_names);
  for ( $i = 0; $i < $dog_count; $i++ ) {
    $n = $i + 1;
    $contact->add_message( $dog_names[$i]     ?? '', 'Dog ' . $n . ' Name' );
    $contact->add_message( $dog_sex[$i]       ?? '', 'Dog ' . $n . ' Sex & S/N' );
    $contact->add_message( $dog_age[$i]       ?? '', 'Dog ' . $n . ' Age' );
    $contact->add_message( $dog_breed[$i]     ?? '', 'Dog ' . $n . ' Breed/Mix' );
    $contact->add_message( $crate_trained[$i] ?? '', 'Dog ' . $n . ' Crate Trained' );
    $contact->add_message( $dog_notes[$i]     ?? '', 'Dog ' . $n . ' Behavior/Medical Notes' );
  }

  $contact->add_message( $_POST['contact_preference'] ?? '', "I'd like to" );
  $contact->add_message( $_POST['referral'] ?? '', 'How did you hear about us' );
  if ( !empty($_POST['referral_name']) ) {
    $contact->add_message( $_POST['referral_name'], 'Referral — Who can we thank' );
  }

  echo $contact->send();
