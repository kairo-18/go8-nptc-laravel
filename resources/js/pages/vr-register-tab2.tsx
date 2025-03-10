import { SetStateAction, useState } from 'react';
import { generateColumns } from '../components/RecordsComponent/columns';
import { DataTable } from '../components/RecordsComponent/data-table';
import CompanyFiles from '../components/RecordsComponent/vr-company-files'; // Import CompanyFiles component

interface CompanyProps {
    companies: { id: number; BusinessPermitNumber: string; CompanyName: string; media?: any[] }[];
    companiesWithMedia: { id: number; media: any[] }[];
    onSelectCompany: (companyId: number) => void; // Update to pass the company ID
}

const ApplicationStatusTabContent = ({ companies, companiesWithMedia, onSelectCompany }: CompanyProps) => {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [open, setOpen] = useState(false);

    const handleViewFiles = (company: SetStateAction<null>) => {
        setSelectedCompany(company);
        setOpen(true);
    };

    const companyHeaders =
        companies.length > 0
            ? Object.keys(companies[0]).map((key) => ({
                  key,
                  label: key.replace(/([A-Z])/g, ' $1').trim(),
              }))
            : [];

    const columns = generateColumns(companyHeaders, {
        entityType: 'companies',
        statusColumns: ['Status'],
        onViewFiles: handleViewFiles, // Pass view function
    });

    return (
        <>
            <DataTable data={companies} columns={columns} ColumnFilterName="CompanyName" />

            <CompanyFiles selectedCompany={selectedCompany} companiesWithMedia={companiesWithMedia} open={open} setOpen={setOpen} />
        </>
    );
};

export default ApplicationStatusTabContent