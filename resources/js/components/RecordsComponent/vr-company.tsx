import { generateColumns } from './columns'; // Import dynamic column generator
import { DataTable } from './data-table';

interface CompanyProps {
    companies: { id: number; BusinessPermitNumber: string; CompanyName: string }[];
    onSelectCompany: (companyId: number) => void;
}

export default function Company({ companies, onSelectCompany }: CompanyProps) {
    const companyHeaders =
        companies.length > 0
            ? Object.keys(companies[0]).map((key) => ({
                  key,
                  label: key.replace(/([A-Z])/g, ' $1').trim(),
              }))
            : [];

    const columns = generateColumns(companyHeaders, { entityType: 'companies', statusColumns: ['Status'] });
    console.log(columns);

    return <DataTable data={companies} columns={columns} onRowClick={(row) => onSelectCompany(row.id)} />;
}
