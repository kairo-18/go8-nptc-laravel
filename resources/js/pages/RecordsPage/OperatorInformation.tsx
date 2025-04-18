import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface OperatorInformationProps {
    operator: any;
    mediaFiles: any[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileRemove: (field: string) => void;
    fileKeys: Record<string, number>;
    files: Record<string, File | null>;
    handleOperatorUpdate: () => void;
}

export default function OperatorInformation({
    operator,
    handleChange,
    handleOperatorUpdate,
    handleFileChange,
    handleFileRemove,
    fileKeys,
    files
}: OperatorInformationProps) {
    const renderFileInput = (field: string, label: string) => (
        <div className="space-y-2">
            <Label htmlFor={field}>{label}</Label>
            <Input
                key={fileKeys[field]}
                id={field}
                type="file"
                name={field}
                onChange={handleFileChange}
            />
            {files[field] && (
                <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="text-sm text-gray-500">{files[field]?.name}</p>
                    <button
                        type="button"
                        onClick={() => handleFileRemove(field)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`Remove ${label}`}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Operator Information</CardTitle>
                <CardDescription>Details of the Operator</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" value={operator?.user?.email || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input id="last-name" name="LastName" value={operator?.user?.LastName || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input id="first-name" name="FirstName" value={operator?.user?.FirstName || ''} onChange={handleChange} />
                    </div>

                    {/* Birth Date Picker */}
                    <div className="md:col-span-2">
                        <Label className="mb-2 block">Birth Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-left bg-black-50">
                                    {operator?.user?.BirthDate
                                        ? format(new Date(operator?.user?.BirthDate), "MMMM dd, yyyy")
                                        : "Select Birth Date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={operator?.user?.BirthDate ? new Date(operator.user.BirthDate) : undefined}
                                    onSelect={(date) => {
                                        handleChange({
                                            target: {
                                                name: "BirthDate",
                                                value: date ? format(date, "yyyy-MM-dd") : "",
                                            },
                                        });
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    {/* Status Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="Status">Status</Label>
                        <Select
                            id="Status"
                            name="Status"
                            value={operator?.Status || ''}
                            onValueChange={(value) => handleChange({
                                target: { name: 'Status', value }
                            })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={operator?.Status || "Select Status"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='Approved'>Approved</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                                <SelectItem value="Suspended">Suspended</SelectItem>
                                <SelectItem value="For Payment">For Payment</SelectItem>
                                <SelectItem value="Banned">Banned</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact-number">Contact Number</Label>
                        <Input id="contact-number" name="ContactNumber" value={operator?.user?.ContactNumber || ''} onChange={handleChange} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="Address" value={operator?.user?.Address || ''} onChange={handleChange} />
                    </div>

                    {/* File Uploads */}
                    {renderFileInput('photo', 'Photo')}
                    {renderFileInput('valid_id_front', 'Valid ID (Front)')}
                    {renderFileInput('valid_id_back', 'Valid ID (Back)')}
                </div>

                <div className="flex gap-4 mt-4">
                    <Button onClick={handleOperatorUpdate}>Update Operator</Button>
                </div>
            </CardContent>
        </Card>
    );
}
