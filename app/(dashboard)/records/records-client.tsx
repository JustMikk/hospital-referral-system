"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/medical/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    Search,
    FileText,
    Download,
    Eye,
    MoreVertical,
    Upload,
    Filter,
    Loader2,
    X,
    File,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Document {
    id: string;
    patientName: string;
    patientId: string;
    type: string;
    title: string;
    date: string;
    uploadedBy: string;
    size: string;
    url: string;
}

interface RecordsClientProps {
    documents: Document[];
}

const documentTypes = [
    "Lab Report",
    "X-Ray",
    "MRI Scan",
    "CT Scan",
    "Blood Test",
    "Consent Form",
    "Prescription",
    "Other",
];

export default function RecordsClient({ documents }: RecordsClientProps) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadData, setUploadData] = useState({
        title: "",
        type: "",
        patientId: "",
    });

    const filteredRecords = documents.filter((record) => {
        const matchesSearch =
            record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === "all" || record.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !uploadData.title || !uploadData.type || !uploadData.patientId) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("title", uploadData.title);
            formData.append("type", uploadData.type);
            formData.append("patientId", uploadData.patientId);

            const response = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to upload document");
            }

            toast.success("Document uploaded successfully");
            setIsUploadOpen(false);
            setSelectedFile(null);
            setUploadData({ title: "", type: "", patientId: "" });
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to upload document");
        } finally {
            setIsUploading(false);
        }
    };

    const handleView = (url: string) => {
        window.open(url, "_blank");
    };

    const handleDownload = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            toast.error("Failed to download file");
        }
    };

    // Get unique patient IDs from documents for the upload form
    const patientOptions = Array.from(
        new Map(documents.map((d) => [d.patientId, { id: d.patientId, name: d.patientName }])).values()
    );

    return (
        <div className="space-y-6">
            <PageHeader
                title="Medical Records"
                description="Access and manage patient medical records securely"
            >
                <Button className="gap-2" onClick={() => setIsUploadOpen(true)}>
                    <Upload className="h-4 w-4" />
                    Upload Record
                </Button>
            </PageHeader>

            <Card className="border-border bg-card">
                <CardHeader className="pb-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-lg font-semibold text-card-foreground">
                            All Records ({filteredRecords.length})
                        </CardTitle>
                        <div className="flex gap-2">
                            <div className="relative flex-1 sm:w-[300px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search records..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger className="w-[150px]">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Filter" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    {documentTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
                            <h3 className="font-semibold text-card-foreground">No records found</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {documents.length === 0
                                    ? "Upload your first medical record to get started"
                                    : "Try adjusting your search or filter"}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Document</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Uploaded By</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead className="w-[50px]" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords.map((record) => (
                                        <TableRow key={record.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                    {record.title}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <div className="font-medium text-card-foreground">
                                                        {record.patientName}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {record.patientId.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{record.type}</Badge>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(record.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {record.uploadedBy}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {record.size}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            className="gap-2"
                                                            onClick={() => handleView(record.url)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View Record
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="gap-2"
                                                            onClick={() => handleDownload(record.url, record.title)}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Medical Record</DialogTitle>
                        <DialogDescription>
                            Upload a new medical record for a patient
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Patient</Label>
                            <Select
                                value={uploadData.patientId}
                                onValueChange={(v) => setUploadData({ ...uploadData, patientId: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patientOptions.map((patient) => (
                                        <SelectItem key={patient.id} value={patient.id}>
                                            {patient.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {patientOptions.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    No patients available. Upload records from a patient's profile page.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Document Title</Label>
                            <Input
                                value={uploadData.title}
                                onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                                placeholder="e.g., Blood Test Results - January 2024"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Document Type</Label>
                            <Select
                                value={uploadData.type}
                                onValueChange={(v) => setUploadData({ ...uploadData, type: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {documentTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>File</Label>
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                                    "hover:border-primary/50 hover:bg-primary/5",
                                    selectedFile && "border-primary bg-primary/5"
                                )}
                                onClick={() => document.getElementById("file-upload-records")?.click()}
                            >
                                <input
                                    id="file-upload-records"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                {selectedFile ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <File className="h-8 w-8 text-primary" />
                                        <div className="text-left">
                                            <p className="font-medium">{selectedFile.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="ml-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            Click to select a file
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            PDF, DOC, DOCX, JPG, PNG (max 10MB)
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                            {isUploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Upload
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

