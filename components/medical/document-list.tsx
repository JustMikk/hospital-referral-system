"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    FileText,
    Download,
    Trash2,
    MoreVertical,
    ExternalLink,
    File,
    FileImage,
    FileSpreadsheet,
} from "lucide-react";
import { deletePatientDocument } from "@/app/actions/documents";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

interface Document {
    id: string;
    title: string;
    type: string;
    cloudinaryUrl: string;
    fileSize: number | null;
    createdAt: Date | string;
    uploadedBy: {
        name: string;
        role: string;
    };
}

interface DocumentListProps {
    documents: Document[];
    patientId: string;
}

const TYPE_LABELS: Record<string, string> = {
    lab_result: "Lab Result",
    imaging: "Imaging",
    prescription: "Prescription",
    discharge_summary: "Discharge Summary",
    consultation: "Consultation",
    procedure: "Procedure Report",
    other: "Other",
};

const TYPE_COLORS: Record<string, string> = {
    lab_result: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    imaging: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    prescription: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    discharge_summary: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    consultation: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    procedure: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

export function DocumentList({ documents, patientId }: DocumentListProps) {
    const router = useRouter();
    const { userRole } = useAuth();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!documentToDelete) return;

        setIsDeleting(true);
        try {
            await deletePatientDocument(documentToDelete.id);
            toast.success("Document deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete document");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
            setDocumentToDelete(null);
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return "Unknown size";
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case "imaging":
                return FileImage;
            case "lab_result":
                return FileSpreadsheet;
            default:
                return FileText;
        }
    };

    if (documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <File className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">No documents yet</h3>
                <p className="text-sm text-muted-foreground">
                    Upload medical documents for this patient
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-3">
                {documents.map((doc) => {
                    const Icon = getFileIcon(doc.type);
                    return (
                        <Card
                            key={doc.id}
                            className="hover:shadow-md transition-shadow border-border/50"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h4 className="font-medium text-sm truncate">
                                                    {doc.title}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            "text-[10px] px-1.5 py-0",
                                                            TYPE_COLORS[doc.type] || TYPE_COLORS.other
                                                        )}
                                                    >
                                                        {TYPE_LABELS[doc.type] || doc.type}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatFileSize(doc.fileSize)}
                                                    </span>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <a
                                                            href={doc.cloudinaryUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center"
                                                        >
                                                            <ExternalLink className="mr-2 h-4 w-4" />
                                                            View
                                                        </a>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <a
                                                            href={doc.cloudinaryUrl}
                                                            download
                                                            className="flex items-center"
                                                        >
                                                            <Download className="mr-2 h-4 w-4" />
                                                            Download
                                                        </a>
                                                    </DropdownMenuItem>
                                                    {userRole === "doctor" && (
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive"
                                                            onClick={() => {
                                                                setDocumentToDelete(doc);
                                                                setDeleteDialogOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                            <span>Uploaded by {doc.uploadedBy.name}</span>
                                            <span>•</span>
                                            <span>
                                                {formatDistanceToNow(new Date(doc.createdAt), {
                                                    addSuffix: true,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <AlertDialog  open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Document</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{documentToDelete?.title}"? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

