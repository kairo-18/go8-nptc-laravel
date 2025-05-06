import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReturnPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <Card className="w-full max-w-md border-blue-500 shadow-md">
        <CardContent className="text-center py-10">
          <Info className="w-16 h-16 mx-auto text-blue-600" />
          <h2 className="text-2xl font-bold mt-4 text-blue-700">Payment Status</h2>
          <p className="mt-2 text-gray-600">You have returned from the payment gateway. Please wait while we confirm your transaction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
