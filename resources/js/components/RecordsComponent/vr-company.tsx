import { generateColumns } from './columns'; // Import dynamic column generator
import { DataTable } from './data-table';

interface CompanyProps {
    companies: { id: number; BusinessPermitNumber: string; CompanyName: string }[];
    onNextTab: () => void;
}

export default function Company({ companies, onNextTab }: CompanyProps) {
    // Generate headers dynamically from the companies array
    const companyHeaders =
        companies.length > 0
            ? Object.keys(companies[0]).map((key) => ({
                  key,
                  label: key.replace(/([A-Z])/g, ' $1').trim(), // Format camelCase/snake_case to readable text
              }))
            : [];

    const columns = generateColumns(companyHeaders, { entityType: 'companies' });

    return <DataTable data={companies} columns={columns} />;
}
