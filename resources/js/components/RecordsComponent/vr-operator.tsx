import { showToast } from '@/components/toast';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { generateColumns } from './columns';
import Container from './container';
import { DataTable } from './data-table';
import SetStatus from './set-status';

interface OperatorProps {
    operators: { [key: string]: any }[];
    onNextTab: () => void;
    onSelectOperator: (id: string) => void;
    onStatusUpdate?: (updatedOperator: any) => void;
}

export default function Operator({ operators, onNextTab, onSelectOperator, onStatusUpdate }: OperatorProps) {
    const [selectedOperator, setSelectedOperator] = useState<any>(null);
    const [operatorData, setOperatorData] = useState(operators);
    const [operatorHeaders, setOperatorHeaders] = useState<{ key: string; label: string }[]>([]);
    const [containerType, setContainerType] = useState('');
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openContainerModal, setOpenContainerModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setOperatorData(operators);
        if (operators.length > 0) {
            const headers = Object.keys(operators[0])
                .filter((key) => key !== 'user') // Exclude the 'user' key
                .map((key) => ({
                    key,
                    label: key
                        .replace(/_count$/, '')
                        .replace(/^vr_/, 'VR ')
                        .replace(/_/g, ' ')
                        .replace(/([A-Z])/g, ' $1')
                        .trim(),
                }));

            setOperatorHeaders(headers);
        }
    }, [operators]);

    const handleSetStatus = (statusData: any) => {
        setSelectedOperator(statusData);
        setOpenStatusModal(true);
    };

    const handleContainer = (containerType: string) => {
        setContainerType(containerType);
        setOpenContainerModal(true);
    };

    const handleSubmitToOperator = async () => {
        if (!selectedOperator) {
            showToast('No operator selected', { type: 'error', position: 'top-center' });
            return;
        }

        await axios.patch(`operator/updateStatus/${selectedOperator.id}`, {
            status: selectedStatus,
        });

        const updatedOperator = {
            ...selectedOperator,
            Status: selectedStatus,
        };

        if (onStatusUpdate) {
            onStatusUpdate(updatedOperator);
        }

        setOpenStatusModal(false);
    };

    const handleContainerSubmit = async () => {
        setOpenContainerModal(false);
        showToast('Container submitted successfully', { type: 'success', position: 'top-center' });
    };

    const transformedOperators = operators.map((operator) => ({
        id: operator.id,
        ...operator,
        Operator: `${operator.Status ? `${operator.Status} ` : ''}${operator.user.FirstName} ${operator.user.LastName}`,
    }));

    const primaryColumns = ['NPTC_ID', 'Operator'];
    const otherColumns = operatorHeaders
        .map((header) => header.key)
        .filter((key) => !primaryColumns.includes(key) && key !== 'Status' && key !== 'id');
    const orderedHeaders = [...primaryColumns, ...otherColumns];

    const columns = generateColumns(
        orderedHeaders.map((key) => ({
            key,
            label: key
                .replace(/_count$/, '')
                .replace(/^vr_/, 'VR ')
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .trim(),
        })),
        {
            entityType: 'operators',
            statusColumns: ['Status'],
            updateStatus: handleSetStatus,
            handleContainer: handleContainer,
        },
    );

    return (
        <>
            <DataTable data={transformedOperators} ColumnFilterName="Operator" columns={columns} onRowClick={(row) => onSelectOperator(row.id)} />
            <SetStatus
                type="operator"
                selectedData={selectedOperator}
                openStatusModal={openStatusModal}
                setOpenStatusModal={setOpenStatusModal}
                selectedStatus={selectedStatus}
                setStatusData={handleSetStatus}
                setSelectedStatus={setSelectedStatus}
                handleSubmit={handleSubmitToOperator}
            />
            <Container
                openContainerModal={openContainerModal}
                setOpenContainerModal={setOpenContainerModal}
                handleSubmit={handleContainerSubmit}
                containerType={containerType}
                setInputValue={setInputValue}
            />
        </>
    );
}
