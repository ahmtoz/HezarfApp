import { useState } from "react";

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const toggleMenu = () => setShowMenu(!showMenu);

    return (
        <nav className="flex justify-between items-center w-full p-4 bg-white">
            <div>
                <img
                    className="w-12 h-auto"
                    src="https://cdn.shopify.com/s/files/1/0558/6413/1764/files/BlogThumbnail_Clock_Illustration_1024x1024.jpg?v=1714053195"
                    alt="HezarfApp Logo" />
            </div>
            <ul className={`fixed top-0 right-0 h-screen bg-white shadow-2xl z-1 flex flex-col pt-24 px-16 gap-6 transition-transform duration-300 ease-in-out transform ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:static md:h-auto md:bg-transparent md:shadow-none md:p-0 md:flex-row md:translate-x-0`}>
                <li className="text-lg font-medium cursor-pointer hover:text-gray-600 transition-colors">Home</li>
                <li className="text-lg font-medium cursor-pointer hover:text-gray-600 transition-colors">About</li>
                <li className="text-lg font-medium cursor-pointer hover:text-gray-600 transition-colors">Contact</li>
            </ul>
            <div className="hamburger-menu md:hidden flex flex-col justify-between w-6 h-4 cursor-pointer relative z-2" onClick={toggleMenu}>
                <span className={`bar w-full h-0.5 bg-black rounded transition-all duration-300 origin-center ${showMenu ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                <span className={`bar w-full h-0.5 bg-black rounded transition-all duration-300 ${showMenu ? 'opacity-0' : ''}`}></span>
                <span className={`bar w-full h-0.5 bg-black rounded transition-all duration-300 origin-center ${showMenu ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
            </div>
        </nav>
    )
}

export default Navbar;
