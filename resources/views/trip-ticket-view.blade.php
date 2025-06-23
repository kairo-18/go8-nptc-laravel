<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trip Ticket</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            border: 1px solid #ddd;
            padding: 20px;
            box-sizing: border-box;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h2 {
            color: #indigo-800;
        }
        .details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        .details p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        .details p span {
            font-weight: bold;
            color: #000;
        }
        .fees {
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .fees p {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
        }
        .fees p span {
            font-weight: bold;
            color: #000;
        }
        .total {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            font-size: 16px;
            font-weight: bold;
        }
        .total span {
            color: #000;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>{{ $trip->driver->operator->vrCompany->CompanyName }}</h2>
        </div>
        <div class="details">
            <p><span>Operator:</span> {{ $trip->driver->operator->vrCompany->CompanyName }}</p>
            <p><span>Ticket ID:</span> {{ $trip->id }}</p>
            <p><span>Billing ID:</span> BL-3818</p>
            <p><span>Driver:</span> {{ $trip->driver->user->FirstName }} {{ $trip->driver->user->LastName }}</p>
            <p><span>Unit:</span> {{ $trip->vehicle->Model }} {{ $trip->vehicle->Brand }}</p>
            <p><span>Plate:</span> {{ $trip->vehicle->PlateNumber }}</p>
            <p><span>Application Date:</span> {{ date('F d, Y', strtotime($trip->created_at)) }}</p>
            <p><span>Total Passengers:</span> {{ $trip->passengers->count() }}</p>
            <p><span>Trip Type:</span> {{ $trip->tripType }}</p>
            <p><span>Pick-up Date and Time:</span> {{ date('F d, Y h:i A', strtotime($trip->pickupDate)) }}</p>
            <p><span>Drop-off Date and Time:</span> {{ date('F d, Y h:i A', strtotime($trip->dropOffDate)) }}</p>
            <p><span>Pick-up Address:</span> {{ $trip->pickupAddress }}</p>
            <p><span>Drop-off Address:</span> {{ $trip->dropOffAddress }}</p>
        </div>
        <div class="fees">
            <p><span>Base Fee:</span> Php 150.00</p>
            <p><span>Additional Fee (Tourist Trip):</span> Php 50.00</p>
            <p><span>Passenger Insurance:</span> Php 200.00</p>
            <p><span>Others:</span> Php 0.00</p>
        </div>
        <div class="total">

            <span>Total:</span>
            <span>Php {{ number_format(400, 2) }}</span>
        </div>

        <h3>Passenger Manifest</h3>
        @if($trip->passengers->count() > 0)
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Contact Number</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($trip->passengers as $passenger)
                        <tr>
                            <td>{{ $passenger->FirstName }}</td>
                            <td>{{ $passenger->LastName }}</td>
                            <td>{{ $passenger->ContactNumber }}</td>
                            <td>{{ $passenger->Address }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No passengers found.</p>
        @endif

    <div style="text-align: right; margin-bottom: 20px; margin-top:20px;">
        <a href="{{ env('APP_URL').'/trip-ticket/download/'.$trip->id }}"
        style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: #fff; text-decoration: none; border-radius: 5px;">
            Download
        </a>
    </div>

    </div>
</body>
</html>
