import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  MessageSquare,
  Download,
  Share,
  Clock,
  Scale,
  Users,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type Page = 'dashboard' | 'upload' | 'analysis' | 'chat' | 'profile';

interface RouteParams {
  id?: string;
}

interface AnalysisPageProps {
  documentId?: string;
  onNavigate: (page: Page, params?: RouteParams) => void;
}

interface DocumentAnalysis {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  risks: Array<{
    type: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }>;
  obligations: Array<{
    party: string;
    description: string;
    deadline?: string;
    status: 'pending' | 'completed' | 'overdue';
  }>;
  importantDates: Array<{
    date: string;
    description: string;
    type: 'deadline' | 'renewal' | 'payment' | 'milestone';
  }>;
  keyTerms: Array<{
    term: string;
    definition: string;
    importance: 'high' | 'medium' | 'low';
  }>;
  financialTerms: Array<{
    type: string;
    amount: string;
    frequency: string;
    dueDate?: string;
  }>;
  parties: Array<{
    name: string;
    role: string;
    responsibilities: string[];
  }>;
}

// Mock API function
const mockAnalysisAPI = async (documentId: string): Promise<DocumentAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: documentId,
    name: 'Employment_Agreement_2024.pdf',
    type: 'employment',
    uploadDate: '2024-01-15',
    summary: 'This employment agreement establishes the terms and conditions for a full-time software engineer position. The contract includes competitive compensation, comprehensive benefits, and standard employment clauses with some areas requiring attention.',
    riskLevel: 'medium',
    risks: [
      {
        type: 'Termination Clause',
        description: 'The termination clause may be overly broad and could limit future employment opportunities.',
        severity: 'medium',
        recommendation: 'Consider negotiating more specific termination conditions and reducing the scope of post-employment restrictions.'
      },
      {
        type: 'Intellectual Property',
        description: 'IP assignment clause covers work done outside of company time, which may be too broad.',
        severity: 'high',
        recommendation: 'Request modification to limit IP assignment to work directly related to company business.'
      },
      {
        type: 'Non-Compete',
        description: 'Non-compete period extends to 18 months, which may be excessive.',
        severity: 'medium',
        recommendation: 'Negotiate to reduce non-compete period to 6-12 months and narrow the scope.'
      }
    ],
    obligations: [
      {
        party: 'Employee',
        description: 'Complete mandatory training within 30 days of start date',
        deadline: '2024-02-15',
        status: 'pending'
      },
      {
        party: 'Employer',
        description: 'Provide equipment and office space within 5 business days',
        deadline: '2024-01-22',
        status: 'completed'
      },
      {
        party: 'Employee',
        description: 'Submit annual performance goals by March 1st',
        deadline: '2024-03-01',
        status: 'pending'
      }
    ],
    importantDates: [
      {
        date: '2024-01-15',
        description: 'Employment start date',
        type: 'milestone'
      },
      {
        date: '2024-02-15',
        description: 'Probationary period ends',
        type: 'milestone'
      },
      {
        date: '2024-07-15',
        description: 'First performance review',
        type: 'milestone'
      },
      {
        date: '2025-01-15',
        description: 'Annual contract review',
        type: 'renewal'
      }
    ],
    keyTerms: [
      {
        term: 'Base Salary',
        definition: 'Annual compensation of $120,000 paid bi-weekly',
        importance: 'high'
      },
      {
        term: 'Equity Compensation',
        definition: '5,000 stock options vesting over 4 years with 1-year cliff',
        importance: 'high'
      },
      {
        term: 'Confidentiality',
        definition: 'Employee must maintain confidentiality of proprietary information',
        importance: 'medium'
      }
    ],
    financialTerms: [
      {
        type: 'Base Salary',
        amount: '$120,000',
        frequency: 'Annual'
      },
      {
        type: 'Signing Bonus',
        amount: '$10,000',
        frequency: 'One-time',
        dueDate: '2024-02-01'
      },
      {
        type: 'Health Insurance',
        amount: '$400/month',
        frequency: 'Monthly'
      }
    ],
    parties: [
      {
        name: 'TechCorp Inc.',
        role: 'Employer',
        responsibilities: [
          'Provide competitive compensation and benefits',
          'Supply necessary equipment and resources',
          'Maintain safe working environment',
          'Conduct fair performance evaluations'
        ]
      },
      {
        name: 'John Smith',
        role: 'Employee',
        responsibilities: [
          'Perform assigned duties with professional competence',
          'Maintain confidentiality of company information',
          'Complete required training and certifications',
          'Follow company policies and procedures'
        ]
      }
    ]
  };
};

