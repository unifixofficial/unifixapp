import React from 'react';

interface AuthLayoutProps {
  leftContent: React.ReactNode;
  children: React.ReactNode;
  rightFlex?: string;
  minHeight?: string;
}

export default function AuthLayout({ leftContent, children, rightFlex = '0 0 55%', minHeight = '100vh' }: AuthLayoutProps) {
  return (
    <>
      <style>{`
        .unf-auth-layout {
          display: none;
        }

        @media (min-width: 768px) {
          .unf-auth-layout {
            display: flex;
            width: 100vw;
            min-height: ${minHeight};
            background: #fff;
            overflow: hidden;
          }

          .unf-auth-left {
            flex: 0 0 45%;
            background: linear-gradient(145deg, #052e16 0%, #14532d 55%, #16a34a 100%);
            color: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 56px 64px;
            position: relative;
            overflow: hidden;
            border-top-right-radius: 160px 80%;
            border-bottom-right-radius: 160px 80%;
          }

          .unf-auth-orb-a {
            position: absolute;
            width: 380px;
            height: 380px;
            background: rgba(255,255,255,0.04);
            border-radius: 50%;
            top: -120px;
            left: -100px;
            pointer-events: none;
          }

          .unf-auth-orb-b {
            position: absolute;
            width: 220px;
            height: 220px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
            bottom: -60px;
            left: -20px;
            pointer-events: none;
          }

          .unf-auth-orb-c {
            position: absolute;
            width: 160px;
            height: 160px;
            background: rgba(255,255,255,0.04);
            border-radius: 50%;
            bottom: 80px;
            left: 160px;
            pointer-events: none;
          }

          .unf-auth-left-inner {
            position: relative;
            z-index: 2;
            max-width: 420px;
          }

          .unf-auth-logo-row {
            display: flex;
            align-items: center;
            gap: 13px;
            margin-bottom: 2.25rem;
          }

          .unf-auth-logo-img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.25);
          }

          .unf-auth-logo-name {
            font-size: 1.25rem;
            font-weight: 800;
            color: #fff;
            letter-spacing: -0.02em;
          }

          .unf-auth-right {
            flex: ${rightFlex};
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 48px 72px;
            position: relative;
            overflow: hidden;
          }

          .unf-auth-right-orb {
            position: absolute;
            width: 130px;
            height: 130px;
            background: linear-gradient(135deg, #14532d, #052e16);
            border-radius: 50%;
            bottom: -44px;
            right: -44px;
            pointer-events: none;
            opacity: 0.8;
          }

          .unf-auth-right-inner {
            width: 100%;
            max-width: 460px;
            position: relative;
            z-index: 1;
          }

          @media (min-width: 768px) and (max-width: 1023px) {
            .unf-auth-left {
              flex: 0 0 40%;
              padding: 40px 44px;
              border-top-right-radius: 120px 70%;
              border-bottom-right-radius: 120px 70%;
            }

            .unf-auth-right {
              padding: 40px 44px;
            }
          }

          @media (min-width: 1440px) {
            .unf-auth-left {
              flex: 0 0 45%;
              padding: 64px 80px;
            }

            .unf-auth-right {
              padding: 64px 96px;
            }

            .unf-auth-right-inner {
              max-width: 480px;
            }
          }
        }
      `}</style>

      <div className="unf-auth-layout">
        <div className="unf-auth-left">
          <div className="unf-auth-orb-a" />
          <div className="unf-auth-orb-b" />
          <div className="unf-auth-orb-c" />
          <div className="unf-auth-left-inner">
            <div className="unf-auth-logo-row">
              <img src="/icon.png" alt="UniFiX" className="unf-auth-logo-img" />
              <span className="unf-auth-logo-name">UniFiX</span>
            </div>
            {leftContent}
          </div>
        </div>

        <div className="unf-auth-right">
          <div className="unf-auth-right-inner">
            {children}
          </div>
          <div className="unf-auth-right-orb" />
        </div>
      </div>
    </>
  );
}