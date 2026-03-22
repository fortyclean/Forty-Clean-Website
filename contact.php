<?php
header('Content-Type: application/json; charset=utf-8');

function respond($success, $message, $errors = [])
{
    echo json_encode(
        [
            'success' => $success,
            'message' => $message,
            'errors'  => $errors,
        ],
        JSON_UNESCAPED_UNICODE
    );
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'طريقة الإرسال غير صحيحة.');
}

$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$service = trim($_POST['service'] ?? '');
$message = trim($_POST['message'] ?? '');
$page    = trim($_POST['page'] ?? '');

$errors = [];

if ($name === '') {
    $errors['name'] = 'الرجاء إدخال الاسم.';
}

if ($phone === '') {
    $errors['phone'] = 'الرجاء إدخال رقم الهاتف.';
}

if ($service === '') {
    $errors['service'] = 'الرجاء اختيار نوع الخدمة.';
}

if ($message === '') {
    $errors['message'] = 'الرجاء كتابة رسالة توضح طلبك.';
}

if (!empty($errors)) {
    respond(false, 'الرجاء تصحيح الحقول المحددة ثم المحاولة مرة أخرى.', $errors);
}

$to      = 'forty@fortyclean.com';
$subject = 'طلب جديد من نموذج موقع فورتي';

$bodyLines = [
    'الاسم: ' . $name,
    'رقم الهاتف: ' . $phone,
    'نوع الخدمة: ' . $service,
    'الصفحة: ' . ($page !== '' ? $page : 'غير محدد'),
    '',
    'نص الرسالة:',
    $message,
];

$body = implode("\n", $bodyLines);

$headers = "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = @mail($to, $subject, $body, $headers);

if (!$sent) {
    respond(false, 'تعذر إرسال الرسالة في الوقت الحالي، يرجى المحاولة لاحقاً.');
}

respond(true, 'تم إرسال طلبك بنجاح، وسنتواصل معك في أقرب وقت ممكن.');

