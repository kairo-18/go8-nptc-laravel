import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"; // Helps with date formatting

export default function OperatorInformation({ operator, handleChange, handleOperatorUpdate }) {
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

                    {/* ✅ Updated Birth Date Picker using ShadCN Calendar */}
                    <div className="md:col-span-2 ">
                        <Label className="mb-2 block">Birth Date</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full text-left bg-gray-50">
                                    {operator?.user?.BirthDate
                                        ? format(new Date(operator.user.BirthDate), "MMMM dd, yyyy")
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

                    <div className="space-y-2">
                        <Label htmlFor="contact-number">Contact Number</Label>
                        <Input id="contact-number" name="ContactNumber" value={operator?.user?.ContactNumber || ''} onChange={handleChange} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="Address" value={operator?.user?.Address || ''} onChange={handleChange} />
                    </div>
                </div>
                <Button onClick={handleOperatorUpdate} className="mt-4">
                    Update Operator
                </Button>
            </CardContent>
        </Card>
    );
}
