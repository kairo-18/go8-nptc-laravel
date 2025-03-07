import { useEffect, useState } from 'react';
import { generateColumns } from './columns'; // Import dynamic column generator
import { DataTable } from './data-table';

export default function Operator({ operators, onNextTab, onSelectOperator }) {
    const [selectedOperator, setSelectedOperator] = useState(null);

    const [operatorData, setOperatorData] = useState([]);
    const [operatorHeaders, setOperatorHeaders] = useState<{ key: string; label: string }[]>([]);

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

    const columns = generateColumns(operatorHeaders, { entityType: 'operators', statusColumns: 'Status' });

    return <DataTable data={operatorData} ColumnFilterName="FirstName" columns={columns} onRowClick={(row) => onSelectOperator(row.id)} />;
}
