/** @type {const} */
const themeColors = {
  primary:    { light: '#F5C842', dark: '#F5C842' },   // Gold — trump, highlights
  background: { light: '#0A3D1F', dark: '#0A3D1F' },   // Dark green felt
  surface:    { light: '#1A5C32', dark: '#1A5C32' },   // Lighter green for panels
  foreground: { light: '#FFFFFF', dark: '#FFFFFF' },   // White text
  muted:      { light: '#A8C5A0', dark: '#A8C5A0' },   // Muted green-white
  border:     { light: '#2E7D4F', dark: '#2E7D4F' },   // Subtle green border
  success:    { light: '#4CAF50', dark: '#4ADE80' },   // Win states
  warning:    { light: '#F5C842', dark: '#FBBF24' },   // Warning (same as gold)
  error:      { light: '#E53935', dark: '#F87171' },   // Red suits / errors
  tint:       { light: '#F5C842', dark: '#F5C842' },   // Tab bar active
};

module.exports = { themeColors };
