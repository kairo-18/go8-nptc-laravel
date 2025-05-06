import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ResponsePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Card className="w-full max-w-md border-green-500 shadow-md">
        <CardContent className="text-center py-10">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
          <h2 className="text-2xl font-bold mt-4 text-green-700">Payment Successful</h2>
          <p className="mt-2 text-gray-600">Thank you! Your payment has been processed successfully.</p>
        </CardContent>
      </Card>
    </div>
  );
}
