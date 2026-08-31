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
  if ( !empty($_POST['service_other']) ) {
    $contact->add_message( $_POST['service_other'], 'Service — Other (please specify)' );
  }

  // Boarding date pairs (check-in / check-out)
  $checkins  = $_POST['boarding_checkin']  ?? [];
  $checkouts = $_POST['boarding_checkout'] ?? [];
  if ( is_array($checkins) && is_array($checkouts) ) {
    $pairs = [];
    $count = max( count($checkins), count($checkouts) );
    for ( $i = 0; $i < $count; $i++ ) {
      $ci = trim( $checkins[$i] ?? '' );
      $co = trim( $checkouts[$i] ?? '' );
      if ( $ci !== '' || $co !== '' ) {
        $pairs[] = $ci . ' to ' . $co;
      }
    }
    if ( count($pairs) ) {
      $contact->add_message( implode('; ', $pairs), 'Boarding Dates Needed' );
    }
  }

  // Dogs (parallel arrays)
  $dog_names      = $_POST['dog_name']      ?? [];
  $dog_sex        = $_POST['dog_sex']       ?? [];
  $dog_age        = $_POST['dog_age']       ?? [];
  $dog_breed      = $_POST['dog_breed']     ?? [];
  $crate_trained  = $_POST['crate_trained'] ?? [];
  $crate_other    = $_POST['crate_other']   ?? [];
  $dog_notes      = $_POST['dog_notes']     ?? [];
  $dog_count      = count($dog_names);
  for ( $i = 0; $i < $dog_count; $i++ ) {
    $n = $i + 1;
    $contact->add_message( $dog_names[$i]     ?? '', 'Dog ' . $n . ' Name' );
    $contact->add_message( $dog_sex[$i]       ?? '', 'Dog ' . $n . ' Sex & S/N' );
    $contact->add_message( $dog_age[$i]       ?? '', 'Dog ' . $n . ' Age' );
    $contact->add_message( $dog_breed[$i]     ?? '', 'Dog ' . $n . ' Breed/Mix' );
    $contact->add_message( $crate_trained[$i] ?? '', 'Dog ' . $n . ' Crate Trained' );
    if ( !empty($crate_other[$i]) ) {
      $contact->add_message( $crate_other[$i], 'Dog ' . $n . ' Crate Trained — Other' );
    }
    $contact->add_message( $dog_notes[$i]     ?? '', 'Dog ' . $n . ' Behavior/Medical Notes' );
  }

  $contact->add_message( $_POST['contact_preference'] ?? '', "I'd like to" );
  if ( !empty($_POST['like_to_other']) ) {
    $contact->add_message( $_POST['like_to_other'], "I'd like to — Other (please specify)" );
  }

  $contact->add_message( $_POST['referral'] ?? '', 'How did you hear about us' );
  if ( !empty($_POST['referral_name']) ) {
    $contact->add_message( $_POST['referral_name'], 'Referral — Who can we thank' );
  }
  if ( !empty($_POST['referral_other']) ) {
    $contact->add_message( $_POST['referral_other'], 'How did you hear — Other (please specify)' );
  }

  echo $contact->send();
