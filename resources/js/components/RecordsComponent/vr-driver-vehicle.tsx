import { generateColumns } from './columns'; // Import dynamic column generator
import { DataTable } from './data-table';

interface CompanyProps {
    companies: { id: number; BusinessPermitNumber: string }[];
    onNextTab: () => void;
}

export default function Driver({ onNextTab, drivers }) {
    const driverHeaders =
        drivers.length > 0
            ? Object.keys(drivers[0]).map((key) => ({
                  key,
                  label: key.replace(/([A-Z])/g, ' $1').trim(),
              }))
            : [];

    const columns = generateColumns(driverHeaders, {
        entityType: 'drivers',
        statusColumns: ['Status'],
    });
    return <DataTable data={drivers} columns={columns} />;
}
