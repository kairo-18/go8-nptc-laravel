import React, { useState } from "react";
import MainLayout from "./mainLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useForm } from "@inertiajs/react";
import { Select } from "@radix-ui/react-select";
import { SelectTrigger } from "@radix-ui/react-select";
import { SelectContent, SelectItem } from "@/components/ui/select";

const modePayments = ["G-cash", "Maya", "Bank Transfer"];

export default function ManualPayment({ operatorId, totalAmount }) {
    const { data, setData, post, processing } = useForm({
        operator_id :1,
        AccountName: "",
        ModePayment: "",
        Receipt: null,
        ReferenceNumber: "",
        AccountNumber: "",
        Notes: "",
        Amount: totalAmount.toString(),    
    });

    const [responseMessage, setResponseMessage] = useState("");

    const handlePayment = () => {
        setResponseMessage(`Payment of ₱${totalAmount.toLocaleString()} submitted for Operator ID: ${operatorId}`);
    };
    const handleFileChange = (e) => {
        setData("Receipt", e.target.files[0]); // Store file in state
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });
        console.log(data);
        post(route("manual-payments.store"), {
            data: formData,
       
            onSuccess: () => setResponseMessage("Payment submitted successfully!"),
        });
    };

    return (
        <MainLayout>
            <form onSubmit={handleSubmit} className="p-4 border rounded shadow-lg flex flex-col">
                <div className="w-full">
                    <h2 className="text-lg font-bold mb-2">Manual Direct Payment</h2>
                </div>

                <div className="w-full border border-black flex justify-between items-center">
                    <p>Operator ID: {operatorId}</p>
                    <p>Total Amount: ₱{totalAmount.toLocaleString()}</p>
                    <p>Requesting documents for</p>
                </div>

                <div className="w-full border border-black flex flex-col p-3 gap-5">
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <Label>Mode of Payment</Label>
                            <Select
                                value={data.ModePayment}
                                onValueChange={(value) => setData("ModePayment", value)}
                            >
                                <SelectTrigger className="w-full border p-2 rounded">
                                    {data.ModePayment || "Select a payment mode"}
                                </SelectTrigger>
                                <SelectContent>
                                    {modePayments.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {mode}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Receipt/Screenshot</Label>
                            <Input id="Receipt" type="file" onChange={handleFileChange} />
                        </div>
                        <div>
                            <Label>Account Name</Label>
                            <Input 
                                value={data.AccountName}
                                onChange={(e) => setData("AccountName", e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Account Number</Label>
                            <Input 
                                value={data.AccountNumber}
                                onChange={(e) => setData("AccountNumber", e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Reference Number</Label>
                            <Input 
                                value={data.ReferenceNumber}
                                onChange={(e) => setData("ReferenceNumber", e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Notes</Label>
                            <Input 
                                value={data.Notes}
                                onChange={(e) => setData("Notes", e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            disabled={processing}
                            onClick={handleSubmit}
                        >
                            {processing ? "Submitting..." : "Submit Payment"}
                        </button>
                    </div>
                </div>

                {responseMessage && <p className="mt-2 text-green-600">{responseMessage}</p>}
            </form>
        </MainLayout>
    );
}
