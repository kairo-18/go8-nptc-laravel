import { DataTable } from "./data-table"
import { paymentData, paymentHeaders } from "./array-data" // Import headers
import { generateColumns } from "./columns" // Import dynamic column generator

interface CompanyProps {
    companies: { id: number; BusinessPermitNumber: string }[];
    onNextTab: () => void;
}

export default function Company({ companies, onNextTab }: CompanyProps) { 
    const columns = generateColumns(paymentHeaders) // Generate columns dynamically

    return <DataTable data={paymentData} columns={columns} />
}
    