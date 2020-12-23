import qr from 'qrcode';
import { useEffect, useRef } from 'react';

interface TotpSetupProps {
  code: string;
  url: string;
}

export default function TotpSetup({ code, url }: TotpSetupProps) {
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
