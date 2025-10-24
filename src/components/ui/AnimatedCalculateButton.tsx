import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import './AnimatedCalculateButton.css';

interface AnimatedCalculateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isCalculating?: boolean;
}

export const AnimatedCalculateButton: React.FC<AnimatedCalculateButtonProps> = ({
  onClick,
  disabled = false,
  isCalculating = false,
}) => {
  const [isChecked, setIsChecked] = useState(true);

  const handleClick = () => {
    if (!disabled && !isCalculating) {
      setIsChecked(!isChecked);
      onClick();
    }
  };

  return (
    <div className="neon-button-area">
      <div className="neon-bg">
        <div className="light-1"></div>
        <div className="light-2"></div>
        <div className="light-3"></div>
      </div>

      <label className={`neon-area-wrapper ${disabled ? 'disabled' : ''}`}>
        <div className="neon-wrapper">
          <input
            checked={isChecked}
            type="checkbox"
            onChange={handleClick}
            disabled={disabled || isCalculating}
          />
          <button className="neon-button" type="button">
            <div className="part-1">
              <div className="case">
                <div className="mask"></div>
                <div className="line"></div>
              </div>
              <div className="screw">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 115 126"
                  height="126"
                  width="115"
                >
                  <g style={{ '--i': 1 } as React.CSSProperties} className="g-1">
                    <path
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                      stroke="#262626"
                      fill="url(#paint_linear_steel)"
                      d="M91.4371 119V7C91.4371 3.686 94.1231 1 97.4371 1H107.617C110.931 1 113.617 3.686 113.617 7V119C113.617 122.314 110.931 125 107.617 125H97.4371C94.1231 125 91.4371 122.314 91.4371 119Z"
                    ></path>
                    <path
                      fillOpacity="0.4"
                      fill="#262626"
                      d="M94 6C94 3.79086 95.7909 2 98 2H109C111.209 2 113 3.79086 113 6V88.2727C113 89.2267 112.227 90 111.273 90C101.733 90 94 82.2667 94 72.7273V6Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M98.0101 11.589C98.0101 9.57 99.6461 7.93402 101.665 7.93402H105.027C107.046 7.93402 108.682 9.57 108.682 11.589C108.682 13.608 107.046 15.244 105.027 15.244H101.665C99.6461 15.244 98.0101 13.607 98.0101 11.589Z"
                      style={{ '--i': 1 } as React.CSSProperties}
                      className="dot"
                    ></path>
                  </g>
                  <g style={{ '--i': 2 } as React.CSSProperties} className="g-2">
                    <path
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                      stroke="#262626"
                      fill="url(#paint_linear_steel)"
                      d="M69.256 119V7C69.256 3.686 71.942 1 75.256 1H85.436C88.75 1 91.436 3.686 91.436 7V119C91.436 122.314 88.75 125 85.436 125H75.256C71.943 125 69.256 122.314 69.256 119Z"
                    ></path>
                    <path
                      fillOpacity="0.4"
                      fill="#262626"
                      d="M72 6C72 3.79086 73.7909 2 76 2H87C89.2091 2 91 3.79086 91 6V88.2727C91 89.2267 90.2267 90 89.2727 90C79.7333 90 72 82.2667 72 72.7273V6Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M76.011 11.589C76.011 9.57 77.647 7.93402 79.666 7.93402H83.028C85.047 7.93402 86.683 9.57 86.683 11.589C86.683 13.608 85.047 15.244 83.028 15.244H79.666C77.647 15.244 76.011 13.607 76.011 11.589Z"
                      style={{ '--i': 2 } as React.CSSProperties}
                      className="dot"
                    ></path>
                  </g>
                  <g style={{ '--i': 3 } as React.CSSProperties} className="g-3">
                    <path
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                      stroke="#262626"
                      fill="url(#paint_linear_steel)"
                      d="M47.076 119V7C47.076 3.686 49.762 1 53.076 1H63.256C66.57 1 69.256 3.686 69.256 7V119C69.256 122.314 66.57 125 63.256 125H53.076C49.762 125 47.076 122.314 47.076 119Z"
                    ></path>
                    <path
                      fillOpacity="0.4"
                      fill="#262626"
                      d="M50 6C50 3.79086 51.7909 2 54 2H65C67.2091 2 69 3.79086 69 6V86.9664C69 88.6418 67.6418 90 65.9664 90C57.1484 90 50 82.8516 50 74.0336V6Z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M54.012 11.589C54.012 9.57 55.648 7.93396 57.667 7.93396H61.029C63.048 7.93396 64.684 9.57 64.684 11.589C64.684 13.608 63.048 15.244 61.029 15.244H57.667C55.648 15.244 54.012 13.607 54.012 11.589Z"
                      style={{ '--i': 3 } as React.CSSProperties}
                      className="dot"
                    ></path>
                  </g>
                  <g style={{ '--i': 4 } as React.CSSProperties} className="g-4">
                    <path
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                      stroke="#262626"
                      fill="url(#paint_linear_steel)"
                      d="M23.617 98.853V27.147C23.617 21.501 27.11 16.262 32.838 13.318L47.076 6V120L32.838 112.682C27.111 109.738 23.617 104.499 23.617 98.853Z"
                    ></path>
                    <path
                      fillOpacity="0.4"
                      fill="#262626"
                      d="M29.5 18.4083C29.5 16.9267 30.319 15.5664 31.6284 14.8732L46.5 7V78.2374C46.5 80.0393 45.0393 81.5 43.2374 81.5V81.5C35.6504 81.5 29.5 75.3496 29.5 67.7626V18.4083Z"
                    ></path>
                  </g>
                  <g style={{ '--i': 5 } as React.CSSProperties} className="g-5">
                    <path
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      strokeMiterlimit="10"
                      strokeWidth="2"
                      stroke="#262626"
                      fill="url(#paint_linear_steel)"
                      d="M1.00006 76.162V49.838C1.00006 43.314 4.91107 37.235 11.3891 33.691L23.6171 27V99L11.3881 92.309C4.91106 88.765 1.00006 82.686 1.00006 76.162Z"
                    ></path>
                    <path
                      fillOpacity="0.4"
                      fill="#262626"
                      d="M7.30432 51.7375C7.12191 41.7049 13.279 32.6454 22.6744 29.1221L23 29L23 73.5885C23 74.368 22.368 75 21.5884 75C13.8927 75 7.61519 68.8356 7.47529 61.1412L7.30432 51.7375Z"
                    ></path>
                  </g>
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      y2="125"
                      x2="105.425"
                      y1="1"
                      x1="105.425"
                      id="paint_linear_steel"
                    >
                      <stop stopColor="#7A7A7A" offset="0.100962"></stop>
                      <stop stopColor="#EEEEEE" offset="0.3125"></stop>
                      <stop stopColor="#787878" offset="0.596154"></stop>
                      <stop stopColor="#666666" offset="0.798077"></stop>
                      <stop stopColor="#9E9E9E" offset="1"></stop>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="part-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 190 76"
                height="76"
                width="190"
                className="path-glass"
              >
                <path
                  stroke="currentColor"
                  d="M0 0.5C0 0.5 149 0.5 156.5 0.5C164 0.5 189 8.5 189 37.5C189 66.5 164 75.5 157.5 75.5C151 75.5 1 75.5 1 75.5"
                ></path>
              </svg>

              <div className="glass">
                <div className="glass-reflex"></div>
                <svg
                  viewBox="0 0 700 700"
                  xmlns="http://www.w3.org/2000/svg"
                  className="glass-noise"
                >
                  <defs>
                    <filter
                      colorInterpolationFilters="linearRGB"
                      primitiveUnits="userSpaceOnUse"
                      filterUnits="objectBoundingBox"
                      height="140%"
                      width="140%"
                      y="-20%"
                      x="-20%"
                      id="noise-filter"
                    >
                      <feTurbulence
                        result="turbulence"
                        height="100%"
                        width="100%"
                        y="0%"
                        x="0%"
                        stitchTiles="stitch"
                        seed="15"
                        numOctaves="4"
                        baseFrequency="0.05"
                        type="fractalNoise"
                      ></feTurbulence>
                      <feSpecularLighting
                        result="specularLighting"
                        in="turbulence"
                        height="100%"
                        width="100%"
                        y="0%"
                        x="0%"
                        lightingColor="#ffffff"
                        specularExponent="20"
                        specularConstant="3"
                        surfaceScale="40"
                      >
                        <feDistantLight elevation="69" azimuth="3"></feDistantLight>
                      </feSpecularLighting>
                    </filter>
                  </defs>
                  <rect fill="transparent" height="700" width="700"></rect>
                  <rect
                    filter="url(#noise-filter)"
                    fill="#ffffff"
                    height="700"
                    width="700"
                  ></rect>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 49 52"
                  height="52"
                  width="49"
                  className="filament"
                >
                  <path
                    stroke="#ffc4af"
                    d="M32.5 26.1085C32.5 26.1085 32 5.90019 38.5 2.10852C45 -1.68315 49 5.10852 47.5 9.60852C46 14.1085 39.5 17.1085 21 18.1085C13.667 18.5049 6.49118 18.0371 0.5 17.328"
                  ></path>
                  <path
                    stroke="#ffc4af"
                    d="M32.5 26C32.5 26 32 46.2083 38.5 50C45 53.7917 49 47 47.5 42.5C46 38 39.5 35 21 34C13.667 33.6036 6.49118 34.0714 0.5 34.7805"
                  ></path>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 49 52"
                  height="52"
                  width="49"
                  className="filament filament-on"
                >
                  <path
                    stroke="white"
                    d="M32.5 26.1085C32.5 26.1085 32 5.90019 38.5 2.10852C45 -1.68315 49 5.10852 47.5 9.60852C46 14.1085 39.5 17.1085 21 18.1085C13.667 18.5049 6.49118 18.0371 0.5 17.328"
                  ></path>
                  <path
                    stroke="white"
                    d="M32.5 26C32.5 26 32 46.2083 38.5 50C45 53.7917 49 47 47.5 42.5C46 38 39.5 35 21 34C13.667 33.6036 6.49118 34.0714 0.5 34.7805"
                  ></path>
                </svg>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 49 52"
                  height="52"
                  width="49"
                  className="filament filament-blur filament-on"
                >
                  <path
                    stroke="currentColor"
                    d="M32.5 26.1085C32.5 26.1085 32 5.90019 38.5 2.10852C45 -1.68315 49 5.10852 47.5 9.60852C46 14.1085 39.5 17.1085 21 18.1085C13.667 18.5049 6.49118 18.0371 0.5 17.328"
                  ></path>
                  <path
                    stroke="currentColor"
                    d="M32.5 26C32.5 26 32 46.2083 38.5 50C45 53.7917 49 47 47.5 42.5C46 38 39.5 35 21 34C13.667 33.6036 6.49118 34.0714 0.5 34.7805"
                  ></path>
                </svg>

                <span className="content">
                  <span className="text state-1">
                    <span data-label="C" style={{ '--i': 1 } as React.CSSProperties}>C</span>
                    <span data-label="a" style={{ '--i': 2 } as React.CSSProperties}>a</span>
                    <span data-label="l" style={{ '--i': 3 } as React.CSSProperties}>l</span>
                    <span data-label="c" style={{ '--i': 4 } as React.CSSProperties}>c</span>
                    <span data-label="u" style={{ '--i': 5 } as React.CSSProperties}>u</span>
                    <span data-label="l" style={{ '--i': 6 } as React.CSSProperties}>l</span>
                    <span data-label="a" style={{ '--i': 7 } as React.CSSProperties}>a</span>
                    <span data-label="t" style={{ '--i': 8 } as React.CSSProperties}>t</span>
                    <span data-label="e" style={{ '--i': 9 } as React.CSSProperties}>e</span>
                  </span>

                  <span className="text state-2">
                    <span data-label="L" style={{ '--i': 1 } as React.CSSProperties}>L</span>
                    <span data-label="i" style={{ '--i': 2 } as React.CSSProperties}>i</span>
                    <span data-label="g" style={{ '--i': 3 } as React.CSSProperties}>g</span>
                    <span data-label="h" style={{ '--i': 4 } as React.CSSProperties}>h</span>
                    <span data-label="t" style={{ '--i': 5 } as React.CSSProperties}>t</span>
                    <span data-label="i" style={{ '--i': 6 } as React.CSSProperties}>i</span>
                    <span data-label="n" style={{ '--i': 7 } as React.CSSProperties}>n</span>
                    <span data-label="g" style={{ '--i': 8 } as React.CSSProperties}>g</span>
                    <span data-label="U" style={{ '--i': 9 } as React.CSSProperties}>U</span>
                    <span data-label="p" style={{ '--i': 10 } as React.CSSProperties}>p</span>
                  </span>
                </span>
              </div>
            </div>
          </button>
        </div>
      </label>

      <div className="noise">
        <svg height="100%" width="100%">
          <defs>
            <pattern
              height="500"
              width="500"
              patternUnits="userSpaceOnUse"
              id="noise-pattern"
            >
              <filter y="0" x="0" id="noise">
                <feTurbulence
                  stitchTiles="stitch"
                  numOctaves="3"
                  baseFrequency="0.65"
                  type="fractalNoise"
                ></feTurbulence>
                <feBlend mode="screen"></feBlend>
              </filter>
              <rect filter="url(#noise)" height="500" width="500"></rect>
            </pattern>
          </defs>
          <rect fill="url(#noise-pattern)" height="100%" width="100%"></rect>
        </svg>
      </div>
    </div>
  );
};
