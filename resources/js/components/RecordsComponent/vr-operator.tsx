import { useEffect, useState } from 'react';
import { generateColumns } from './columns';
import { DataTable } from './data-table';
import SetStatus from './set-status';
import Container from './container';
import axios from 'axios';

interface OperatorProps {
    operators: { [key: string]: any }[];
    onNextTab: () => void;
    onSelectOperator: (id: string) => void;
}

export default function Operator({ operators, onNextTab, onSelectOperator }: OperatorProps) {
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
            alert('No operator selected');
            return;
        }

        await axios.patch(`operator/updateStatus/${selectedOperator.id}`, {
            status: selectedStatus,
        });
        setOpenStatusModal(false);
    };

    const handleContainerSubmit = async () => {
        alert('This works');
        setOpenContainerModal(false);
    };

    const transformedOperators = operators.map((operator) => ({
        ...operator,
        Operator: `${operator.Status ? `${operator.Status} ` : ''}${operator.user.FirstName} ${operator.user.LastName}`,
    }));

    const primaryColumns = ['id', 'Operator'];
    const otherColumns = operatorHeaders.map((header) => header.key).filter((key) => !primaryColumns.includes(key) && key !== 'Status');
    const orderedHeaders = [...primaryColumns, ...otherColumns];

    const columns = generateColumns(
        orderedHeaders.map((key) => ({
            key,
            label: key.replace(/_count$/, '').replace(/^vr_/, 'VR ').replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim(),
        })),
        {
            entityType: 'operators',
            statusColumns: ['Status'],
            updateStatus: handleSetStatus,
            handleContainer: handleContainer,
        }
    );

    return (
        <>
            <DataTable data={transformedOperators} ColumnFilterName="Operator" columns={columns} onRowClick={(row) => onSelectOperator(row.id)} />
            <SetStatus selectedData={selectedOperator} openStatusModal={openStatusModal} setOpenStatusModal={setOpenStatusModal} selectedStatus={selectedStatus} setStatusData={handleSetStatus} setSelectedStatus={setSelectedStatus} handleSubmit={handleSubmitToOperator} />
            <Container openContainerModal={openContainerModal} setOpenContainerModal={setOpenContainerModal} handleSubmit={handleContainerSubmit} containerType={containerType} setInputValue={setInputValue} />
        </>
    );
}
