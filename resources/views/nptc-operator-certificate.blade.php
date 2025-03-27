<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
            border: 10px solid #ccc;
            width: 800px;
            margin: auto;
        }
        h1 {
            font-size: 40px;
            margin-bottom: 20px;
        }
        .certificate-content {
            font-size: 20px;
            margin-bottom: 30px;
        }
        .signature {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
        }
    </style>
</head>
<body>
    <h1>NPTC Operator Certification</h1>
    <p class="certificate-content">This is to certify that</p>
    <h2>{{ $payload['name'] }}</h2>
    <p class="certificate-content">has successfully completed the program at</p>
    <h2>{{ $payload['company'] }}</h2>
    <p class="certificate-content">on</p>
    <h2>{{ $payload['date'] }}</h2>
</body>
</html>
