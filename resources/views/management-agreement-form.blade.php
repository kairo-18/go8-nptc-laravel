<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Management Agreement</title>
    <style>
        body {
            font-family: 'Times New Roman', serif;
            font-size: 10pt;
            line-height: 1.4;
            margin: 40px;
            color: #000;
            background: white;
        }

        .header {
            text-align: center;
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 20px;
        }

        .date-line {
            text-align: left;
            margin-bottom: 20px;
        }

        .party-section {
            margin-bottom: 15px;
        }

        .party-label {
            font-weight: bold;
            display: inline;
        }

        .underlined {
            text-decoration: underline;
            font-weight: bold;
        }

        .whereas-section {
            margin: 20px 0;
        }

        .whereas-clause {
            margin-bottom: 10px;
            text-align: justify;
        }

        .agreement-section {
            margin: 20px 0;
        }

        .section-title {
            font-weight: bold;
            margin: 15px 0 10px 0;
        }

        .numbered-list {
            margin-left: 0;
            padding-left: 20px;
        }

        .sub-list {
            margin-left: 20px;
            padding-left: 20px;
        }

        .vehicle-details {
            margin-left: 40px;
        }

        .vehicle-detail-line {
            margin-bottom: 5px;
        }

        .signature-section {
            margin-top: 30px;
            display: flex;
            justify-content: space-between;
        }

        .signature-block {
            text-align: center;
            width: 45%;
        }

        .signature-line {
            border-bottom: 1px solid #000;
            margin-bottom: 5px;
            height: 40px;
        }

        .witness-section {
            margin-top: 30px;
        }

        .witness-lines {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }

        .witness-line {
            width: 45%;
            border-bottom: 1px solid #000;
            height: 20px;
        }

        .notary-section {
            margin-top: 30px;
            border: 1px solid #000;
            padding: 20px;
        }

        .notary-header {
            text-align: right;
            margin-bottom: 10px;
        }

        .notary-body {
            text-align: justify;
            margin-bottom: 15px;
        }

        .notary-footer {
            margin-top: 20px;
        }

        .doc-info {
            margin-top: 20px;
        }

        .page-break {
            page-break-before: always;
        }

        @media print {
            body {
                margin: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <strong>MANAGEMENT AGREEMENT</strong>
    </div>

    <div class="date-line">
        This Management Agreement is effective on {{ $payload['date'] }}
    </div>

    <div class="party-section">
        <span class="party-label">BETWEEN:</span> <span class="underlined">{{ $payload['operator_name'] }}</span> (Vehicle Owner), of legal age, Filipino and a resident of:
    </div>

    <div style="margin-bottom: 20px;">
        <span class="underlined">{{ $payload['owner_address'] }}</span>
    </div>

    <div class="party-section">
        <span class="party-label">AND:</span> <strong>{{ $payload['company'] }}</strong> (Company) A Corporation duly registered under the laws of the REPUBLIC OF THE PHILIPPINES, with its office located at:
    </div>

    <div style="margin-bottom: 20px;">
        <span class="underlined">{{ $payload['owner_address'] }}</span>
    </div>

    <div class="whereas-section">
        <div class="whereas-clause">
            <strong>WHEREAS</strong> the Company is in the business of operating a Van Rental Services;
        </div>

        <div class="whereas-clause">
            <strong>WHEREAS</strong> the <strong>{{ $payload['company'] }}</strong> has knowledge and expertise in the area of establishing, developing, operating and managing of VAN RENTAL SERVICES, as well as in the area of the management of the vehicle in performing and carrying services similar to those of the Owner;
        </div>

        <div class="whereas-clause">
            <strong>WHEREAS</strong> the Vehicle Owner considers that the <strong>{{ $payload['company'] }}</strong> expertise will enable the vehicle Owner to successfully and profitably operate its vehicle;
        </div>

        <div class="whereas-clause">
            <strong>WHEREAS</strong> <strong>{{ $payload['company'] }}</strong> has represented the Vehicle Owner that it shall, during the term of this Management Agreement, be primarily responsible for the performance of the services to be provided hereunder;
        </div>

        <div class="whereas-clause">
            <strong>WHEREAS</strong> the Vehicle Owner wishes to engage with <strong>{{ $payload['company'] }}</strong> the vehicle on the terms and conditions set out below, and the <strong>{{ $payload['company'] }}</strong> prepared to enter the present Management Agreement with the Vehicle Owner.
        </div>
    </div>

    <div class="agreement-section">
        <strong>NOW THEREFORE, THE PARTIES AGREE AS FOLLOWS:</strong>
    </div>

    <div class="numbered-list">
        <div class="section-title">1. ENGAGEMENT</div>
        <div class="sub-list">
            <div>1.1 The VEHICLE OWNER hereby engages with the COMPANY (<strong>{{ $payload['company'] }}</strong>) to provide expertise in the operation of his/her Vehicle and such management services as may, from time to time, be requested by the Vehicle Owner. Such services shall be provided by the Company and such other staff employed by the Company as maybe named.</div>
        </div>
    </div>

    <div class="numbered-list">
        <div class="section-title">2. VEHICLE SUBJECT FOR MANAGEMENT AGREEMENT</div>
        <div class="sub-list">
            <div>2.1 Details of vehicle are as follows</div>
            <div class="vehicle-details">
                <div class="vehicle-detail-line">a. MAKE : <span class="underlined">{{ $payload['vehicle_make'] }}</span></div>
                <div class="vehicle-detail-line">b. BODY : <span class="underlined">{{ $payload['vehicle_body'] }}</span></div>
                <div class="vehicle-detail-line">c. YEAR/MODEL : <span class="underlined">{{ $payload['vehicle_year'] }}</span></div>
                <div class="vehicle-detail-line">d. CHASSIS NO. : <span class="underlined">{{ $payload['vehicle_chassis_number'] }}</span></div>
                <div class="vehicle-detail-line">e. ENGINE NO. : <span class="underlined">{{ $payload['vehicle_engine_number'] }}</span></div>
                <div class="vehicle-detail-line">f. PLATE NO. : <span class="underlined">{{ $payload['vehicle_plate_number'] }}</span></div>
                <div class="vehicle-detail-line">g. COLOR : <span class="underlined">{{ $payload['vehicle_color'] }}</span></div>
            </div>
        </div>
    </div>

    <div class="numbered-list">
        <div class="section-title">3. TERMS AND RENEWAL</div>
        <div class="sub-list">
            <div style="margin-bottom: 10px;">3.1 The terms of the present Management Agreement shall run for <strong>One (1) Year and (6) Months</strong> from the date of the effectivity of this Agreement, unless sooner terminated or subsequently continued in accordance with terms and conditions of the present Management Agreement.</div>

            <div style="margin-bottom: 10px;">3.2 Should any new policy, law regulation or government measure relation to the operation or licensing of a car or van rental services be enacted, promulgated or otherwise become effective ("Change in Law") during the term of this agreement, the company shall not be liable to refund nor obligated to reimburse the VEHICLE OWNER for any payments, fees or other amounts that have been paid or accrued under this agreement prior to the effective date of such Change in Law.</div>

            <div>3.3 Following any such Change in Law, the Parties agree to meet in good faith to discuss any necessary adjustments to this agreement's terms (Including fees, revenue-share percentages, operating procedures, or compliance obligations) so as to align with the new legal requirements, but no event shall the COMPANY's non-refund obligation under Section 3.2 modified unless expressly agreed in writing by both Parties.</div>
        </div>
    </div>

    <div class="numbered-list">
        <div class="section-title">4. SCOPE OF SERVICE</div>
        <div class="sub-list">
            <div>4.1 Managed Vehicle shall perform the service from Metro Manila to any point of the Philippines.</div>
        </div>
    </div>

    <div class="numbered-list">
        <div class="section-title">5. COMPENSATION AND PAYMENTS TERMS</div>
        <div class="sub-list">
            <div>5.1 The Company will pay the Vehicle Owner in the amount of THREE THOUSAND FIVE HUNDRED PESOS ONLY (P3,500) per daily usage of the Vehicle being managed; subject to a deductions of TEN (10) percent in favor of the Company as a Management fee and percentage tax for the Bureau of Internal Revenue (BIR) for issuance of Sales Invoice.</div>
        </div>
    </div>

    <div class="numbered-list">
        <div class="section-title">6. PERFORMANCE STANDARD</div>
        <div class="sub-list">
            <div>6.1 Vehicle Owner should always make his vehicle ready, in good condition, (Tires, Engine, Air-condition) clean and comfortable to ensure that the vehicle will deliver the service at the right place and at the right time.</div>
        </div>
    </div>

    <div class="numbered-list">
        <div class="section-title">7. DUTIES AND OBLIGATION</div>
        <div class="sub-list">
            <div>7.1 Both PARTIES are expected to observed and follow all terms and conditions stated on this Management Agreement; and make the Vehicle available anytime in cases the Company need its services. In case the managed Vehicle is not available, Vehicle owner is required to informed the Company of the vehicle status.</div>
        </div>
    </div>

    <div class="numbered-list">
        <div class="section-title">8. DISPUTE AND RESOLUTION</div>
        <div class="sub-list">
            <div>8.1 Any dispute arising between the PARTIES shall be determined by a court of competent Jurisdiction of this land and may upon agreement between PARTIES be submitted for arbitration.</div>
        </div>
    </div>

    <div style="margin-top: 30px;">
        <strong>IN WITNESS WHEREOF</strong>, the Parties hereto have caused this agreement to be executed by its duly authorized representatives of the day and the year first above written;
    </div>

    <div class="signature-section">
        <div class="signature-block">
            <div class="signature-line"></div>
            <div><strong>{{ $payload['operator_name'] }}</strong></div>
            <div>Vehicle Owner</div>
            <div style="margin-top: 10px;">Driver's Lic. No. ________________</div>
        </div>
        <div class="signature-block">
            <div class="signature-line"></div>
            <div><strong>{{ $payload['company'] }}</strong></div>
            <div>Company</div>
            <div style="margin-top: 10px;">Represented by:</div>
            <div style="margin-top: 10px;">{{ $payload['owner_name'] }}</div>
            <div>Owner</div>
            <div style="margin-top: 10px;">Driver's Lic. No. ________________</div>
        </div>
    </div>

    <div class="witness-section">
        <div><strong>WITNESS:</strong></div>
        <div class="witness-lines">
            <div class="witness-line"></div>
            <div class="witness-line"></div>
        </div>
    </div>

    <div class="notary-section">
        <div class="notary-header">
            Republic of the Philippines}<br>
            Metro Manila } S.S<br>
            x--------------------------------x
        </div>

        <div class="notary-body">
            <strong>BEFORE ME</strong>, Notary Public for and in the Manila, Philippines this ____________________
        </div>

        <div class="notary-body">
            Personally, <strong>{{ $payload['operator_name'] }}</strong> (Vehicle Owner) and <strong>{{ $payload['owner_name'] }}</strong> (Owner-{{ $payload['company'] }}) personally known to me to be the same person who executed and before me as their own free and voluntarily act and deed.
        </div>

        <div class="notary-body">
            The forgoing instrument consisting of three (3) pages including on which this acknowledgement is written, has been signed by the parties and their instrumental witnesses on each and every page hereof and sealed with my NOTARIAL SEAL.
        </div>

        <div class="notary-footer">
            <strong>IN WITNESS WHEREOF</strong>, I have hereunto set forth my hand this ________________ in Philippines.
        </div>

        <div class="doc-info">
            Doc. No. ________:<br>
            Page No. ______:<br>
            Book No. ______:<br>
            Series of 2025
        </div>
    </div>

    <script>
        // This template is now ready for Laravel Blade rendering
        // All variables are accessed via $payload['key_name']
        // No JavaScript templating needed as Laravel handles the server-side rendering
    </script>
</body>
</html>
