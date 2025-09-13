import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/auth-page';
import { Dashboard } from './components/dashboard';
import { UploadPage } from './components/upload-page';
import { AnalysisPage } from './components/analysis-page';
import { ChatPage } from './components/chat-page';
import { ProfilePage } from './components/profile-page';
import { Navbar } from './components/navbar';
import { Sidebar } from './components/sidebar';
import { Toaster } from './components/ui/sonner';

// Mock Firebase Auth types and functions
interface User {
  uid: string;
  email: string;
  displayName?: string;
}

// Mock Firebase Auth implementation
const mockAuth = {
  currentUser: null as User | null,
  signInWithEmailAndPassword: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (email === 'test@example.com' && password === 'password') {
      mockAuth.currentUser = { uid: '123', email, displayName: 'Test User' };
      return { user: mockAuth.currentUser };
    }
    throw new Error('Invalid credentials');
  },
  createUserWithEmailAndPassword: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    mockAuth.currentUser = { uid: '123', email, displayName: null };
    return { user: mockAuth.currentUser };
  },
  signOut: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockAuth.currentUser = null;
  },
  updateProfile: async (updates: { displayName?: string }) => {
    if (mockAuth.currentUser) {
      mockAuth.currentUser.displayName = updates.displayName;
    }
  }
};

type Page = 'auth' | 'dashboard' | 'upload' | 'analysis' | 'chat' | 'profile';

interface RouteParams {
  id?: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [routeParams, setRouteParams] = useState<RouteParams>({});
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock auth state persistence
    const savedUser = localStorage.getItem('legal-lens-user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      mockAuth.currentUser = userData;
      setCurrentPage('dashboard');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await mockAuth.signInWithEmailAndPassword(email, password);
      setUser(result.user);
      localStorage.setItem('legal-lens-user', JSON.stringify(result.user));
      setCurrentPage('dashboard');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      const result = await mockAuth.createUserWithEmailAndPassword(email, password);
      setUser(result.user);
      localStorage.setItem('legal-lens-user', JSON.stringify(result.user));
      setCurrentPage('dashboard');
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    await mockAuth.signOut();
    setUser(null);
    localStorage.removeItem('legal-lens-user');
    setCurrentPage('auth');
  };

  const navigate = (page: Page, params?: RouteParams) => {
    setCurrentPage(page);
    setRouteParams(params || {});
  };

  const updateUser = async (updates: { displayName?: string }) => {
    if (user) {
      await mockAuth.updateProfile(updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('legal-lens-user', JSON.stringify(updatedUser));
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderPage = () => {
    if (!user && currentPage !== 'auth') {
      return <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
    }

    switch (currentPage) {
      case 'auth':
        return user ? null : <AuthPage onLogin={handleLogin} onSignup={handleSignup} />;
      case 'dashboard':
        return <Dashboard user={user!} onNavigate={navigate} />;
      case 'upload':
        return <UploadPage onNavigate={navigate} />;
      case 'analysis':
        return <AnalysisPage documentId={routeParams.id} onNavigate={navigate} />;
      case 'chat':
        return <ChatPage documentId={routeParams.id} onNavigate={navigate} />;
      case 'profile':
        return <ProfilePage user={user!} onUpdateUser={updateUser} onLogout={handleLogout} />;
      default:
        return <Dashboard user={user!} onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {user && (
        <Navbar 
          user={user} 
          isDark={isDark} 
          onToggleTheme={() => setIsDark(!isDark)} 
          onLogout={handleLogout}
        />
      )}
      
      <div className="flex">
        {user && (
          <Sidebar 
            currentPage={currentPage} 
            onNavigate={navigate} 
          />
        )}
        
        <main className={`flex-1 ${user ? 'pl-64 pt-16' : ''}`}>
          {renderPage()}
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}