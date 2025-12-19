// app/theme-script.tsx
export function ThemeScript() {
  const code = `
(function () {
  try {
    const stored = localStorage.getItem('theme');

    if (stored === 'light' || stored === 'dark') {
      document.documentElement.classList.add(stored);
      return;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.add('light');
    }
  } catch (e) {}
})();
`
  return <script dangerouslySetInnerHTML={{ __html: code }} />
}
