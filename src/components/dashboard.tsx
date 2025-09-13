import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Upload, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  MessageSquare,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface User {
  uid: string;
  email: string;
  displayName?: string;
}

type Page = 'dashboard' | 'upload' | 'analysis' | 'chat' | 'profile';

interface RouteParams {
  id?: string;
}

interface DashboardProps {
  user: User;
  onNavigate: (page: Page, params?: RouteParams) => void;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
  summary?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// Mock API functions
const mockAPI = {
  getDocumentHistory: async (): Promise<Document[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
      {
        id: '1',
        name: 'Employment_Agreement_2024.pdf',
        type: 'employment',
        uploadDate: '2024-01-15',
        status: 'completed',
        summary: 'Standard employment agreement with competitive salary and benefits package.',
        riskLevel: 'low'
      },
      {
        id: '2',
        name: 'Vendor_Contract_ABC_Corp.pdf',
        type: 'contract',
        uploadDate: '2024-01-14',
        status: 'completed',
        summary: 'Service agreement with payment terms requiring review.',
        riskLevel: 'medium'
      },
      {
        id: '3',
        name: 'Partnership_Agreement_Draft.pdf',
        type: 'partnership',
        uploadDate: '2024-01-13',
        status: 'processing',
        summary: 'Complex partnership structure with multiple stakeholders.',
        riskLevel: 'high'
      }
    ];
  }
};

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDocumentHistory();
  }, []);

  const fetchDocumentHistory = async () => {
    try {
      setIsLoading(true);
      const history = await mockAPI.getDocumentHistory();
      setDocuments(history);
    } catch (error) {
      toast.error('Failed to fetch document history');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }
  };

  const getRiskBadge = (riskLevel: Document['riskLevel']) => {
    const colors = {
      low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
      <Badge className={colors[riskLevel]}>
        {riskLevel.toUpperCase()} RISK
      </Badge>
    );
  };

  const stats = {
    totalDocuments: documents.length,
    completedAnalyses: documents.filter(d => d.status === 'completed').length,
    highRiskDocs: documents.filter(d => d.riskLevel === 'high').length,
    processingDocs: documents.filter(d => d.status === 'processing').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          Welcome back, {user.displayName || user.email.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Manage your legal documents and get AI-powered insights.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {stats.totalDocuments}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {stats.completedAnalyses}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200 dark:border-red-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {stats.highRiskDocs}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {stats.processingDocs}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Start analyzing your legal documents
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button 
            onClick={() => onNavigate('upload')}
            className="flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={fetchDocumentHistory}
            disabled={isLoading}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh History
          </Button>
        </CardContent>
      </Card>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            Your latest document analyses and uploads
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No documents uploaded yet</p>
              <Button 
                onClick={() => onNavigate('upload')}
                className="mt-4"
              >
                Upload Your First Document
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => (
                <div 
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(doc.status)}
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{doc.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                        </span>
                        <span className="capitalize">{doc.type}</span>
                      </div>
                      {doc.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {doc.summary}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getRiskBadge(doc.riskLevel)}
                    
                    <div className="flex space-x-2">
                      {doc.status === 'completed' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate('analysis', { id: doc.id })}
                          >
                            View Analysis
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onNavigate('chat', { id: doc.id })}
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}