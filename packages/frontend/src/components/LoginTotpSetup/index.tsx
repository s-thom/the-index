import { useEffect, useRef } from 'react';
import qr from 'qrcode';

interface LoginTotpSetupProps {
  code: string;
  url: string;
}

export default function LoginTotpSetup({ code, url }: LoginTotpSetupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      qr.toCanvas(canvasRef.current, url);
    }
  }, [url]);

  return (
    <div>
      <h2>Set up your authenticator app</h2>
      <p>This will only be shown once</p>
      <div>
        <canvas ref={canvasRef} />
      </div>
      <p>Or enter the code manually: {code}</p>
    </div>
  );
}
