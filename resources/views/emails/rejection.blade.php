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
            <p>Dear {{ $userName }},</p>
            <p> I hope this email find you well, your application has been rejected.</p>

            <p>Rejetion Reason: {{$notes}}</p>

            <p>Best regards,</p>
            <p>The Team at NPTC</p>
        </div>

        <div class="footer">
            <p>If you need assistance or have any questions, feel free to <a href="mailto:support@example.com">contact us</a>.</p>
        </div>
    </div>

</body>
</html>
