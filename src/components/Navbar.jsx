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
            {showMenu && (
                <ul className="flex flex-col gap-4 absolute top-0 right-0 px-16 py-16 h-screen bg-white shadow-lg z-1">
                    <li className="text-lg font-medium cursor-pointer">Home</li>
                    <li className="text-lg font-medium cursor-pointer">About</li>
                    <li className="text-lg font-medium cursor-pointer">Contact</li>
                </ul>
            )}
            <ul className="flex justify-between items-center gap-4 hidden md:flex">
                <li className="text-lg font-medium cursor-pointer">Home</li>
                <li className="text-lg font-medium cursor-pointer">About</li>
                <li className="text-lg font-medium cursor-pointer">Contact</li>
            </ul>
            <div className="hamburger-menu md:hidden block cursor-pointer flex flex-col justify-between w-6 h-4 z-2" onClick={toggleMenu}>
                <span className="bar w-full h-0.5 bg-black rounded"></span>
                <span className="bar w-full h-0.5 bg-black rounded"></span>
                <span className="bar w-full h-0.5 bg-black rounded"></span>
            </div>
        </nav>
    )
}

export default Navbar;
