import { showToast } from '@/components/toast';
import axios from 'axios';
import { useState } from 'react';
import { generateColumns } from './columns';
import Container from './container';
import { DataTable } from './data-table';
import SetStatus from './set-status';
import CompanyFiles from './vr-company-files';

type CompanyType = { id: number; Status?: string; BusinessPermitNumber: string; CompanyName: string; media?: any[] };

interface CompanyProps {
    companies: { id: number; Status?: string; BusinessPermitNumber: string; CompanyName: string; media?: any[] }[];
    companiesWithMedia: { id: number; media: any[] }[];
    onSelectCompany: (companyId: number) => void;
    onStatusUpdate?: (updatedCompany: any) => void;
}

export default function Company({ companies, companiesWithMedia, onSelectCompany, onStatusUpdate }: CompanyProps) {
    const [selectedCompany, setSelectedCompany] = useState<CompanyType | null>(null);
    const [open, setOpen] = useState(false);
    const [containerType, setContainerType] = useState(String);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openContainerModal, setOpenContainerModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [inputValue, setInputValue] = useState('');

    const handleContainer = (containerType: string) => {
        setContainerType(containerType);
        setOpenContainerModal(true);
    };

    const handleViewFiles = (company: CompanyType) => {
        setSelectedCompany(company);
        setOpen(true);
    };

    const setStatusData = (statusData: CompanyType) => {
        setSelectedCompany(statusData);
        setOpenStatusModal(true);
    };

    const transformedCompanies = companies.map((company) => ({
        ...company,
        CompanyName: `${company.Status ? `${company.Status} ` : ''}${company.CompanyName}`,
    }));

    const companyHeaders = companies.length > 0 ? Object.keys(companies[0]) : [];

    // Define primary, secondary, and other columns
    const primaryColumns = ['NPTC_ID', 'CompanyName'];
    const otherColumns = companyHeaders.filter((key) => !primaryColumns.includes(key) && key !== 'Status' && key !== 'id');

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
            showToast('Please select a company', { type: 'error', position: 'top-center' });
            return;
        }

        const method = 'PATCH';
        const url = `vr-company/updateStatus/${selectedCompany.id}`;

        const response = await axios({
            method,
            url,
            data: { status: selectedStatus },
        });

        const updatedCompany = {
            ...selectedCompany,
            Status: selectedStatus,
        };

        if (onStatusUpdate) {
            onStatusUpdate(updatedCompany);
        }

        setOpenStatusModal(false);
    };

    const handleContainerSubmit = async () => {
        setOpenContainerModal(false);
        showToast('Container submitted successfully', { type: 'success', position: 'top-center' });
    };

    return (
        <>
            <DataTable data={transformedCompanies} columns={columns} ColumnFilterName="CompanyName" onRowClick={(row) => onSelectCompany(row.id)} />

            <CompanyFiles selectedCompany={selectedCompany} companiesWithMedia={companiesWithMedia} open={open} setOpen={setOpen} />

            <SetStatus
                type="company"
                selectedData={selectedCompany}
                openStatusModal={openStatusModal}
                setOpenStatusModal={setOpenStatusModal}
                selectedStatus={selectedStatus}
                setStatusData={setStatusData}
                setSelectedStatus={setSelectedStatus}
                handleSubmit={handleSubmitToVRCompany}
            />

            <Container
                openContainerModal={openContainerModal}
                setOpenContainerModal={setOpenContainerModal}
                setInputValue={setInputValue}
                handleSubmit={handleContainerSubmit}
                containerType={containerType}
            />
        </>
    );
}
