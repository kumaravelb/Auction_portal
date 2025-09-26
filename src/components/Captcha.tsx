import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  value: string;
  onChange: (value: string) => void;
  onCaptchaChange: (captcha: string) => void;
}

export const Captcha = ({ value, onChange, onCaptchaChange }: CaptchaProps) => {
  const [captchaText, setCaptchaText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    onCaptchaChange(result);
    return result;
  };

  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = 120;
    canvas.height = 40;

    // Background with slight gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8f9fa');
    gradient.addColorStop(1, '#e9ecef');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise lines
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw text with different styles for each character
    ctx.textBaseline = 'middle';
    const charWidth = canvas.width / text.length;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = charWidth * i + charWidth / 2;
      const y = canvas.height / 2 + (Math.random() - 0.5) * 10;

      // Random font size and style
      const fontSize = 16 + Math.random() * 4;
      const fontStyle = Math.random() > 0.5 ? 'bold' : 'normal';
      ctx.font = `${fontStyle} ${fontSize}px Arial, sans-serif`;

      // Random color (darker for better readability)
      const colors = ['#333', '#555', '#666', '#444', '#222'];
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

      // Random rotation
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.3);
      ctx.fillText(char, -ctx.measureText(char).width / 2, 0);
      ctx.restore();
    }

    // Add some noise dots
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.4)`;
      ctx.fill();
    }
  };

  const refreshCaptcha = () => {
    const newCaptcha = generateCaptcha();
    drawCaptcha(newCaptcha);
    onChange(''); // Clear input when refreshing captcha
  };

  useEffect(() => {
    const captcha = generateCaptcha();
    drawCaptcha(captcha);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Enter captcha"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-9 px-3 rounded-md border border-border/50 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <canvas
          ref={canvasRef}
          className="border border-border/50 rounded bg-muted"
          style={{ imageRendering: 'crisp-edges' }}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={refreshCaptcha}
          className="p-2 h-9 w-9"
          title="Refresh Captcha"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};