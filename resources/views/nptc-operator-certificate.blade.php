<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }

        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100vh;
            font-family: Arial, sans-serif;
            background: url('{{ $bgImage }}') no-repeat center center;
            background-size: cover;
        }

        .certificate-wrapper {
            width: 297mm; /* A4 landscape width */
            height: 210mm; /* A4 landscape height */
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            position: relative;
        }

        .certificate-content {
            text-align: center;
            width: 80%;
            margin: 0 auto;
            color: white;
        }

        .logo {
            margin-bottom: 30px;
        }

        .logo img {
            width: 120px;
            height: auto;
        }

        h1 {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 32px;
            font-weight: 600;
            margin: 30px 0;
        }

        h3 {
            font-size: 24px;
            font-weight: 600;
            margin: 20px 0;
        }

        .certificate-text {
            font-size: 20px;
            margin: 15px 0;
        }

        .signature-line {
            margin-top: 50px;
            border-top: 1px solid #fff;
            width: 200px;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="certificate-wrapper">
        <div class="certificate-content">
            <div class="logo">
                <img src="{{ $logoImage }}" alt="NPTC Logo">
            </div>

            <h1>NPTC Operator Certification</h1>

            <p class="certificate-text">This is to certify that</p>

            <h2>{{ $payload['name'] }}</h2>

            <p class="certificate-text">has successfully verified as NPTC Operator</p>

            <h3>{{ $payload['company'] }}</h3>
            <h3>{{ $payload['date'] }}</h3>

            <div class="signature-line"></div>
            <p class="certificate-text">Authorized Signature</p>
        </div>
    </div>
</body>
</html>
