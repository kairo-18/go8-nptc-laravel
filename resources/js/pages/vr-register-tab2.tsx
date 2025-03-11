import { useState } from 'react';
import { generateColumns } from '../components/RecordsComponent/columns';
import { DataTable } from '../components/RecordsComponent/data-table';

interface CompanyProps {
    companies: { id: number; BusinessPermitNumber: string; CompanyName: string; media?: any[] }[];
    companiesWithMedia: { id: number; media: any[] }[];
}

const ApplicationStatusTabContent = ({ companies, companiesWithMedia }: CompanyProps) => {
    const [open, setOpen] = useState(false);

    const formattedCompanies = companies.length > 0 ? companies[0] : [];
    const transformedCompanies = formattedCompanies.map((company) => ({
        ...company,
        CompanyName: `${company.Status ? `${company.Status} ` : ''}${company.CompanyName}`,
    }));

    const companyHeaders = companies.length > 0 ? Object.keys(companies[0][0]) : [];

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
        },
    );

    return (
        <>
            <DataTable data={transformedCompanies} columns={columns} ColumnFilterName="CompanyName" />
        </>
    );
};

export default ApplicationStatusTabContent;
