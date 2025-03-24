import { useState } from 'react';
import { generateColumns } from '../components/RecordsComponent/columns';
import { DataTable } from '../components/RecordsComponent/data-table';

interface CompanyProps {
    companies?: { id: number; BusinessPermitNumber: string; CompanyName: string; media?: any[] }[];
    companiesWithMedia?: { id: number; media: any[] }[];
    operators?: any[]; // Add operators to the props interface
    dataType: 'companies' | 'operators'; // Add a prop to specify the data type
}

const ApplicationStatusTabContent = ({ companies, companiesWithMedia, operators, dataType }: CompanyProps) => {
    const [open, setOpen] = useState(false);

    let transformedData: any[] = [];
    let columns: any[] = [];

    if (dataType === 'companies' && companies) {
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

        const tempColumns = generateColumns(
            orderedHeaders.map((key) => ({
                key,
                label: key.replace(/([A-Z])/g, ' $1').trim(),
            })),
            {
                entityType: 'companies',
                statusColumns: ['Status'],
            },
        );
        transformedData = transformedCompanies;
        columns = tempColumns;
    } else if (dataType === 'operators' && operators) {
        // Transform operators data
        // Transform operators data
        transformedData = operators.flat().map((operator) => {
            // Parse the created_at date
            const createdAtDate = new Date(operator.user.created_at);

            // Format the date as "Month Day, Year"
            const formattedDate = createdAtDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });

            return {
                id: operator.id,
                FirstName: operator.user.FirstName,
                LastName: operator.user.LastName,
                email: operator.user.email,
                ContactNumber: operator.user.ContactNumber,
                Status: operator.Status,
                created_at: formattedDate, // Use the formatted date
            };
        });

        // Define columns for operators
        columns = generateColumns(
            [
                { key: 'FirstName', label: 'First Name' },
                { key: 'LastName', label: 'Last Name' },
                { key: 'email', label: 'Email' },
                { key: 'ContactNumber', label: 'Contact Number' },
                { key: 'Status', label: 'Status' },
                { key: 'created_at', label: 'Created At' },
            ],
            {
                entityType: 'operators',
                statusColumns: ['Status'],
            },
        );
    }

    return (
        <>
            <DataTable data={transformedData} columns={columns} ColumnFilterName={dataType === 'companies' ? 'CompanyName' : 'FirstName'} />
        </>
    );
};

export default ApplicationStatusTabContent;
