import { useEffect, useRef } from 'react';
import qr from 'qrcode';
import './index.css';

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
    <div className="LoginTotpSetup">
      <h2 className="LoginTotpSetup-heading">Set up your authenticator app</h2>
      <p className="LoginTotpSetup-subheading">This will only be shown once</p>
      <div className="LoginTotpSetup-img-container">
        <canvas className="LoginTotpSetupCanvas" ref={canvasRef} />
      </div>
      <p>Or enter the code manually: {code}</p>
    </div>
  );
}
