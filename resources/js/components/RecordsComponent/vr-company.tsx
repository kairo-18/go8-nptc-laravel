import { useState } from 'react';
import { generateColumns } from './columns';
import { DataTable } from './data-table';
import CompanyFiles from './vr-company-files'; // Import CompanyFiles component
import SetStatus from './set-status'; // Import SetStatus component
import Container from './container'; // Import Container component
import axios from 'axios';

interface CompanyProps {
    companies: { id: number; Status?: string; BusinessPermitNumber: string; CompanyName: string; media?: any[] }[];
    companiesWithMedia: { id: number; media: any[] }[];
    onSelectCompany: (companyId: number) => void;
}

export default function Company({ companies, companiesWithMedia, onSelectCompany }: CompanyProps) {
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [open, setOpen] = useState(false);
    const [containerType, setContainerType] = useState(String);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openContainerModal, setOpenContainerModal] = useState(false);
    const [selectedStatus,  setSelectedStatus] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleContainer = (containerType: string) => {
        setContainerType(containerType);
        setOpenContainerModal(true);
    };


    const handleViewFiles = (company) => {
        setSelectedCompany(company);
        setOpen(true);
    };

    const setStatusData = (statusData) => {
        setSelectedCompany(statusData);
        setOpenStatusModal(true);
    }

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
            onViewFiles: handleViewFiles,
            updateStatus: setStatusData,
            handleContainer: handleContainer,
        },
    );

    const handleSubmitToVRCompany = async () => {
        if (!selectedCompany) {
            alert('No company selected');
            return;
        }

        const method = 'PATCH';
        const url = `vr-company/updateStatus/${selectedCompany.id}`;

        const response = await axios({
            method,
            url,
            data: { status: selectedStatus },
        });

        setOpenStatusModal(false);
    };

    const handleContainerSubmit = async () => {

        alert("This works");
        setOpenContainerModal(false);
    };

    return (
        <>
            <DataTable data={transformedCompanies} columns={columns} ColumnFilterName="CompanyName" onRowClick={(row) => onSelectCompany(row.id)} />

            <CompanyFiles selectedCompany={selectedCompany} companiesWithMedia={companiesWithMedia} open={open} setOpen={setOpen} />

            <SetStatus selectedData={selectedCompany} openStatusModal={openStatusModal} setOpenStatusModal={setOpenStatusModal} selectedStatus={selectedStatus} setStatusData={setStatusData} setSelectedStatus={setSelectedStatus} handleSubmit={handleSubmitToVRCompany}/>

            <Container openContainerModal={openContainerModal} setOpenContainerModal={setOpenContainerModal} setInputValue={setInputValue} handleSubmit={handleContainerSubmit} containerType={containerType}/>
        </>
    );
}
