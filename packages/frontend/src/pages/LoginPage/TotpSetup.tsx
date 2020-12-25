import qr from 'qrcode';
import { useEffect, useMemo, useRef } from 'react';

interface TotpSetupProps {
  code: string;
}

export default function TotpSetup({ code }: TotpSetupProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const url = useMemo(() => {
    return `otpauth://totp/the-index?secret=${code}`;
  }, [code]);

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
