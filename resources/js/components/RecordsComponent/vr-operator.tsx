import { useEffect, useState } from 'react';
import { generateColumns } from './columns'; // Import dynamic column generator
import { DataTable } from './data-table';

export default function Operator({ operators, onNextTab }) {
    const [operatorData, setOperatorData] = useState([]);
    const [operatorHeaders, setOperatorHeaders] = useState<{ key: string; label: string }[]>([]);
    console.log('Operators' + operators);

    useEffect(() => {
        // Simulate fetching operator data (replace with actual API call if needed)
        setOperatorData(operators);

        // Generate headers dynamically based on the first operator object
        if (operators.length > 0) {
            const headers = Object.keys(operators[0]).map((key) => ({
                key,
                label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the label
            }));
            setOperatorHeaders(headers);
        }
    }, [operators]);

    const columns = generateColumns(operatorHeaders, { entityType: 'operators' });

    return <DataTable data={operatorData} columns={columns} />;
}
