import "./AnimatedLogo.css";

export default function AnimatedLogo() {
  return (
    <div className="animated-logo">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#667eea">
              <animate
                attributeName="stop-color"
                values="#667eea; #764ba2; #f093fb; #667eea"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#764ba2">
              <animate
                attributeName="stop-color"
                values="#764ba2; #f093fb; #4facfe; #764ba2"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer rotating ring */}
        <circle
          cx="60"
          cy="60"
          r="50"
          stroke="url(#logo-gradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 5"
          className="logo-ring-outer"
          filter="url(#glow)"
        />

        {/* Middle rotating ring */}
        <circle
          cx="60"
          cy="60"
          r="40"
          stroke="url(#logo-gradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
          className="logo-ring-middle"
          filter="url(#glow)"
        />

        {/* Inner pulsing circle */}
        <circle
          cx="60"
          cy="60"
          r="30"
          fill="url(#logo-gradient)"
          className="logo-core"
          filter="url(#glow)"
        />

        {/* Center symbol - stylized "A" */}
        <path
          d="M 60 40 L 70 70 L 65 70 L 63 62 L 57 62 L 55 70 L 50 70 Z M 58 58 L 62 58 L 60 48 Z"
          fill="white"
          className="logo-letter"
        />

        {/* Orbiting particles */}
        <circle
          cx="60"
          cy="10"
          r="3"
          fill="#667eea"
          className="logo-particle logo-particle-1"
        />
        <circle
          cx="110"
          cy="60"
          r="3"
          fill="#764ba2"
          className="logo-particle logo-particle-2"
        />
        <circle
          cx="60"
          cy="110"
          r="3"
          fill="#f093fb"
          className="logo-particle logo-particle-3"
        />
        <circle
          cx="10"
          cy="60"
          r="3"
          fill="#4facfe"
          className="logo-particle logo-particle-4"
        />
      </svg>
    </div>
  );
}
