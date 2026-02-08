import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, FileText, Image } from "lucide-react";

interface FileUploadProps {
  label: string;
  accept: string;
  onChange: (file: File | null) => void;
  helpText?: string;
  type?: "image" | "document";
}

const FileUpload = ({ label, accept, onChange, helpText, type = "document" }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    onChange(selectedFile);

    if (selectedFile && type === "image") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {!file ? (
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          className="w-full h-20 border-dashed flex flex-col gap-1"
        >
          <Upload className="w-5 h-5" />
          <span className="text-sm">Click to upload</span>
        </Button>
      ) : (
        <div className="relative border rounded-lg p-3 flex items-center gap-3 bg-muted/30">
          {preview ? (
            <img src={preview} alt="Preview" className="w-12 h-12 rounded object-cover" />
          ) : (
            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
              {type === "image" ? (
                <Image className="w-6 h-6 text-muted-foreground" />
              ) : (
                <FileText className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
    </div>
  );
};

export default FileUpload;
