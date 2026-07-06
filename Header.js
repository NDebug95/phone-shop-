@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background: #ffffff;
  color: #141414;
  font-family: "Inter", system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: #ff6b00;
  color: #ffffff;
}

.container-shell {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #ff6b00;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 999px;
  transition: background 0.15s ease, transform 0.1s ease;
}

.btn-primary:hover {
  background: #e05e00;
}

.btn-primary:active {
  transform: scale(0.97);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: transparent;
  color: #141414;
  font-weight: 600;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 999px;
  border: 1px solid #141414;
  transition: background 0.15s ease, color 0.15s ease;
}

.btn-secondary:hover {
  background: #141414;
  color: #ffffff;
}

.focus-ring:focus-visible {
  outline: 2px solid #ff6b00;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
