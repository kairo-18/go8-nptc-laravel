import { useEffect, useState } from 'react';
import { generateColumns } from './columns'; // Import dynamic column generator
import { DataTable } from './data-table';
import SetStatus from './set-status'; // Import SetStatus component
import Container from './container'; // Import Container component
import axios from 'axios';

export default function Operator({ operators, onNextTab, onSelectOperator }) {
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [operatorData, setOperatorData] = useState([]);
    const [operatorHeaders, setOperatorHeaders] = useState<{ key: string; label: string }[]>([]);
    const [containerType, setContainerType] = useState(String);
    const [openStatusModal, setOpenStatusModal] = useState(false);
    const [openContainerModal, setOpenContainerModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [inputValue, setInputValue] = useState('');

    const setStatusData = (statusData) => {
        setSelectedOperator(statusData);
        setOpenStatusModal(true);
    }

    const handleContainer = (containerType: string) => {
        setContainerType(containerType);
        setOpenContainerModal(true);
    };

    useEffect(() => {
        // Simulate fetching operator data (replace with actual API call if needed)
        setOperatorData(operators);

        // Generate headers dynamically based on the first operator object
        if (operators.length > 0) {
            const headers = Object.keys(operators[0]).map((key) => ({
                key,
                label: key
                    .replace(/_count$/, '') // Remove "_count" suffix
                    .replace(/^vr_/, 'VR ') // Replace "vr_" prefix with "VR "
                    .replace(/_/g, ' ') // Replace underscores with spaces
                    .replace(/\b\w/g, (char) => char.toUpperCase()), // Capitalize each word
            }));

            setOperatorHeaders(headers);
        }
    }, [operators]);

    const columns = generateColumns(operatorHeaders, { entityType: 'operators', statusColumns: ['Status'], updateStatus: setStatusData, handleContainer: handleContainer});

    const handleSubmitToOperator = async () => {
        if (!selectedOperator) {
            alert('No operator selected');
            return;
        }

        const method = 'PATCH';
        const url = `operator/updateStatus/${selectedOperator.id}`;

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
                <DataTable data={operatorData} ColumnFilterName="FirstName" columns={columns} onRowClick={(row) => onSelectOperator(row.id)} />

                <SetStatus selectedData={selectedOperator} openStatusModal={openStatusModal} setOpenStatusModal={setOpenStatusModal} selectedStatus={selectedStatus} setStatusData={setStatusData} setSelectedStatus={setSelectedStatus} handleSubmit={handleSubmitToOperator}/>

                <Container openContainerModal={openContainerModal} setOpenContainerModal={setOpenContainerModal} handleSubmit={handleContainerSubmit} containerType={containerType} setInputValue={setInputValue} />
            </>
        );

}
