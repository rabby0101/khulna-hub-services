
import React from 'react';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import NotificationCenter from './NotificationCenter';

const Header = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Briefcase className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">KhulnaJobs</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/jobs" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              location.pathname === '/jobs' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Browse Jobs
          </Link>
          {user && (
            <Link 
              to="/profile" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Profile
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <>
              <NotificationCenter />
              <Button asChild size="sm">
                <Link to="/post-job">
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Link>
              </Button>
              <UserMenu />
            </>
          ) : (
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
