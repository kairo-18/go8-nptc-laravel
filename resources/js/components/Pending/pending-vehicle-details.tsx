import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function PendingVehicleDetails({ item }) {
  const [previewFile, setPreviewFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 bg-white shadow rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{item?.Brand} {item?.Model}</h1>
        <div className="space-x-3">
          <Button className="bg-red-500 text-white hover:bg-red-600">Reject and add notes</Button>
          <Button className="bg-green-500 text-white hover:bg-green-600">Approve and register</Button>
        </div>
      </div>
      <Separator />

      {/* Vehicle Information */}
      <Card className="border-gray-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-700">Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {[  
            ["Status", item?.Status],
            ["Model", item?.Model],
            ["Brand", item?.Brand],
            ["Plate Number", item?.PlateNumber],
            ["Seat Number", item?.SeatNumber],
          ].map(([label, value], index) => (
            <div key={index}>
              <Label className="text-gray-600 text-sm">{label}</Label>
              <Input className="bg-gray-100 text-gray-800" value={value || "-"} readOnly />
            </div>
          ))}

          {/* Media Files */}
          {item?.media_files && item?.media_files.length > 0 ? (
            item?.media_files.map((file, index) => (
              <div key={index} className="flex items-center justify-between border p-3 rounded-lg bg-gray-50">
                <Label>{file.collection_name}</Label>
                <span className="text-gray-700 text-sm">{file.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-500"
                  onClick={() => {
                    setPreviewFile(file);
                    setIsModalOpen(true);
                  }}
                >
                  Preview
                </Button>
              </div>
            ))
          ) : (
            <p>No media files available</p>
          )}
        </CardContent>
      </Card>

      {/* File Preview Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} file={previewFile} />
    </div>
  );
}

function Modal({ isOpen, onClose, file }) {
  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 50 }}>
      <div className="bg-white p-4 rounded-lg max-w-lg relative z-60">
        <Button onClick={onClose} className="absolute top-2 right-2 p-2" variant="outline">
          ✕
        </Button>
        {file.mime_type?.startsWith('image') ? (
          <img src={file.url} alt={file.name} className="w-64 h-auto object-contain" />
        ) : (
          <div className="text-center">Preview for non-image file: {file.name}</div>
        )}
      </div>
    </div>
  );
}
