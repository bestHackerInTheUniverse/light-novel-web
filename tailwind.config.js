tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                /* Neutral backgrounds */
                "background": "#ffffff",
                "background-light": "#ffffff",
                "background-dark": "#0b1220", /* deep navy for excellent contrast */

                /* Surfaces */
                "surface": "#f8fafc",
                "surface-light": "#ffffff",
                "surface-dark": "#0f1720",

                /* Borders */
                "border": "#e5e7eb",
                "border-light": "#e5e7eb",
                "border-dark": "#1f2937",

                /* Text */
                "text-main": "#111827",
                "text-main-light": "#0f1720",
                "text-main-dark": "#e6eef0",
                "text-muted": "#6b7280",
                "text-muted-dark": "#9ca3af",
                "text-secondary": "#6b7280",
                "text-secondary-dark": "#9aa1a6",

                /* Inputs */
                "input-bg-light": "#ffffff",
                "input-bg-dark": "#0f1720",

                /* Brand */
                "primary": "#0ea5a4",
                "primary-hover": "#028b84",

                /* Utility surface borders */
                "surface-border": "#f1f5f9",
                "surface-border-dark": "#2b2f33",
            },
            fontFamily: {
                "sans": ["Inter", "Nunito Sans", "sans-serif"],
                "serif": ["Merriweather", "serif"],
                "display": ["Inter", "sans-serif"],
            },
        },
    },
};