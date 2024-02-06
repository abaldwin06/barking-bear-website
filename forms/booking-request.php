<?php
  /**
  * Requires the "PHP Email Form" library
  * The "PHP Email Form" library is available only in the pro version of the template
  * The library should be uploaded to: vendor/php-email-form/php-email-form.php
  * For more info and help: https://bootstrapmade.com/php-email-form/
  */

  // Replace contact@example.com with your real receiving email address
  $receiving_email_address = 'barkingbearpetcare@gmail.com';

  if( file_exists($php_email_form = '../assets/vendor/php-email-form/php-email-form.php' )) {
    include( $php_email_form );
  } else {
    die( 'Unable to load the "PHP Email Form" Library!');
  }

  $booking_request = new PHP_Email_Form;
  $booking_request->ajax = true;
  
  $booking_request->to = $receiving_email_address;
  $booking_request->from_name = $_POST['name'];
  $booking_request->from_email = $_POST['email'];
  $booking_request->subject = "Booking request from Barking Bear website";
  
  // Uncomment below code if you want to use SMTP to send emails. You need to enter your correct SMTP credentials
  /*
  $booking_request->smtp = array(
    'host' => 'example.com',
    'username' => 'example',
    'password' => 'pass',
    'port' => '587'
  );
  */

  $booking_request->add_message( $_POST['name'], 'Name');
  $booking_request->add_message( $_POST['petname'], 'Pet Name');
  $booking_request->add_message( $_POST['email'], 'Email');
  $booking_request->add_message( $_POST['phone'], 'Phone', 4);
  $booking_request->add_message( $_POST['startdate'], 'Start Date', 4);
  $booking_request->add_message( $_POST['enddate'], 'End Date', 4);
  $booking_request->add_message( $_POST['message'], 'Message');
  $booking_request->honeypot = $POST['otherrequest'];
  
  echo $booking_request->send();
?>
