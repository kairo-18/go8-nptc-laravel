import { XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <Card className="w-full max-w-md border-red-500 shadow-md">
        <CardContent className="text-center py-10">
          <XCircle className="w-16 h-16 mx-auto text-red-600" />
          <h2 className="text-2xl font-bold mt-4 text-red-700">Payment Cancelled</h2>
          <p className="mt-2 text-gray-600">It seems like you canceled the payment. No charges were made.</p>
        </CardContent>
      </Card>
    </div>
  );
}
