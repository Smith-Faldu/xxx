import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  FileText, 
  Loader2,
  MessageSquare,
  Clock,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

type Page = 'dashboard' | 'upload' | 'analysis' | 'chat' | 'profile';

interface RouteParams {
  id?: string;
}

interface ChatPageProps {
  documentId?: string;
  onNavigate: (page: Page, params?: RouteParams) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface DocumentInfo {
  id: string;
  name: string;
  type: string;
  riskLevel: 'low' | 'medium' | 'high';
}

// Mock API functions
const mockChatAPI = {
  getDocumentInfo: async (documentId: string): Promise<DocumentInfo> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: documentId,
      name: 'Employment_Agreement_2024.pdf',
      type: 'employment',
      riskLevel: 'medium'
    };
  },
  
  sendMessage: async (documentId: string, message: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock responses based on message content
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('risk') || lowerMessage.includes('risks')) {
      return "Based on my analysis of the employment agreement, I've identified several key risks:\n\n1. **Intellectual Property Assignment**: The IP clause is quite broad and may cover personal projects. Consider negotiating to limit this to work directly related to company business.\n\n2. **Non-Compete Period**: The 18-month non-compete period is longer than typical. Industry standard is usually 6-12 months.\n\n3. **Termination Clause**: The termination conditions could be more specific to protect both parties.\n\nWould you like me to elaborate on any of these risks or discuss potential negotiation strategies?";
    }
    
    if (lowerMessage.includes('salary') || lowerMessage.includes('compensation') || lowerMessage.includes('pay')) {
      return "The compensation package in this agreement includes:\n\n💰 **Base Salary**: $120,000 annually (paid bi-weekly)\n📈 **Equity**: 5,000 stock options vesting over 4 years with 1-year cliff\n🎁 **Signing Bonus**: $10,000 (payable by February 1st, 2024)\n🏥 **Benefits**: Health insurance ($400/month employer contribution)\n\nThis compensation appears competitive for a software engineer position. The equity component is particularly valuable if the company performs well. Is there a specific aspect of the compensation you'd like to discuss?";
    }
    
    if (lowerMessage.includes('termination') || lowerMessage.includes('quit') || lowerMessage.includes('fire')) {
      return "The termination provisions in this agreement include:\n\n**For Cause Termination**: Company can terminate immediately for misconduct, breach of contract, or poor performance after written notice and opportunity to cure.\n\n**Without Cause Termination**: Either party can terminate with 30 days written notice.\n\n**Severance**: If terminated without cause, you're entitled to 2 weeks severance pay.\n\n**Post-Employment**: 18-month non-compete and 24-month non-solicitation of clients/employees.\n\n⚠️ **Recommendation**: The non-compete period is quite long. Consider negotiating this down to 6-12 months, which is more standard in the industry.";
    }
    
    if (lowerMessage.includes('negotiate') || lowerMessage.includes('negotiation')) {
      return "Here are key areas you might consider negotiating:\n\n🎯 **High Priority**:\n• Reduce non-compete period from 18 to 6-12 months\n• Narrow IP assignment clause to work-related projects only\n• Clarify remote work policy and flexibility\n\n📋 **Medium Priority**:\n• Increase severance to 4-6 weeks\n• Add specific performance review criteria\n• Include professional development budget\n\n💡 **Tips**:\n• Focus on 2-3 key items rather than everything\n• Come prepared with market research\n• Propose specific language changes\n• Be collaborative, not confrontational\n\nWould you like me to help draft specific negotiation points for any of these areas?";
    }
    
    if (lowerMessage.includes('benefits') || lowerMessage.includes('insurance') || lowerMessage.includes('vacation')) {
      return "The benefits package outlined in the agreement includes:\n\n🏥 **Health Insurance**: $400/month employer contribution\n🦷 **Dental & Vision**: Basic coverage included\n💰 **401(k)**: Company match up to 4% (mentioned in benefits appendix)\n🏖️ **Vacation**: 15 days PTO in year 1, increasing to 20 days in year 2\n🏥 **Sick Leave**: 10 days annually\n📚 **Professional Development**: $2,000 annual budget\n\nThis is a solid benefits package. The PTO is slightly below market average (many companies start at 20 days), which could be a negotiation point. The professional development budget is a nice touch that shows investment in your growth.";
    }
    
    // Default response
    return "I can help you understand this employment agreement in detail. I've analyzed the document and can answer questions about:\n\n• Risk assessment and red flags\n• Compensation and benefits breakdown\n• Termination and employment terms\n• Negotiation opportunities\n• Legal obligations for both parties\n\nWhat specific aspect of the agreement would you like to discuss? Feel free to ask about any clause or term that concerns you.";
  }
};

