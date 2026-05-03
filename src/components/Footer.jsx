export default function Footer() {
    return (
        <footer className="w-full pt-24 pb-4 text-center">
            <p className="text-gray-700 text-sm">
                © {new Date().getFullYear()} HezarfApp. All rights reserved.
            </p>
            <div className="mt-4 space-x-4">
                <a href="/privacy.html" className="text-gray-500 hover:text-gray-700 underline">Privacy Policy</a>
                <a href="/privacy.html" className="text-gray-500 hover:text-gray-700 underline">Terms of Service</a>
            </div>
        </footer>
    );
}