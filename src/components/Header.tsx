import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Gavel, Menu, LogOut, Home, Mail, Info, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ResponsiveViewTool } from '@/components/ResponsiveViewTool';
import { LoginModal } from '@/components/LoginModal';
import { RegisterModal } from '@/components/RegisterModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  currentView?: 'auctions' | 'services' | 'detail';
  onViewChange?: (view: 'auctions' | 'services') => void;
  showNavigation?: boolean;
}

export const Header = ({ currentView = 'auctions', onViewChange, showNavigation = true }: HeaderProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const getButtonVariant = (targetView: 'auctions' | 'services') => {
    return currentView === targetView ? 'default' : 'ghost';
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "default",
    });
  };

  const handleHomeClick = () => {
    console.log('Header: Home button clicked, navigating to /');
    navigate('/');
    if (onViewChange) {
      onViewChange('auctions');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/50 bg-gradient-card/95 backdrop-blur-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 cursor-pointer" onClick={handleHomeClick}>
                <div className="w-32 h-20 rounded-lg flex items-center justify-center overflow-hidden bg-white/10">
                  <img
                    src="/logo.jpg"
                    alt="Auction Portal Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to gavel icon if logo fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling!.style.display = 'flex';
                    }}
                  />
                  <div className="w-32 h-20 bg-gradient-primary rounded-lg items-center justify-center hidden">
                    <Gavel className="w-12 h-12 text-primary-foreground" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-foreground">Auction Portal</h1>
              </div>

              {showNavigation && (
                <nav className="hidden md:flex items-center gap-1">
                  <Button
                    variant={getButtonVariant('auctions')}
                    size="sm"
                    onClick={() => {
                      navigate('/');
                      if (onViewChange) onViewChange('auctions');
                    }}
                  >
                    Auctions
                  </Button>
                  {isAdmin && (
                    <Button
                      variant={getButtonVariant('services')}
                      size="sm"
                      onClick={() => {
                        console.log('Header: Services button clicked, isAdmin:', isAdmin);
                        if (onViewChange) onViewChange('services');
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Services
                    </Button>
                  )}
                </nav>
              )}
            </div>

            <div className="flex items-center gap-6">
              <ResponsiveViewTool />
              <ThemeSelector />

              {showNavigation && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => {
                    if (onViewChange && isAdmin) {
                      const newView = currentView === 'auctions' ? 'services' : 'auctions';
                      onViewChange(newView);
                    }
                  }}
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    Welcome <span className="text-foreground font-medium">{user?.username}</span> {isAdmin && '(Admin)'}
                  </span>
                  <Button variant="premium" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-3 mt-2">
                  {/* Welcome Guest with Login/Register - All on same line */}
                  <div className="flex items-center gap-1 text-sm whitespace-nowrap">
                    <span className="text-muted-foreground">Welcome</span>
                    <span className="text-red-600 font-medium">Guest</span>
                    <span className="text-muted-foreground">!</span>
                    <button
                      onClick={() => setShowLogin(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline ml-2"
                    >
                      Login
                    </button>
                    <span className="text-muted-foreground mx-1">|</span>
                    <button
                      onClick={() => setShowRegister(true)}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      Register
                    </button>
                  </div>

                  {/* Navigation Icons */}
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleHomeClick}
                      className="p-2 hover:bg-muted/50"
                    >
                      <Home className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <div className="w-px h-4 bg-border/50"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-muted/50"
                    >
                      <Mail className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                    <div className="w-px h-4 bg-border/50"></div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-muted/50"
                    >
                      <Info className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <RegisterModal isOpen={showRegister} onClose={() => setShowRegister(false)} />
    </>
  );
};