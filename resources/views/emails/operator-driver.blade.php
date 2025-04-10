<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject ?? 'Test Email' }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7f6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            background-color: #0044cc;
            color: #ffffff;
            padding: 15px;
            border-radius: 8px 8px 0 0;
        }
        .content {
            margin-top: 20px;
            font-size: 16px;
            line-height: 1.6;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
        .footer a {
            color: #0044cc;
            text-decoration: none;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>{{ $subject ?? 'Test Email' }}</h1>
        </div>

        <div class="content">
            <p>Dear {{ $operatorName }},</p>

            <p>I hope this email finds you well. I am writing to notify you about the status of your recent application. After careful review, we would like to inform you that your application status for the Driver: <strong>{{$userName}}</strong> and Vehicle with the platenumber: <strong>{{$PlateNumber}}</strong> has been updated to <strong>{{ $status }}</strong>.</p>

            @if($status == 'For Payment')
                <p>To proceed with the next steps, please log in to your account at <a href="[Website URL]">[Website URL]</a>. Once logged in, you will find detailed instructions regarding the payment process. We kindly ask you to follow the payment steps outlined there to continue your application process.</p>
            @else
                <p>We truly appreciate the time and effort you invested in submitting your application, and we are committed to providing you with updates throughout the process. Should you have any questions or require further clarification, please do not hesitate to reach out to us.</p>
            @endif

            <p>Thank you once again for your interest, and we look forward to engaging with you further in the future.</p>

            <p>Best regards,</p>
            <p>The Team at NPTC</p>
        </div>

        <div class="footer">
            <p>If you need assistance or have any questions, feel free to <a href="mailto:support@example.com">contact us</a>.</p>
        </div>
    </div>

</body>
</html>