export function AnalysisPage({ documentId, onNavigate }: AnalysisPageProps) {
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (documentId) {
      fetchAnalysis(documentId);
    } else {
      // If no documentId, show a placeholder or redirect
      setIsLoading(false);
    }
  }, [documentId]);

  const fetchAnalysis = async (id: string) => {
    try {
      setIsLoading(true);
      const data = await mockAnalysisAPI(id);
      setAnalysis(data);
    } catch (error) {
      toast.error('Failed to load document analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  const getStatusColor = (status: 'pending' | 'completed' | 'overdue') => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const getDateTypeIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'renewal':
        return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'milestone':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!documentId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Document Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select a document to view its analysis.
          </p>
          <Button onClick={() => onNavigate('dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
          <p className="text-muted-foreground mb-6">
            Could not load the analysis for this document.
          </p>
          <Button onClick={() => onNavigate('dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button size="sm" onClick={() => onNavigate('chat', { id: analysis.id })}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Chat
          </Button>
        </div>
      </div>

      {/* Document Overview */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-6 h-6" />
                  <span>{analysis.name}</span>
                </CardTitle>
                <CardDescription className="mt-2">
                  Uploaded on {new Date(analysis.uploadDate).toLocaleDateString()} • 
                  Document Type: <span className="capitalize">{analysis.type}</span>
                </CardDescription>
              </div>
              <Badge className={getRiskColor(analysis.riskLevel)}>
                {analysis.riskLevel.toUpperCase()} RISK
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{analysis.summary}</p>
          </CardContent>
        </Card>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Risk Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.risks.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{risk.type}</h4>
                      <Badge className={getRiskColor(risk.severity)}>
                        {risk.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {risk.description}
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-md">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Recommendation:
                      </p>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        {risk.recommendation}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Financial Terms */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span>Financial Terms</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.financialTerms.map((term, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">{term.type}</p>
                        <p className="text-sm text-muted-foreground">{term.frequency}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{term.amount}</p>
                        {term.dueDate && (
                          <p className="text-sm text-muted-foreground">
                            Due: {new Date(term.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Obligations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  <span>Obligations</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.obligations.map((obligation, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{obligation.party}</p>
                        <p className="text-sm text-muted-foreground">
                          {obligation.description}
                        </p>
                        {obligation.deadline && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(obligation.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Badge className={getStatusColor(obligation.status)}>
                        {obligation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-500" />
                  <span>Important Dates</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {analysis.importantDates.map((dateItem, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2">
                    {getDateTypeIcon(dateItem.type)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {new Date(dateItem.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dateItem.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {dateItem.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full-width sections */}
        <div className="space-y-6">
          {/* Parties */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-500" />
                <span>Parties & Responsibilities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {analysis.parties.map((party, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-1">{party.name}</h4>
                    <p className="text-sm text-muted-foreground mb-3 capitalize">
                      {party.role}
                    </p>
                    <ul className="space-y-1">
                      {party.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="text-sm flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-blue-500" />
                <span>Key Terms & Definitions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.keyTerms.map((term, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium">{term.term}</h4>
                      <Badge 
                        variant="outline"
                        className={term.importance === 'high' ? 'border-red-300 text-red-700' : 
                                 term.importance === 'medium' ? 'border-yellow-300 text-yellow-700' : 
                                 'border-green-300 text-green-700'}
                      >
                        {term.importance} importance
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{term.definition}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}