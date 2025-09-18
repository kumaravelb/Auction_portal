import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useTheme, Theme } from '@/contexts/ThemeContext';

export const ThemeSelector = () => {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const currentTheme = themes.find(t => t.value === theme);

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-border/50 hover:border-primary/50">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-popover border-border/50 shadow-premium" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Choose Your Theme</h3>
            <p className="text-sm text-muted-foreground">
              Select a color theme that matches your style
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {themes.map((themeOption) => (
              <Card
                key={themeOption.value}
                className={`cursor-pointer transition-all duration-200 hover:shadow-card ${
                  theme === themeOption.value
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/30 hover:border-border/50'
                }`}
                onClick={() => handleThemeSelect(themeOption.value)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-white/20 shadow-sm"
                        style={{ backgroundColor: themeOption.primary }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {themeOption.name}
                          </span>
                          {theme === themeOption.value && (
                            <Check className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {themeOption.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="pt-2 border-t border-border/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current:</span>
              <Badge variant="outline" className="border-primary/30 text-primary">
                {currentTheme?.name}
              </Badge>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};