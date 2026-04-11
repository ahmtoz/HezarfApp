/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4E46B4',
                secondary: '#D33030',
            },
            fontFamily: {
                sans: ['"DM Sans"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}