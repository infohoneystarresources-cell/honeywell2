<?php
/* ==========================================================
   Honey Star Resources Limited — contact form handler
   Receives the form on index.html and sends it with PHP mail().
   Settings live in mail-config.php.
   ========================================================== */

$config = require __DIR__ . '/mail-config.php';

// The page script asks for JSON; a browser without JavaScript gets a plain page.
$wantsJson = isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

function respond($ok, $message, $status, $wantsJson)
{
    http_response_code($status);

    if ($wantsJson) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
        exit;
    }

    header('Content-Type: text/html; charset=utf-8');
    $safe = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<title>Honey Star Resources Limited</title></head>'
        . '<body style="font-family: Arial, sans-serif; max-width: 560px; margin: 80px auto; padding: 0 24px; line-height: 1.6">'
        . '<p>' . $safe . '</p><p><a href="index.html#contact">Back to the website</a></p>'
        . '</body></html>';
    exit;
}

// Removes line breaks so a value can never add extra email headers.
function one_line($value)
{
    return trim(preg_replace('/[\r\n]+/', ' ', (string) $value));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Send your enquiry from the contact form on the website.', 405, $wantsJson);
}

// Hidden field that people never see. If it is filled in, a bot sent the form.
if (!empty($_POST['website'])) {
    respond(true, 'Enquiry sent. Thank you for contacting Honey Star Resources.', 200, $wantsJson);
}

$name         = one_line($_POST['name'] ?? '');
$email        = one_line($_POST['email'] ?? '');
$organisation = one_line($_POST['organisation'] ?? '');
$message      = trim((string) ($_POST['message'] ?? ''));

// Check the fields again on the server; the browser checks can be bypassed.
if ($name === '' || strlen($name) > 120) {
    respond(false, 'Enter your name.', 422, $wantsJson);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 200) {
    respond(false, 'Enter a valid email address, like name@company.com.', 422, $wantsJson);
}
if (strlen($organisation) > 160) {
    respond(false, 'Shorten the organisation name to 160 characters or fewer.', 422, $wantsJson);
}
if ($message === '' || strlen($message) > 5000) {
    respond(false, 'Enter a message of up to 5,000 characters.', 422, $wantsJson);
}

// Stop here if mail-config.php still has its placeholder addresses.
if (!filter_var($config['to_email'], FILTER_VALIDATE_EMAIL) || !filter_var($config['from_email'], FILTER_VALIDATE_EMAIL)) {
    respond(false, 'The enquiry form is not set up yet. Add the email addresses in mail-config.php.', 500, $wantsJson);
}

$subject = one_line($config['subject_prefix']) . ' from ' . $name;

$body = "New enquiry from the Honey Star Resources website\n"
    . "--------------------------------------------------\n\n"
    . "Name:         " . $name . "\n"
    . "Email:        " . $email . "\n"
    . "Organisation: " . ($organisation !== '' ? $organisation : 'Not given') . "\n\n"
    . "Message:\n" . $message . "\n";

$fromName = str_replace(['"', '<', '>'], '', one_line($config['from_name']));

$headers = [
    'From: "' . $fromName . '" <' . $config['from_email'] . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
];

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$sent = mail($config['to_email'], $encodedSubject, wordwrap($body, 78, "\n"), implode("\r\n", $headers));

if ($sent) {
    respond(true, 'Enquiry sent. Thank you for contacting Honey Star Resources.', 200, $wantsJson);
}

respond(false, 'The enquiry could not be sent. Try again in a few minutes.', 500, $wantsJson);
