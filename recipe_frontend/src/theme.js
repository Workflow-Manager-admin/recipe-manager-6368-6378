//
// Theme configuration for modern, minimalistic, light recipe app.
//
export const COLORS = {
  primary: "#ff7043",    // orange
  secondary: "#26a69a",  // teal
  accent: "#ffd54f",     // yellow
  bg: "#fff",
  font: "#222",
  light: "#f9f9f9",
  border: "#eee",
  danger: "#ff4f4f"
};

export const themeVars = `
  :root {
    --color-primary: ${COLORS.primary};
    --color-secondary: ${COLORS.secondary};
    --color-accent: ${COLORS.accent};
    --color-bg: ${COLORS.bg};
    --color-font: ${COLORS.font};
    --color-light: ${COLORS.light};
    --color-border: ${COLORS.border};
    --color-danger: ${COLORS.danger};
  }
`;
