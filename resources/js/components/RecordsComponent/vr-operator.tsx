import { useEffect, useState } from 'react';
import { generateColumns } from './columns'; // Import dynamic column generator
import { DataTable } from './data-table';

<<<<<<< Updated upstream
export default function Operator({ operators, onNextTab }) {
    const [operatorData, setOperatorData] = useState([]);
    const [operatorHeaders, setOperatorHeaders] = useState<{ key: string; label: string }[]>([]);
    console.log('Operators' + operators);
=======
export default function Operator({ operators, onNextTab, onSelectOperator }) {
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [operatorData, setOperatorData] = useState([]);
>>>>>>> Stashed changes

    useEffect(() => {
        setOperatorData(operators);
<<<<<<< Updated upstream

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
=======
    }, [operators]);

    

    const transformedOperators = operators.map((operator) => ({
        ...operator,
        Operator: `${operator.Status ? `${operator.Status} ` : ''}${operator.FirstName + ' ' + operator.LastName} `,
    }));

    const operatorHeaders = operators.length > 0 ? Object.keys(operators[0]) : [];

    // Define primary and other columns
    const primaryColumns = ['id', 'Operator'];
    const otherColumns = operatorHeaders.filter((key) => !primaryColumns.includes(key) && key !== 'Status' && key !== 'Operator');

    // Arrange columns with hierarchy
    const orderedHeaders = [...primaryColumns, ...otherColumns];

    const columns = generateColumns(
        orderedHeaders.map((key) => ({
            key,
            label: key
                .replace(/_count$/, '') // Remove "_count" suffix
                .replace(/^vr_/, 'VR ') // Replace "vr_" prefix with "VR "
                .replace(/_/g, ' ') // Replace underscores with spaces
                .replace(/([A-Z])/g, ' $1') // Add space before capital letters
                .trim(), // Trim extra spaces
        })),
        {
            entityType: 'operators',
            statusColumns: ['Status'],
        }
    );

    return <DataTable data={transformedOperators} ColumnFilterName="Operator" columns={columns} onRowClick={(row) => onSelectOperator(row.id)} />;
>>>>>>> Stashed changes
}
