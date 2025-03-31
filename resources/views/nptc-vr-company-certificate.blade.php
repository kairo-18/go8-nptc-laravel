<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificate of Completion</title>
    <style>
        @page {
            size: A4 landscape; /* Ensure it matches the expected print size */
            margin: 0;
        }

        body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f3f4f6;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh; /* Ensures it takes the full viewport height */
            margin: 0;
        }

        .container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 800px; /* Keeps the original size */
            height: 600px; /* Keeps the original size */
            padding: 20px;
            border: 8px solid #ccc;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            background: url('bg-cert.png') no-repeat center center;
            background-size: cover;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%); /* Perfect centering */
        }

        .mid-content {
            text-align: center;
            position: relative;
            z-index: 1; /* Ensures text appears over the background */
            background: transparent; /* Adds slight transparency for readability */
            padding: 20px;
            border-radius: 10px;
        }

        .logo img {
            width: 120px;
            height: auto;
            margin-bottom: 20px;
        }

        h1 {
            font-size: 40px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .certificate-content {
            font-size: 18px;
            margin-bottom: 20px;
        }

        h2 {
            font-size: 35px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        h3 {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        a {
            font-size: 30px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .hidden-in-pdf {
            margin-top: 20px;
        }

        .hidden-in-pdf {
            position: absolute;
            bottom: -80px; /* Move it below the certificate */
            left: 50%;
            transform: translateX(-50%); /* Centers it horizontally */
            margin-top: 20px;
        }


        .hidden-in-pdf a:hover {
            background-color: darkblue;
        }
        .details{
            color: white;
        }
        

        @media print {
            .hidden-in-pdf {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="mid-content">
            <div class="logo">
                <img src="NPTC_Logo.png" alt="logo">
            </div>
            <div class="details">
                <h1>NPTC Vehicle Rental Company Certification</h1>
                <p class="certificate-content">This is to certify that</p>
                <h2>{{ $payload['name'] }}</h2>
                <p class="certificate-content">has successfully verified as NPTC Vehicle Rental Company</p>
                <h3>{{ $payload['company'] }}</h3>
                <h3>{{ $payload['date'] }}</h3>
            </div>
        </div>
    </div>

    @if(!app('request')->routeIs('download.pdf'))
        <div class="hidden-in-pdf">
            <h2>Download Certificate as PDF</h2>
            <a href="{{ route('download.pdf', ['certificate_type' => 'nptc-vr-company-certificate']) }}">Download PDF</a>
        </div>
    @endif
</body>
</html>
