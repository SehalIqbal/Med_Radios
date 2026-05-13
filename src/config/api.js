// ─────────────────────────────────────────────
//  RADIOS — Backend Configuration
//  Change BACKEND_URL here to update everywhere
// ─────────────────────────────────────────────

export const BACKEND_URL = "https://headband-cheese-frosting.ngrok-free.dev";

export const ENDPOINTS = {
  health:     `${BACKEND_URL}/health`,
  analyzeMRI: `${BACKEND_URL}/analyze-mri`,
  analyzeXray:`${BACKEND_URL}/analyze-xray`,
};
