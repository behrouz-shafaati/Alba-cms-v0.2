export default function buildScopedColorStyle(
  id: string,
  cssProp = 'background-color',
) {
  return `
    #${id} { ${cssProp}: var(--default); }
    #${id}:hover { ${cssProp}: var(--hover); }
    #${id}:active { ${cssProp}: var(--active); }

    .dark #${id} { ${cssProp}: var(--default-dark); }
    .dark #${id}:hover { ${cssProp}: var(--hover-dark); }
    .dark #${id}:active { ${cssProp}: var(--active-dark); }
  `
}
