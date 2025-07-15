<?php
session_start();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

// Only handle POST request
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $form_type = $_POST['form_type'] ?? '';

    // ✅ STEP 1: Validate Google reCAPTCHA
    $recaptchaSecret = '6LdqO34rAAAAAAnX4GImwtQk79iFk627680A7kx8'; // ← Replace with your secret key from Google
    $recaptchaResponse = $_POST['g-recaptcha-response'] ?? '';

    // Check CAPTCHA is present
    if (empty($recaptchaResponse)) {
        $_SESSION['form_error'] = "Please complete the CAPTCHA.";
        header('Location: ' . $_SERVER['HTTP_REFERER']);
        exit();
    }

    // Verify with Google
    $verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptchaSecret}&response={$recaptchaResponse}");
    $responseData = json_decode($verifyResponse);

    if (!$responseData || !$responseData->success) {
        $_SESSION['form_error'] = "CAPTCHA verification failed. Please try again.";
        header('Location: ' . $_SERVER['HTTP_REFERER']);
        exit();
    }

    // ✅ STEP 2: Send Email using PHPMailer
    $mail = new PHPMailer(true);

    try {
        // SMTP Settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.zoho.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'saifsadi@zohomail.com'; // Your Zoho email
        $mail->Password   = 'aDm1n@11533zzd';       // Your Zoho app password (ideally store securely!)
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;

        // From & To
        $mail->setFrom('saifsadi@zohomail.com', 'Website Form');
        $mail->addAddress('saifsadi@zohomail.com');
        $mail->isHTML(true);

        // Determine form type: contact or registration
        if ($form_type === 'contact') {
            $name    = $_POST['user_name'] ?? '';
            $email   = $_POST['user_email'] ?? '';
            $message = $_POST['user_message'] ?? '';

            $mail->Subject = "New Contact Form Submission";
            $mail->Body    = "
                <strong>Name:</strong> $name <br>
                <strong>Email:</strong> $email <br>
                <strong>Message:</strong><br> $message
            ";

        } elseif ($form_type === 'registration') {
            $name      = $_POST['full_name'] ?? '';
            $email     = $_POST['email'] ?? '';
            $phone     = $_POST['phone'] ?? '';
            $asthmatic = isset($_POST['asthmatic']) ? implode(', ', $_POST['asthmatic']) : 'Not specified';
            $injury    = isset($_POST['injury']) ? implode(', ', $_POST['injury']) : 'Not specified';

            $mail->Subject = "New Class Registration";
            $mail->Body    = "
                <strong>Full Name:</strong> $name <br>
                <strong>Email:</strong> $email <br>
                <strong>Phone:</strong> $phone <br>
                <strong>Asthmatic:</strong> $asthmatic <br>
                <strong>Injury Info:</strong> $injury
            ";
        }

        // Send the email
        $mail->send();
        $_SESSION['form_success'] = "Thank you! Your message has been successfully sent.";
    } catch (Exception $e) {
        $_SESSION['form_error'] = "There was a problem sending your message: " . $mail->ErrorInfo;
    }

    // ✅ STEP 3: Redirect back to the form page
    header('Location: ' . $_SERVER['HTTP_REFERER']);
    exit();
}
?>
