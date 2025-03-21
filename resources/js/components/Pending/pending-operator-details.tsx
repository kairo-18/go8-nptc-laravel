import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface PendingOperatorDetailsProps {
  item: {
    FirstName: string;
    LastName: string;
    MiddleName?: string;
    vrCompany: string;
    Birthdate: string;
    ContactNumber: string;
    Email: string;
    ValidID?: string;
    Photo1x1?: string;
  };
  onClose: () => void;
}

export default function PendingOperatorDetails({ item }: PendingOperatorDetailsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [operatorId, setOperatorId] = useState<string>("");
  const [note, setNote] = useState<string>("");

  // Function to open the rejection modal
  const openRejectionModal = () => {
    setOperatorId(item?.user?.id || "");
    setIsModalOpen(true);
  };

  // Function to close the rejection modal
  const closeRejectionModal = () => {
    setIsModalOpen(false);
  };

  // Callback after rejection
  const handleRejection = async (note: string, entityId: string, entityType: string) => {
    try {
      const response = await fetch('/api/rejection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any necessary authentication headers, e.g., Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id: item.id,
          type: entityType,
          note,
          user_id: item.user.id, // Make sure to pass the appropriate user ID
        }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Rejection noted:", data);
    } catch (error) {
      console.error("Error submitting rejection:", error);
    }
  };
  
  

  return (
    <>
      <Card className="relative p-6 rounded-md shadow-md border border-gray-300">
        <div className="absolute right-4 flex gap-2">
          <Button
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            onClick={openRejectionModal}
          >
            Reject and add notes
          </Button>
          <Button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Approve and generate documents
          </Button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-4">
          <img
            src="/default-profile.png"
            alt="Profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">{item?.user.FirstName} {item?.user.LastName}</h2>
            <span className="px-2 py-1 text-sm font-medium border border-gray-500 rounded-md">Operator</span>
          </div>
        </div>

        {/* Summary Section */}
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold">Summary</h3>
          <p className="text-gray-600">Review details before submitting</p>

          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">Parent VR Company</label>
                <input
                  type="text"
                  value={item.vr_company.CompanyName}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Valid ID</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.ValidID || "-"}
                    disabled
                    className="w-full p-2 border rounded-md bg-gray-200"
                  />
                  <Button variant="outline">Preview</Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold">Birthdate</label>
                <input
                  type="text"
                  value={item?.user.BirthDate}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Contact Number</label>
                <input
                  type="text"
                  value={item?.user.ContactNumber}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Email</label>
                <input
                  type="text"
                  value={item?.user.email}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">1x1 Photo</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.Photo1x1 || "-"}
                  disabled
                  className="w-full p-2 border rounded-md bg-gray-200"
                />
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Rejection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-xl text-red-500 font-semibold mb-4">Rejection Application?</h2>
            <textarea
              className="w-full p-6 border rounded-md"
              placeholder="Enter rejection note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex justify-end gap-4 mt-4">
              <Button variant="outline" onClick={closeRejectionModal}>
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white"
                onClick={() => handleRejection(note, operatorId, "operator")}
              >
                Reject and send
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
