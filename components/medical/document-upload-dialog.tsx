"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Loader2, X, File } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DOCUMENT_TYPES = [
    { value: "lab_result", label: "Lab Result" },
    { value: "imaging", label: "Imaging (X-Ray, CT, MRI)" },
    { value: "prescription", label: "Prescription" },
    { value: "discharge_summary", label: "Discharge Summary" },
    { value: "consultation", label: "Consultation Note" },
    { value: "procedure", label: "Procedure Report" },
    { value: "other", label: "Other" },
];

interface DocumentUploadDialogProps {
    patientId: string;
    patientName: string;
    trigger?: React.ReactNode;
}

export function DocumentUploadDialog({
    patientId,
    patientName,
    trigger,
}: DocumentUploadDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PDF and Word documents are allowed");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File size must be less than 10MB");
            return;
        }

        setSelectedFile(file);
        if (!title) {
            setTitle(file.name.replace(/\.[^/.]+$/, ""));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !title || !type) {
            toast.error("Please fill in all fields");
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("title", title);
            formData.append("type", type);
            formData.append("patientId", patientId);

            const response = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to upload document");
            }

            toast.success("Document uploaded successfully");
            setOpen(false);
            resetForm();
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Failed to upload document");
        } finally {
            setUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setTitle("");
        setType("");
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    return (
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Document
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Upload Medical Document
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <p className="text-sm text-muted-foreground">
                        Upload a document for <span className="font-medium text-foreground">{patientName}</span>
                    </p>

                    {/* File Drop Zone */}
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                            dragActive
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50",
                            selectedFile && "border-primary bg-primary/5"
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    handleFileSelect(e.target.files[0]);
                                }
                            }}
                        />

                        {selectedFile ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <File className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-sm">{selectedFile.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatFileSize(selectedFile.size)}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 ml-auto"
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
                                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                <p className="text-sm font-medium">
                                    Drop your file here or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PDF, DOC, DOCX up to 10MB
                                </p>
                            </>
                        )}
                    </div>

                    {/* Document Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Document Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Blood Test Results - January 2026"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Document Type */}
                    <div className="space-y-2">
                        <Label htmlFor="type">Document Type</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                                {DOCUMENT_TYPES.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                        {t.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!selectedFile || !title || !type || uploading}
                        className="gap-2"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="h-4 w-4" />
                                Upload
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

