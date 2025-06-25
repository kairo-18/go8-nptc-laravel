<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Management Agreement</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            color: #000;
            background: white;
        }

        .page {
            width: 8.5in;
            min-height: 11in;
            margin: 0 auto;
            padding: 1in;
            box-sizing: border-box;
            background: white;
            position: relative;
        }

        .company-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding: 20px 0;
            border-bottom: 2px solid #000;
        }

        .header-left {
            flex: 0 0 auto;
            margin-right: 20px;
        }

        .header-logo {
            max-width: 120px;
            height: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .header-right {
            flex: 1;
            text-align: right;
            color: #333;
        }

        .company-name {
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 8px;
            color: #000;
        }

        .company-address {
            font-size: 11pt;
            margin-bottom: 5px;
            line-height: 1.3;
        }

        .company-contact {
            font-size: 11pt;
            margin-bottom: 5px;
        }

        .company-permit {
            font-size: 10pt;
            margin-bottom: 0;
            font-style: italic;
        }

        .header {
            text-align: center;
            font-weight: bold;
            font-size: 16pt;
            margin-bottom: 30px;
            text-decoration: underline;
        }

        .effective-date {
            text-align: left;
            margin-bottom: 25px;
            font-size: 12pt;
        }

        .party-section {
            margin-bottom: 20px;
            text-align: justify;
        }

        .party-label {
            font-weight: bold;
            display: inline;
        }

        .underlined {
            text-decoration: underline;
            font-weight: bold;
        }

        .address-block {
            margin: 10px 0 20px 0;
            font-weight: bold;
            text-decoration: underline;
        }

        .whereas-section {
            margin: 25px 0;
        }

        .whereas-clause {
            margin-bottom: 15px;
            text-align: justify;
            text-indent: 0;
        }

        .agreement-header {
            margin: 25px 0 20px 0;
            font-weight: bold;
            text-align: center;
        }

        .section-number {
            font-weight: bold;
            margin: 20px 0 10px 0;
        }

        .section-content {
            margin-left: 20px;
            text-align: justify;
        }

        .subsection {
            margin: 10px 0;
            text-align: justify;
        }

        .vehicle-details {
            margin: 15px 0 15px 40px;
        }

        .vehicle-detail-line {
            margin-bottom: 8px;
        }

        .compensation-amount {
            text-transform: uppercase;
            font-weight: bold;
        }

        .witness-section {
            margin-top: 40px;
            text-align: center;
        }

        .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .signature-block {
            width: 45%;
            text-align: center;
        }

        .signature-line {
            border-bottom: 2px solid #000;
            margin-bottom: 8px;
            height: 50px;
            width: 100%;
        }

        .signature-label {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .license-line {
            margin-top: 15px;
            text-align: left;
        }

        .witness-lines {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .witness-line {
            width: 45%;
            border-bottom: 2px solid #000;
            height: 25px;
        }

        .notary-section {
            margin-top: 40px;
            page-break-inside: avoid;
        }

        .notary-header {
            text-align: right;
            margin-bottom: 15px;
            font-size: 11pt;
        }

        .notary-divider {
            text-align: center;
            margin: 10px 0;
        }

        .notary-body {
            text-align: justify;
            margin-bottom: 15px;
        }

        .notary-signature {
            margin-top: 25px;
            text-align: center;
        }

        .doc-info {
            margin-top: 25px;
            font-size: 11pt;
        }

        .bold {
            font-weight: bold;
        }

        /* Print styles */
        @media print {
            body {
                font-size: 11pt;
            }
            .page {
                margin: 0;
                padding: 0.75in;
                width: 100%;
                min-height: auto;
            }
            .page-break {
                page-break-before: always;
            }
        }

        /* Responsive adjustments */
        @media screen and (max-width: 768px) {
            .page {
                width: 100%;
                padding: 20px;
            }
            .company-header {
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            .header-left {
                margin-right: 0;
                margin-bottom: 15px;
            }
            .header-right {
                text-align: center;
            }
            .signature-section {
                flex-direction: column;
                align-items: center;
            }
            .signature-block {
                width: 100%;
                margin-bottom: 30px;
            }
            .witness-lines {
                flex-direction: column;
            }
            .witness-line {
                width: 100%;
                margin-bottom: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Company Header with Logo and Info -->
        <div class="company-header">
            <div class="header-left">
                @if(!empty($payload['company_logo']))
                <img src="{{ $payload['company_logo'] }}" alt="Company Logo" class="header-logo">
                @endif
            </div>
            <div class="header-right">
                <div class="company-name">{{ $payload['company'] ?? 'Company Name' }}</div>
                <div class="company-address">{{ $payload['owner_address'] ?? 'Company Owner Address' }}</div>
                <div class="company-contact">{{ $payload['owner_contact'] ?? 'Company Owner Contact Number' }}</div>
                <div class="company-permit">Company Business Permit Number: {{ $payload['business_permit_number'] ?? 'No business permit number submitted' }}</div>
            </div>
        </div>

        <!-- Document Title -->
        <div class="header">
            MANAGEMENT AGREEMENT
        </div>

        <!-- Effective Date -->
        <div class="effective-date">
            This Management Agreement is effective on <span class="bold">{{ $payload['date'] ?? 'May 18, 2025' }}</span>
        </div>

        <!-- Parties Section -->
        <div class="party-section">
            <span class="party-label">BETWEEN:</span> <span class="underlined">{{ $payload['operator_name'] ?? 'Name of Operator' }}</span> (Vehicle Owner), of legal age, Filipino and a resident of:
        </div>

        <div class="address-block">
            {{ $payload['operator_address'] ?? 'Address of Operator' }}
        </div>

        <div class="party-section">
            <span class="party-label">AND:</span> <span class="bold">{{ $payload['company'] ?? 'Company Name' }}</span> (Company) A Corporation duly registered under the laws of the REPUBLIC OF THE PHILIPPINES, with its office located at:
        </div>

        <div class="address-block">
            {{ $payload['company_address'] ?? 'Company Owner Address' }}
        </div>

        <!-- Whereas Clauses -->
        <div class="whereas-section">
            <div class="whereas-clause">
                <span class="bold">WHEREAS</span> the Company is in the business of operating a Van Rental Services;
            </div>

            <div class="whereas-clause">
                <span class="bold">WHEREAS</span> the <span class="bold">{{ $payload['company'] ?? 'Company Name' }}</span> has knowledge and expertise in the area of establishing, developing, operating and managing of VAN RENTAL SERVICES, as well as in the area of the management of the vehicle in performing and carrying services similar to those of the Owner;
            </div>

            <div class="whereas-clause">
                <span class="bold">WHEREAS</span> the Vehicle Owner considers that the <span class="bold">{{ $payload['company'] ?? 'Company Name' }}</span> expertise will enable the vehicle Owner to successfully and profitably operate its vehicle;
            </div>

            <div class="whereas-clause">
                <span class="bold">WHEREAS</span> <span class="bold">{{ $payload['company'] ?? 'Company Name' }}</span> has represented the Vehicle Owner that it shall, during the term of this Management Agreement, be primarily responsible for the performance of the services to be provided hereunder;
            </div>

            <div class="whereas-clause">
                <span class="bold">WHEREAS</span> the Vehicle Owner wishes to engage with <span class="bold">{{ $payload['company'] ?? 'Company Name' }}</span> the vehicle on the terms and conditions set out below, and the <span class="bold">{{ $payload['company'] ?? 'Company Name' }}</span> prepared to enter the present Management Agreement with the Vehicle Owner.
            </div>
        </div>

        <!-- Agreement Header -->
        <div class="agreement-header">
            <span class="bold">NOW THEREFORE, THE PARTIES AGREE AS FOLLOWS:</span>
        </div>

        <!-- Section 1: Engagement -->
        <div class="section-number">1. <span class="bold">ENGAGEMENT</span></div>
        <div class="section-content">
            <div class="subsection">
                1.1 The VEHICLE OWNER hereby engages with the COMPANY (<span class="bold">{{ $payload['company'] ?? 'Company Name' }}</span>) to provide expertise in the operation of his/her Vehicle and such management services as may, from time to time, be requested by the Vehicle Owner. Such services shall be provided by the Company and such other staff employed by the Company as maybe named.
            </div>
        </div>

        <!-- Section 2: Vehicle Details -->
        <div class="section-number">2. <span class="bold">VEHICLE SUBJECT FOR MANAGEMENT AGREEMENT</span></div>
        <div class="section-content">
            <div class="subsection">
                2.1 Details of vehicle are as follows
            </div>
            <div class="vehicle-details">
                <div class="vehicle-detail-line">a. MAKE : <span class="underlined">{{ $payload['vehicle_make'] ?? 'Vehicle Model' }}</span></div>
                <div class="vehicle-detail-line">b. BODY : <span class="underlined">{{ $payload['vehicle_body'] ?? 'VAN' }}</span></div>
                <div class="vehicle-detail-line">c. YEAR/MODEL : <span class="underlined">{{ $payload['vehicle_year'] ?? '2022' }}</span></div>
                <div class="vehicle-detail-line">d. CHASSIS NO. : <span class="underlined">{{ $payload['vehicle_chassis_number'] ?? 'JN1TC2E26Z0082026' }}</span></div>
                <div class="vehicle-detail-line">e. ENGINE NO. : <span class="underlined">{{ $payload['vehicle_engine_number'] ?? 'YD25109055B' }}</span></div>
                <div class="vehicle-detail-line">f. PLATE NO. : <span class="underlined">{{ $payload['vehicle_plate_number'] ?? 'NIC 2297' }}</span></div>
                <div class="vehicle-detail-line">g. COLOR : <span class="underlined">{{ $payload['vehicle_color'] ?? 'WHITE' }}</span></div>
            </div>
        </div>

        <!-- Section 3: Terms and Renewal -->
        <div class="section-number">3. <span class="bold">TERMS AND RENEWAL</span></div>
        <div class="section-content">
            <div class="subsection">
                3.1 The terms of the present Management Agreement shall run for <span class="bold">One (1) Year and (6) Months</span> from the date of the effectivity of this Agreement, unless sooner terminated or subsequently continued in accordance with terms and conditions of the present Management Agreement.
            </div>
            <div class="subsection">
                3.2 Should any new policy, law regulation or government measure relation to the operation or licensing of a car or van rental services be enacted, promulgated or otherwise become effective ("Change in Law") during the term of this agreement, the company shall not be liable to refund nor obligated to reimburse the VEHICLE OWNER for any payments, fees or other amounts that have been paid or accrued under this agreement prior to the effective date of such Change in Law.
            </div>
            <div class="subsection">
                3.3 Following any such Change in Law, the Parties agree to meet in good faith to discuss any necessary adjustments to this agreement's terms (Including fees, revenue-share percentages, operating procedures, or compliance obligations) so as to align with the new legal requirements, but no event shall the COMPANY's non-refund obligation under Section 3.2 modified unless expressly agreed in writing by both Parties.
            </div>
        </div>

        <!-- Section 4: Scope of Service -->
        <div class="section-number">4. <span class="bold">SCOPE OF SERVICE</span></div>
        <div class="section-content">
            <div class="subsection">
                4.1 Managed Vehicle shall perform the service from Metro Manila to any point of the Philippines.
            </div>
        </div>

        <!-- Section 5: Compensation -->
        <div class="section-number">5. <span class="bold">COMPENSATION AND PAYMENTS TERMS</span></div>
        <div class="section-content">
            <div class="subsection">
                5.1 The Company will pay the Vehicle Owner in the amount of <span class="compensation-amount">Three Thousand Five Hundred Pesos Only (P3,500)</span> per daily usage of the Vehicle being managed; subject to a deductions of TEN (10) percent in favor of the Company as a Management fee and percentage tax for the Bureau of Internal Revenue (BIR) for issuance of Sales Invoice.
            </div>
        </div>

        <!-- Section 6: Performance Standard -->
        <div class="section-number">6. <span class="bold">PERFORMANCE STANDARD</span></div>
        <div class="section-content">
            <div class="subsection">
                6.1 Vehicle Owner should always make his vehicle ready, in good condition, (Tires, Engine, Air-condition) clean and comfortable to ensure that the vehicle will deliver the service at the right place and at the right time.
            </div>
        </div>

        <!-- Section 7: Duties and Obligations -->
        <div class="section-number">7. <span class="bold">DUTIES AND OBLIGATION</span></div>
        <div class="section-content">
            <div class="subsection">
                7.1 Both PARTIES are expected to observed and follow all terms and conditions stated on this Management Agreement; and make the Vehicle available anytime in cases the Company need its services. In case the managed Vehicle is not available, Vehicle owner is required to informed the Company of the vehicle status.
            </div>
        </div>

        <!-- Section 8: Dispute Resolution -->
        <div class="section-number">8. <span class="bold">DISPUTE AND RESOLUTION</span></div>
        <div class="section-content">
            <div class="subsection">
                8.1 Any dispute arising between the PARTIES shall be determined by a court of competent Jurisdiction of this land and may upon agreement between PARTIES be submitted for arbitration.
            </div>
        </div>

        <!-- Witness Whereof -->
        <div class="witness-section">
            <div class="bold">IN WITNESS WHEREOF</div>, the Parties hereto have caused this agreement to be executed by its duly authorized representatives of the day and the year first above written;
        </div>

        <!-- Signature Section -->
        <div class="signature-section">
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-label">{{ $payload['operator_name'] ?? 'Operator Name' }}</div>
                <div>Vehicle Owner</div>
                <div class="license-line">Driver's Lic. No. _______________</div>
            </div>
            <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-label">{{ $payload['company'] ?? 'Company Name' }}</div>
                <div>Company</div>
                <div style="margin-top: 15px;">Represented by:</div>
                <div style="margin-top: 10px;">{{ $payload['owner_name'] ?? 'Owner Name' }}</div>
                <div>Owner</div>
                <div class="license-line">Driver's Lic. No. _______________</div>
            </div>
        </div>

        <!-- Witness Lines -->
        <div style="margin-top: 30px;">
            <div class="bold">WITNESS:</div>
            <div class="witness-lines">
                <div class="witness-line"></div>
                <div class="witness-line"></div>
            </div>
        </div>

        <!-- Notary Section -->
        <div class="notary-section">
            <div class="notary-header">
                Republic of the Philippines}<br>
                Metro Manila } S.S
            </div>
            <div class="notary-divider">
                x----------------------------x
            </div>

            <div class="notary-body">
                <span class="bold">BEFORE ME</span>, Notary Public for and in the Manila, Philippines this ____________________
            </div>

            <div class="notary-body">
                Personally, <span class="bold">{{ $payload['operator_name'] ?? 'Operator Name' }}</span> (Vehicle Owner) and <span class="bold">{{ $payload['owner_name'] ?? 'Company Owner Name' }}</span> (Owner-{{ $payload['company'] ?? 'Company Name' }}) personally known to me to be the same person who executed and before me as their own free and voluntarily act and deed.
            </div>

            <div class="notary-body">
                The forgoing instrument consisting of three (3) pages including on which this acknowledgement is written, has been signed by the parties and their instrumental witnesses on each and every page hereof and sealed with my NOTARIAL SEAL.
            </div>

            <div class="notary-signature">
                <span class="bold">IN WITNESS WHEREOF</span>, I have hereunto set forth my hand this ________________ in Philippines.
            </div>

            <div class="doc-info">
                Doc. No. ________:<br>
                Page No. ______:<br>
                Book No. ______:<br>
                Series of 2025
            </div>
        </div>
    </div>
</body>
</html>
