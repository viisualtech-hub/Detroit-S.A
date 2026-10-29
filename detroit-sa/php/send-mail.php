<?php
// Booking form handler. Needs a PHP host (Live Server can't run PHP).
header('Content-Type: application/json');

$to   = 'admin@detroitsa.co.za';        // where bookings are delivered
$from = 'no-reply@detroitsa.co.za';     // must be an address on your domain

function out($ok, $msg) { echo json_encode(['success' => $ok, 'message' => $msg]); exit; }
function clean($v) { return trim(strip_tags($v ?? '')); }

if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(false, 'Invalid request.');
if (!empty($_POST['website'])) out(true, 'Thank you!');   // honeypot for bots

$name    = clean($_POST['name'] ?? '');
$phone   = clean($_POST['phone'] ?? '');
$email   = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL) ?: '';
$brand   = clean($_POST['brand'] ?? '');
$service = clean($_POST['service'] ?? '');
$message = clean($_POST['message'] ?? '');

if (!$name || !$phone || !$brand || !$service || !$message) out(false, 'Please fill in all required fields.');

$subject = "New booking request: $service ($brand)";
$body = "Name: $name\nPhone: $phone\nEmail: " . ($email ?: 'n/a') . "\nVehicle: $brand\nService: $service\n\nMessage:\n$message\n";
$headers = "From: $from\r\n" . ($email ? "Reply-To: $email\r\n" : '') . "Content-Type: text/plain; charset=UTF-8\r\n";

if (mail($to, $subject, $body, $headers)) out(true, "Thank you $name, we'll get back to you shortly.");
out(false, 'Sorry, something went wrong. Please call 031 577 0160.');
