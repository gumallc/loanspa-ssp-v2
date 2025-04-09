import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Pencil, FileText, Upload, Download, Copy, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const { toast } = useToast();
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/users/current"],
  });

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, this would upload the file to a server
      toast({
        title: "File uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  };
  
  const handleFileDownload = (fileName: string) => {
    // In a real app, this would download a file from the server
    toast({
      title: "File download started",
      description: `${fileName} is being downloaded.`,
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>
            <Skeleton className="h-7 w-1/3" />
          </CardTitle>
          <Skeleton className="h-9 w-16" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Skeleton className="h-52 w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-neutral-500">User information not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>My Profile</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEdit}
                className="flex items-center"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Image */}
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-48 w-48">
                      <AvatarImage src={user.profileImage} alt={user.fullName} />
                      <AvatarFallback className="text-4xl">{getInitials(user.fullName)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm" className="mt-4">
                        Change Photo
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Profile Information */}
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Name</h3>
                      {isEditing ? (
                        <input 
                          type="text" 
                          defaultValue={user.fullName} 
                          className="w-full p-2 border rounded-md" 
                        />
                      ) : (
                        <p className="text-neutral-800">{user.fullName}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Home Phone</h3>
                      {isEditing ? (
                        <input 
                          type="text" 
                          defaultValue={user.homePhone} 
                          className="w-full p-2 border rounded-md" 
                        />
                      ) : (
                        <p className="text-neutral-800">{user.homePhone}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Cell Phone</h3>
                      {isEditing ? (
                        <input 
                          type="text" 
                          defaultValue={user.cellPhone} 
                          className="w-full p-2 border rounded-md" 
                        />
                      ) : (
                        <p className="text-neutral-800">{user.cellPhone}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Email</h3>
                      {isEditing ? (
                        <input 
                          type="email" 
                          defaultValue={user.email} 
                          className="w-full p-2 border rounded-md" 
                        />
                      ) : (
                        <p className="text-neutral-800">{user.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Address</h3>
                      {isEditing ? (
                        <input 
                          type="text" 
                          defaultValue={user.address} 
                          className="w-full p-2 border rounded-md" 
                        />
                      ) : (
                        <p className="text-neutral-800">{user.address}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-neutral-500 mb-1">Zip Code</h3>
                      {isEditing ? (
                        <input 
                          type="text" 
                          defaultValue={user.zipCode} 
                          className="w-full p-2 border rounded-md" 
                        />
                      ) : (
                        <p className="text-neutral-800">{user.zipCode}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2 mt-4">
                      <h3 className="text-sm font-medium text-neutral-500 mb-3">Marketing Communication Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="marketing-1" defaultChecked={true} disabled={!isEditing} />
                          <label htmlFor="marketing-1" className="text-sm text-neutral-800">Consent for Email Marketing</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="marketing-2" defaultChecked={true} disabled={!isEditing} />
                          <label htmlFor="marketing-2" className="text-sm text-neutral-800">Consent for SMS Marketing</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="marketing-3" defaultChecked={false} disabled={!isEditing} />
                          <label htmlFor="marketing-3" className="text-sm text-neutral-800">Consent for Phone Marketing</label>
                        </div>
                      </div>
                    </div>
                    
                    {isEditing && (
                      <div className="md:col-span-2 mt-4 flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsEditing(false)}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Loan Documents</CardTitle>
              <CardDescription>View and download your loan documents or upload verification documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="download">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="download">Download Documents</TabsTrigger>
                  <TabsTrigger value="upload">Upload Verification</TabsTrigger>
                </TabsList>
                
                <TabsContent value="download">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="rounded-md bg-primary-50 p-2">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">Loan Agreement</h3>
                            <div className="text-xs text-neutral-500">PDF • 2.3 MB</div>
                          </div>
                          <p className="text-sm text-neutral-600 mb-3">Your original loan agreement document containing all terms and conditions.</p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => handleFileDownload("Loan Agreement.pdf")}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="rounded-md bg-primary-50 p-2">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">Payment Schedule</h3>
                            <div className="text-xs text-neutral-500">PDF • 1.5 MB</div>
                          </div>
                          <p className="text-sm text-neutral-600 mb-3">Detailed payment schedule for your loan with payment dates and amounts.</p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => handleFileDownload("Payment Schedule.pdf")}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-start space-x-4">
                        <div className="rounded-md bg-primary-50 p-2">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">Annual Statement</h3>
                            <div className="text-xs text-neutral-500">PDF • 1.8 MB</div>
                          </div>
                          <p className="text-sm text-neutral-600 mb-3">Annual statement showing payments made and interest paid for tax purposes.</p>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center"
                              onClick={() => handleFileDownload("Annual Statement.pdf")}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="upload">
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center">
                        <Upload className="h-8 w-8 text-neutral-400 mb-2" />
                        <h3 className="text-lg font-medium mb-1">Upload Verification Documents</h3>
                        <p className="text-sm text-neutral-500 mb-4">
                          Drag and drop your files here, or click to browse
                        </p>
                        <input 
                          type="file" 
                          id="document-upload" 
                          className="hidden" 
                          onChange={handleFileUpload}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                        <label htmlFor="document-upload">
                          <Button variant="outline" size="sm" className="cursor-pointer">
                            Browse Files
                          </Button>
                        </label>
                        <p className="text-xs text-neutral-500 mt-4">
                          Supported file types: PDF, JPG, JPEG, PNG (max 10MB)
                        </p>
                      </div>
                    </div>

                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Verification Documents Required</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Proof of Income (Pay stubs, W-2, or Tax Returns)</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Proof of Identity (Government-issued ID)</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>Proof of Address (Utility bill, lease agreement)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Recently Uploaded Documents</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-md">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-neutral-500" />
                            <span className="font-medium text-sm">ID_Verification.pdf</span>
                          </div>
                          <div className="flex items-center space-x-1 text-green-600 text-xs">
                            <CheckCircle className="h-4 w-4" />
                            <span>Verified</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-neutral-50 rounded-md">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-neutral-500" />
                            <span className="font-medium text-sm">Paystub_March2025.pdf</span>
                          </div>
                          <div className="flex items-center space-x-1 text-amber-600 text-xs">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Pending Review</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
