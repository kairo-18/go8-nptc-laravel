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
            padding: 0;
            line-height: 1.4;
        }
        
        /* Page setup for PDF */
        @page {
            size: A4;
            margin: 25mm 15mm 25mm 15mm;
            
            @top-center {
                content: element(header);
            }
            @bottom-center {
                content: element(footer);
            }
        }
        
        #page-header {
            position: running(header);
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
        }
        
        #page-footer {
            position: running(footer);
            width: 100%;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 5px;
            margin-top: 10px;
        }
        
        .container {
            width: 100%;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .header {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            gap: 20px;
        }
        
        .header-content {
            text-align: center;
        }
        
        .header h2 {
            color: #4F46E5;
            margin: 0;
        }
        
        .company-logo {
            height: 60px;
            width: 60px;
            object-fit: contain;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .details p {
            margin: 5px 0;
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
            margin-bottom: 10px;
        }
        
        .fees p {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
            margin: 5px 0;
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
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 12px;
        }
        
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        
        /* PAGE BREAK STYLES */
        .page-break {
            page-break-before: always;
        }
        
        .contract {
            page-break-before: always;
        }
        
        .acknowledgement-section {
            page-break-before: always;
        }
        
        .contract h3 {
            text-align: center;
            margin-bottom: 15px;
            color: #333;
        }
        
        .contract p {
            margin: 8px 0;
            line-height: 1.4;
            text-align: justify;
            font-size: 12px;
        }
        
        .driver-plate {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin: 15px 0;
        }
        
        .driver-plate div {
            width: 45%;
            text-align: center;
        }
        
        .driver-plate p {
            margin: 5px 0;
        }
        
        .underline {
            border-bottom: 1px solid #000;
            display: inline-block;
            min-width: 200px;
            text-align: center;
        }
        
        .signature-section {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            page-break-inside: avoid;
        }
        
        .signature-section > div {
            text-align: center;
            width: 45%;
        }
        
        .signature-line {
            border-top: 1px solid #000;
            width: 160px;
            margin: 15px auto 5px auto;
            height: 1px;
        }
        
        .checkbox-container {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin: 20px 0;
        }
        
        .checkbox-item {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
        }
        
        .checkbox-item input[type="checkbox"] {
            margin: 0;
            transform: scale(0.9);
        }
        
        .passenger-list-section {
            margin-top: 30px;
        }
        
        .passenger-list-section h4 {
            text-align: center;
            margin-bottom: 15px;
            color: #333;
        }
        
        .notary-section {
            margin-top: 40px;
            font-size: 13px;
            page-break-inside: avoid;
        }
        
        .notary-section p {
            margin: 8px 0;
            line-height: 1.5;
        }
        
        .approval-section {
            text-align: center;
            margin: 30px 0 20px 0;
            page-break-inside: avoid;
        }
        
        .download-btn {
            text-align: right;
            margin: 20px 0;
        }
        
        .download-btn a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #4F46E5;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
        }
        
        /* CRITICAL: Contract footer grouping */
        .contract-footer {
            page-break-inside: avoid;
            margin-top: 30px;
        }
        
        .contract-signatures {
            page-break-inside: avoid;
            margin-bottom: 30px;
        }
        
        .witness-section {
            page-break-inside: avoid;
            margin-top: 20px;
        }
        
        /* Print-specific styles */
        @media print {
            body {
                padding: 0;
                margin: 0;
            }
            
            .container {
                border: none;
                padding: 0;
                margin: 0;
                max-width: none;
            }
            
            .download-btn {
                display: none;
            }
            
            /* Force page breaks */
            .contract {
                page-break-before: always;
            }
            
            .acknowledgement-section {
                page-break-before: always;
            }
            
            /* Prevent page breaks within these sections */
            .signature-section {
                page-break-inside: avoid;
            }
            
            .approval-section {
                page-break-inside: avoid;
            }
            
            .notary-section {
                page-break-inside: avoid;
            }
            
            /* CRITICAL: Keep contract footer elements together */
            .contract-footer {
                page-break-inside: avoid;
            }
            
            .contract-signatures {
                page-break-inside: avoid;
            }
            
            .witness-section {
                page-break-inside: avoid;
            }
            
            /* Prevent orphaned content */
            h3, h4 {
                page-break-after: avoid;
            }
            
            /* Ensure tables don't break awkwardly */
            table {
                page-break-inside: auto;
            }
            
            tr {
                page-break-inside: avoid;
            }
            
            /* Additional safety for keeping sections together */
            .contract p:last-of-type {
                page-break-after: avoid;
            }
        }
        
        /* Screen preview of page breaks */
        @media screen {
            .page-break::before {
                content: "--- PAGE BREAK ---";
                display: block;
                text-align: center;
                color: #666;
                font-size: 12px;
                margin: 20px 0;
                padding: 10px;
                border: 1px dashed #ccc;
                background-color: #f9f9f9;
            }
        }
    </style>
</head>
<body>
    <div id="page-header">
        <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>{{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }} - Trip Ticket & Contract</span>
        </div>
    </div>


    <div class="container">
        <!-- PAGE 1: Trip Ticket Section -->
        <div class="header">
            @if($brandLogoBase64)
                <img src="{{ $brandLogoBase64 }}" alt="Company Logo" class="company-logo">
            @endif
            <div class="header-content">
                <h2>{{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}</h2>
                <p>{{ $trip->driver->operator->vrCompany->Address ?? '36 S ASISTIO ST. EAST GRACE PARK BRGY. 89 CALOOCAN CITY' }}</p>
                <p>Contact no. {{ $trip->driver->operator->vrCompany->ContactNumber ?? '(02)88190967' }} | Business Permit No. _________________</p>
            </div>
        </div>
        
        <!-- Rest of your content remains the same -->
        <div class="details">
            <p><span>Operator:</span> {{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}</p>
            <p><span>Ticket ID:</span> {{ $trip->id }}</p>
            <p><span>Billing ID:</span> BL-3818</p>
            <p><span>Driver:</span> {{ $trip->driver->user->FirstName ?? '' }} {{ $trip->driver->user->LastName ?? '' }}</p>
            <p><span>Unit:</span> {{ $trip->vehicle->Model ?? '' }} {{ $trip->vehicle->Brand ?? '' }}</p>
            <p><span>Plate:</span> {{ $trip->vehicle->PlateNumber ?? '' }}</p>
            <p><span>Application Date:</span> {{ date('F d, Y', strtotime($trip->created_at)) }}</p>
            <p><span>Total Passengers:</span> {{ $trip->passengers->count() }}</p>
            <p><span>Trip Type:</span> {{ $trip->tripType }}</p>
            <p><span>Pick-up Date and Time:</span> {{ date('F d, Y h:i A', strtotime($trip->pickupDate)) }}</p>
            <p><span>Drop-off Date and Time:</span> {{ date('F d, Y h:i A', strtotime($trip->dropOffDate)) }}</p>
            <p><span>Pick-up Address:</span> {{ $trip->pickupAddress }}</p>
            <p><span>Drop-off Address:</span> {{ $trip->dropOffAddress }}</p>
        </div>
        
        <div class="fees">
            <p><span>Base Fee:</span> <span>Php 150.00</span></p>
            <p><span>Additional Fee (Tourist Trip):</span> <span>Php 50.00</span></p>
            <p><span>Passenger Insurance:</span> <span>Php 200.00</span></p>
            <p><span>Others:</span> <span>Php 0.00</span></p>
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
                            <td>{{ $passenger->FirstName ?? '' }}</td>
                            <td>{{ $passenger->LastName ?? '' }}</td>
                            <td>{{ $passenger->ContactNumber ?? '' }}</td>
                            <td>{{ $passenger->Address ?? '' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No passengers found.</p>
        @endif
            <div id="page-footer">
        {{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}
    </div>
        <!-- PAGE 2: Passenger's Lease Contract Section -->
        <div class="contract">
             <div class="header">
            @if($brandLogoBase64)
                <img src="{{ $brandLogoBase64 }}" alt="Company Logo" class="company-logo">
            @endif
            <div class="header-content">
                <h2>{{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}</h2>
                <p>{{ $trip->driver->operator->vrCompany->Address ?? '36 S ASISTIO ST. EAST GRACE PARK BRGY. 89 CALOOCAN CITY' }}</p>
                <p>Contact no. {{ $trip->driver->operator->vrCompany->ContactNumber ?? '(02)88190967' }} | Business Permit No. _________________</p>
            </div>
        </div>
            <h3>PASSENGER'S LEASE CONTRACT</h3>
            
            <p><strong>{{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}</strong>, a company duly organized and registered under the laws of the Republic of the Philippines with principal address at {{ $trip->driver->operator->vrCompany->Address ?? '36 S. Asistio St. East Grace Park Brgy 89 Caloocan City' }}, Philippines, represented herein by its COMPANY REPRESENTATIVE, hereinafter referred to as the "SERVICE PROVIDER",</p>
            
            <p style="text-align: center;">-and-</p>
            
            <p><strong><span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></strong>, of legal age, a Filipino, and resident of <strong><span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></strong>, Philippines, representing his/her party (Annex 1-List of Passengers & Authorization), hereinafter referred to as the "CLIENT".</p>
            
            <p>Now these present witnesses and it is hereby agreed and declared by and between the parties to these present as follows:</p>
            
            <p>1. The Service Provider agrees to provide transportation to the Client for the latter's <strong>{{ $trip->tripType }}</strong>, from <strong>{{ $trip->pickupAddress }}</strong> to <strong>{{ $trip->dropOffAddress }}</strong>.</p>
            
            <p>2. The period for this CONTRACT shall be from <strong>{{ date('F d, Y h:i A', strtotime($trip->pickupDate)) }}</strong> to <strong>{{ date('F d, Y h:i A', strtotime($trip->dropOffDate)) }}</strong> based on the rates previously agreed upon.</p>
            
            <p>3. The amount of rent <strong>Php {{ number_format(400, 2) }}</strong>.</p>
            
            <p>4. The Service Provider shall provide the vehicle for the duration of this contract.</p>
            
            <p>5. The vehicle provided shall be driven by:</p>
            
            <div class="driver-plate">
                <div>
                    <p><strong>{{ $trip->driver->user->FirstName ?? '' }} {{ $trip->driver->user->LastName ?? '' }}</strong></p>
                    <p>Name of the Driver</p>
                </div>
                <div>
                    <p><strong>{{ $trip->vehicle->PlateNumber ?? '' }}</strong></p>
                    <p>Plate Number</p>
                </div>
            </div>
            
            <p>6. In case of any accident resulting in loss or damage to property or life, the sole responsibility for any legal or financial implication would vest with the Insurance Provider.</p>
            
            <p>7. Should it be necessary for either party to bring suit in court for the protection of their interests or enforcement of their rights under this Agreement, it is hereby agreed that this courts of the City of Caloocan, Philippines shall have jurisdiction and shall be the exclusive venue for litigation.</p>
            
            <p>IN WITNESS WHEREOF, the parties have hereunto affixed their signatures this <strong><span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></strong> 2025 in the City of Caloocan, Philippines.</p>
            
            <!-- FIXED: Grouped contract footer to prevent page breaks -->
            <div class="contract-footer">
                <div class="contract-signatures">
                    <div class="signature-section">
                        <div>
                            <p><strong>COMPANY REPRESENTATIVE</strong></p>
                            <div class="signature-line"></div>
                            <p style="margin: 3px 0;">Position</p>
                            <p style="margin: 3px 0;">Valid Id No._______________</p>
                        </div>
                        <div>
                            <div class="signature-line"></div>
                            <p style="margin: 3px 0;">Client</p>
                            <p style="margin: 3px 0;">ID No. _____________________</p>
                        </div>
                    </div>
                </div>
                
                <div class="witness-section">
                    <p style="text-align: center; margin: 10px 0;">Signed in the presence of:</p>
                    
                    <div style="display: flex; justify-content: center; gap: 80px; margin-top: 15px;">
                        <div class="signature-line"></div>
                        <div class="signature-line"></div>
                    </div>
                </div>
            </div>

             <div id="page-footer">
        {{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}
    </div>
            
        </div>
        
        <!-- PAGE 3: List of Passengers Section -->
        <div class="passenger-list-section page-break">
             <div class="header">
            @if($brandLogoBase64)
                <img src="{{ $brandLogoBase64 }}" alt="Company Logo" class="company-logo">
            @endif
            <div class="header-content">
                <h2>{{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}</h2>
                <p>{{ $trip->driver->operator->vrCompany->Address ?? '36 S ASISTIO ST. EAST GRACE PARK BRGY. 89 CALOOCAN CITY' }}</p>
                <p>Contact no. {{ $trip->driver->operator->vrCompany->ContactNumber ?? '(02)88190967' }} | Business Permit No. _________________</p>
            </div>
        </div>
            <h4>LIST OF PASSENGERS</h4>
            <table>
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>SIGNATURE</th>
                        <th>ADDRESS</th>
                    </tr>
                </thead>
                <tbody>
                    @for($i = 1; $i <= 14; $i++)
                        <tr>
                            <td>{{ $trip->passengers->get($i-1)->FirstName ?? '' }} {{ $trip->passengers->get($i-1)->LastName ?? '' }}</td>
                            <td></td>
                            <td>{{ $trip->passengers->get($i-1)->Address ?? '' }}</td>
                        </tr>
                    @endfor
                </tbody>
            </table>
            
            <p>Date: <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></p>
            
            <div class="checkbox-container">
                @foreach(['Drop-off', 'Airport Pick-up', 'Wedding', 'City Tour', 'Vacation', 'Team Building', 'Home Transfer', 'Corporate', 'Government', 'Others'] as $type)
                    <div class="checkbox-item">
                        <input type="checkbox" {{ $trip->tripType == $type ? 'checked' : '' }}>
                        <label>{{ $type }}</label>
                    </div>
                @endforeach
            </div>
            
            <div class="approval-section">
                <p><strong>Approved by:</strong></p>
                <div style="margin-top: 30px;">
                    <p><strong>COMPANY REPRESENTATIVE</strong></p>
                    <div class="signature-line"></div>
                    <p>Position</p>
                </div>
            </div>
             <div id="page-footer">
        {{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}
    </div>
        </div>
        
        <!-- PAGE 4: Acknowledgement Section -->
        <div class="acknowledgement-section">
             <div class="header">
            @if($brandLogoBase64)
                <img src="{{ $brandLogoBase64 }}" alt="Company Logo" class="company-logo">
            @endif
            <div class="header-content">
                <h2>{{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}</h2>
                <p>{{ $trip->driver->operator->vrCompany->Address ?? '36 S ASISTIO ST. EAST GRACE PARK BRGY. 89 CALOOCAN CITY' }}</p>
                <p>Contact no. {{ $trip->driver->operator->vrCompany->ContactNumber ?? '(02)88190967' }} | Business Permit No. _________________</p>
            </div>
        </div>
            <div class="notary-section">
                <p><strong>ACKNOWLEDGEMENT</strong></p>
                <p>Republic of the Philippines}</p>
                <p>City of Caloocan - - - - - - - - } S. S.</p>
                
                <p>BEFORE ME, Notary Public for and in the City Caloocan, Philippines, this <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>, personally appeared <span class="underline">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> and <strong>ROMMEL CARLOS</strong>, personally known to me to be the same persons who executed and voluntarily signed the foregoing contract which they acknowledged before me as their own free and voluntarily act and deed.</p>
                
                <p>The foregoing instrument, consisting of four (4) pages including the page on which this Acknowledgement is written, has been signed by the parties and their instrumental witnesses on each and every page hereof and sealed with my notarial seal.</p>
                
                <p><strong>IN TESTIMONY WHEREOF</strong>, I have hereunto set my hand and affix my notarial seal on the date and place first above stated.</p>
                
                <p style="margin-top: 40px;">
                    Doc. No.: ____________.<br>
                    Page No.: ____________.<br>
                    Book No.: ____________.<br>
                    Series of 2025.
                </p>
                
                <div style="margin-top: 60px; text-align: center;">
                    <div class="signature-line"></div>
                    <p><strong>NOTARY PUBLIC</strong></p>
                </div>
            </div>
        </div>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>
        <br>

         <div id="page-footer">
        {{ $trip->driver->operator->vrCompany->CompanyName ?? 'Company Name' }}
    </div>
    </div>
</body>
</html>