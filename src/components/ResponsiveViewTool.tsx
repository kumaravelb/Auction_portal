import { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ViewportSize = 'desktop' | 'tablet' | 'mobile';

interface ViewportConfig {
  name: string;
  width: string;
  height: string;
  icon: React.ComponentType<{ className?: string }>;
}

const viewportConfigs: Record<ViewportSize, ViewportConfig> = {
  desktop: {
    name: 'Desktop',
    width: '100%',
    height: '100%',
    icon: Monitor,
  },
  tablet: {
    name: 'Tablet',
    width: '768px',
    height: '1024px',
    icon: Tablet,
  },
  mobile: {
    name: 'Mobile',
    width: '375px',
    height: '667px',
    icon: Smartphone,
  },
};

export const ResponsiveViewTool = () => {
  const [currentView, setCurrentView] = useState<ViewportSize>('desktop');

  const handleViewChange = (view: ViewportSize) => {
    setCurrentView(view);

    const rootElement = document.getElementById('root');
    const bodyElement = document.body;
    const htmlElement = document.documentElement;

    if (view === 'desktop') {
      // Reset to full width
      if (rootElement) {
        rootElement.style.maxWidth = '';
        rootElement.style.maxHeight = '';
        rootElement.style.margin = '';
        rootElement.style.border = '';
        rootElement.style.boxShadow = '';
        rootElement.style.borderRadius = '';
        rootElement.style.overflow = '';
        rootElement.style.transform = '';
        rootElement.style.transformOrigin = '';
      }
      if (bodyElement) {
        bodyElement.style.backgroundColor = '';
        bodyElement.style.padding = '';
        bodyElement.style.minHeight = '';
      }
    } else {
      // Apply mobile/tablet simulation with device frame
      const config = viewportConfigs[view];

      if (rootElement) {
        // Create device frame simulation
        rootElement.style.maxWidth = config.width;
        rootElement.style.maxHeight = config.height;
        rootElement.style.margin = '20px auto';
        rootElement.style.border = '8px solid #2d3748';
        rootElement.style.borderRadius = view === 'mobile' ? '25px' : '15px';
        rootElement.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
        rootElement.style.overflow = 'hidden';
        rootElement.style.position = 'relative';

        // Add device-like scaling for better visibility
        if (view === 'mobile') {
          const scale = Math.min(0.9, (window.innerWidth - 100) / 375);
          rootElement.style.transform = `scale(${scale})`;
          rootElement.style.transformOrigin = 'top center';
        } else {
          rootElement.style.transform = 'scale(0.85)';
          rootElement.style.transformOrigin = 'top center';
        }
      }

      if (bodyElement) {
        bodyElement.style.backgroundColor = '#f1f5f9';
        bodyElement.style.padding = '0';
        bodyElement.style.minHeight = '100vh';
      }
    }
  };

  // Reset on component unmount
  useEffect(() => {
    return () => {
      const rootElement = document.getElementById('root');
      const bodyElement = document.body;

      if (rootElement) {
        rootElement.style.maxWidth = '';
        rootElement.style.maxHeight = '';
        rootElement.style.margin = '';
        rootElement.style.border = '';
        rootElement.style.boxShadow = '';
        rootElement.style.borderRadius = '';
        rootElement.style.overflow = '';
        rootElement.style.transform = '';
        rootElement.style.transformOrigin = '';
      }
      if (bodyElement) {
        bodyElement.style.backgroundColor = '';
        bodyElement.style.padding = '';
        bodyElement.style.minHeight = '';
      }
    };
  }, []);

  const CurrentIcon = viewportConfigs[currentView].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <CurrentIcon className="w-4 h-4" />
          <span className="hidden sm:inline">{viewportConfigs[currentView].name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {Object.entries(viewportConfigs).map(([key, config]) => {
          const IconComponent = config.icon;
          const isActive = key === currentView;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => handleViewChange(key as ViewportSize)}
              className={`flex items-center gap-2 cursor-pointer ${
                isActive ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {config.name}
              {isActive && <span className="ml-auto">✓</span>}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};