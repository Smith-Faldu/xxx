import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { 
  Upload, 
  FileText, 
  Image, 
  X, 
  CheckCircle, 
  AlertTriangle,
  ArrowLeft 
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type Page = 'dashboard' | 'upload' | 'analysis' | 'chat' | 'profile';

interface RouteParams {
  id?: string;
}

interface UploadPageProps {
  onNavigate: (page: Page, params?: RouteParams) => void;
}

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

interface UploadResponse {
  success: boolean;
  documentId: string;
  message: string;
  analysis: {
    summary: string;
    riskLevel: 'low' | 'medium' | 'high';
    keyFindings: string[];
    documentType: string;
  };
}

// Mock API upload function
const mockUploadAPI = async (file: File): Promise<UploadResponse> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    success: true,
    documentId: `doc_${Date.now()}`,
    message: 'Document uploaded and analyzed successfully',
    analysis: {
      summary: 'This appears to be a standard legal contract with moderate complexity. The document contains standard clauses and terms that are commonly found in commercial agreements.',
      riskLevel: 'medium',
      keyFindings: [
        'Payment terms require 30-day notice period',
        'Liability clauses may need review',
        'Termination conditions are clearly defined',
        'Intellectual property rights are addressed'
      ],
      documentType: 'contract'
    }
  };
};

export function UploadPage({ onNavigate }: UploadPageProps) {
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      const validSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type. Please upload PDF or image files.`);
        return false;
      }
      
      if (!validSize) {
        toast.error(`${file.name}: File size too large. Please upload files under 10MB.`);
        return false;
      }
      
      return true;
    });

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      file,
      id: `${file.name}_${Date.now()}`,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Upload first file (for demo purposes)
      const response = await mockUploadAPI(selectedFiles[0].file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResponse(response);
      
      toast.success('Document uploaded and analyzed successfully!');
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFiles([]);
    setUploadResponse(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-500" />;
    }
    return <Image className="w-8 h-8 text-blue-500" />;
  };

  if (uploadResponse) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <CardTitle className="text-green-800 dark:text-green-200">
                Upload Successful!
              </CardTitle>
            </div>
            <CardDescription className="text-green-700 dark:text-green-300">
              {uploadResponse.message}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Document Info */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Document ID</h3>
              <code className="text-sm bg-muted px-2 py-1 rounded">
                {uploadResponse.documentId}
              </code>
            </div>

            {/* Analysis Summary */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Analysis Summary</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {uploadResponse.analysis.summary}
              </p>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span>Risk Level:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    uploadResponse.analysis.riskLevel === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : uploadResponse.analysis.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {uploadResponse.analysis.riskLevel.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span>Type: </span>
                  <span className="font-medium capitalize">
                    {uploadResponse.analysis.documentType}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Findings */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Key Findings</h3>
              <ul className="space-y-2">
                {uploadResponse.analysis.keyFindings.map((finding, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button 
                onClick={() => onNavigate('analysis', { id: uploadResponse.documentId })}
                className="flex-1"
              >
                View Full Analysis
              </Button>
              <Button 
                variant="outline"
                onClick={() => onNavigate('chat', { id: uploadResponse.documentId })}
                className="flex-1"
              >
                Chat About Document
              </Button>
              <Button 
                variant="secondary"
                onClick={resetUpload}
              >
                Upload Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Document</h1>
          <p className="text-muted-foreground">
            Upload your legal documents for AI-powered analysis
          </p>
        </div>

        {/* Upload Area */}
        <Card>
          <CardHeader>
            <CardTitle>Select Files</CardTitle>
            <CardDescription>
              Upload PDF documents or images (PNG, JPG). Maximum size: 10MB per file.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Drag & Drop Area */}
            <div 
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-muted-foreground">
                PDF, PNG, JPG files supported
              </p>
              
              <Input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <Label>Selected Files ({selectedFiles.length})</Label>
                <div className="space-y-2">
                  {selectedFiles.map((fileObj) => (
                    <div 
                      key={fileObj.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {fileObj.preview ? (
                          <img 
                            src={fileObj.preview} 
                            alt="Preview" 
                            className="w-8 h-8 object-cover rounded"
                          />
                        ) : (
                          getFileIcon(fileObj.file.type)
                        )}
                        <div>
                          <p className="font-medium text-sm">{fileObj.file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(fileObj.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(fileObj.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading and analyzing...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {/* Upload Button */}
            <div className="mt-6">
              <Button 
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Analyze ({selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''})
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <span>Upload Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ensure text is clearly readable for best analysis results</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>PDF documents provide more accurate text extraction</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Analysis typically takes 30-60 seconds per document</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Supported types: contracts, agreements, policies, and legal notices</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}