export function ChatPage({ documentId, onNavigate }: ChatPageProps) {
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (documentId) {
      initializeChat(documentId);
    } else {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async (id: string) => {
    try {
      setIsLoading(true);
      const docInfo = await mockChatAPI.getDocumentInfo(id);
      setDocumentInfo(docInfo);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your AI legal assistant. I've analyzed the document "${docInfo.name}" and I'm ready to help you understand its contents. You can ask me about:\n\n• Risk assessment and concerns\n• Key terms and clauses\n• Financial details\n• Negotiation opportunities\n• Legal obligations\n\nWhat would you like to know about this document?`,
        timestamp: new Date()
      };
      
      setMessages([welcomeMessage]);
    } catch (error) {
      toast.error('Failed to load document information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !documentId) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await mockChatAPI.sendMessage(documentId, userMessage.content);
      
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to send message');
      // Mark user message as error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'error' }
            : msg
        )
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getRiskColor = (riskLevel: 'low' | 'medium' | 'high') => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    }
  };

  const formatMessageContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <p key={index} className="font-semibold mb-2">
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 mb-1">
              {line.slice(2)}
            </li>
          );
        }
        if (line.startsWith('🎯 ') || line.startsWith('📋 ') || line.startsWith('💡 ') || 
            line.startsWith('🏥 ') || line.startsWith('💰 ') || line.startsWith('📈 ')) {
          return (
            <p key={index} className="font-medium mb-2 mt-3">
              {line}
            </p>
          );
        }
        if (line.trim() === '') {
          return <br key={index} />;
        }
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      });
  };

  if (!documentId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Document Selected</h2>
          <p className="text-muted-foreground mb-6">
            Please select a document to start chatting about it.
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
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2">Loading document chat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            
            {documentInfo && (
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h2 className="font-medium">{documentInfo.name}</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground capitalize">
                      {documentInfo.type}
                    </span>
                    <Badge className={getRiskColor(documentInfo.riskLevel)}>
                      {documentInfo.riskLevel.toUpperCase()} RISK
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onNavigate('analysis', { id: documentId })}
          >
            View Analysis
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex space-x-3 max-w-3xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-700 text-white'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                </div>
                
                <div className={`rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-muted/50 border'
                }`}>
                  <div className="prose prose-sm max-w-none">
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div>{formatMessageContent(message.content)}</div>
                    )}
                  </div>
                  
                  <div className={`flex items-center justify-between mt-2 text-xs ${
                    message.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                  }`}>
                    <span>{message.timestamp.toLocaleTimeString()}</span>
                    {message.role === 'user' && message.status && (
                      <div className="flex items-center space-x-1">
                        {message.status === 'sending' && <Clock className="w-3 h-3" />}
                        {message.status === 'sent' && <CheckCircle className="w-3 h-3" />}
                        {message.status === 'error' && <span className="text-red-300">Failed</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isSending && (
            <div className="flex justify-start">
              <div className="flex space-x-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted/50 border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about this document..."
                disabled={isSending}
                className="min-h-[44px]"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSending}
              className="px-6"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}