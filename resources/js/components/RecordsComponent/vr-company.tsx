import { useState } from 'react';
import { generateColumns } from './columns';
import { DataTable } from './data-table';
import CompanyFiles from './vr-company-files'; // Import CompanyFiles component

interface CompanyProps {
    companies: { id: number; Status?: string; BusinessPermitNumber: string; CompanyName: string; media?: any[] }[];
    companiesWithMedia: { id: number; media: any[] }[];
    onSelectCompany: (companyId: number) => void;
}

export default function Company({ companies, companiesWithMedia, onSelectCompany }: CompanyProps) {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [open, setOpen] = useState(false);

    const handleViewFiles = (company) => {
        setSelectedCompany(company);
        setOpen(true);
    };

    const transformedCompanies = companies.map((company) => ({
        ...company,
        CompanyName: `${company.Status ? `${company.Status} ` : ''}${company.CompanyName}`,
    }));

    const companyHeaders = companies.length > 0 ? Object.keys(companies[0]) : [];

    // Define primary, secondary, and other columns
    const primaryColumns = ['id', 'CompanyName'];
    const otherColumns = companyHeaders.filter((key) => !primaryColumns.includes(key) && key !== 'Status');

    // Arrange columns with hierarchy
    const orderedHeaders = [...primaryColumns, ...otherColumns];

    const columns = generateColumns(
        orderedHeaders.map((key) => ({
            key,
            label: key.replace(/([A-Z])/g, ' $1').trim(),
        })),
        {
            entityType: 'companies',
            statusColumns: ['Status'],
            onViewFiles: handleViewFiles, // Pass view function
        },
    );

    return (
        <>
            <DataTable data={transformedCompanies} columns={columns} ColumnFilterName="CompanyName" onRowClick={(row) => onSelectCompany(row.id)} />

            <CompanyFiles selectedCompany={selectedCompany} companiesWithMedia={companiesWithMedia} open={open} setOpen={setOpen} />
        </>
    );
}
