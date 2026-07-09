import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
  showSubBanner?: boolean;
}

export default function Logo({ className = "h-12", light = false, showSubBanner = false }: LogoProps) {
  if (showSubBanner) {
    return (
      <img
        src="/logo.png"
        alt="Get Loans Hub Logo"
        className={`${className} object-contain`}
        style={{
          filter: light ? 'invert(1) hue-rotate(180deg) brightness(1.2)' : 'none'
        }}
      />
    );
  }

  // Crop the bottom green banner for navbar/footer
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '3.7 / 1' }}>
      <img
        src="/logo.png"
        alt="Get Loans Hub Logo"
        className="absolute top-0 left-0 w-full h-[126%] object-cover object-top"
        style={{
          filter: light ? 'invert(1) hue-rotate(180deg) brightness(1.2)' : 'none'
        }}
      />
    </div>
  );
}
