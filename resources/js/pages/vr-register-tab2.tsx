import { useState } from 'react';
import { generateColumns } from '../components/RecordsComponent/columns';
import { DataTable } from '../components/RecordsComponent/data-table';

interface Company {
    id: number;
    BusinessPermitNumber: string;
    CompanyName: string;
    Status?: string;
    ContactNumber?: string;
    [key: string]: any;
}

interface Operator {
    id: number;
    Status: string;
    user: {
        FirstName: string;
        LastName: string;
        email: string;
        ContactNumber: string;
        created_at: string;
    };
}

interface CompanyProps {
    companies?: Company[][];
    companiesWithMedia?: { id: number; media: any[] }[];
    operators?: Operator[][];
    dataType: 'companies' | 'operators';
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

        const companyHeaders = formattedCompanies.length > 0 ? Object.keys(formattedCompanies[0]) : [];

        const primaryColumns = ['id', 'CompanyName'];
        const otherColumns = companyHeaders.filter((key) => !primaryColumns.includes(key) && key !== 'Status');

        const orderedHeaders = [...primaryColumns, ...otherColumns];

        const tempColumns = generateColumns(
            orderedHeaders.map((key) => ({
                key,
                label: key.replace(/([A-Z])/g, ' $1').trim(),
            })),
            {
                entityType: 'companies',
                statusColumns: ['Status'],
            }
        );

        transformedData = transformedCompanies;
        columns = tempColumns;
    } else if (dataType === 'operators' && operators) {
        transformedData = operators.flat().map((operator) => {
            const createdAtDate = new Date(operator.user.created_at);
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
                created_at: formattedDate,
            };
        });

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
            }
        );
    }

    return (
        <DataTable
            data={transformedData}
            columns={columns}
            ColumnFilterName={dataType === 'companies' ? 'CompanyName' : 'FirstName'}
        />
    );
};

export default ApplicationStatusTabContent;
