import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/hezarfapp_logo.png";

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [activeMenu, setActiveMenu] = useState("HOME");
    const toggleMenu = () => setShowMenu(!showMenu);

    return (
        <nav className="flex md:justify-start justify-between gap-4 items-center w-full md:pt-15 md:px-40 pt-5 px-5 bg-white mx-auto" style={{ maxWidth: "1440px" }}>
            <div>
                <Link to="/">
                    <img
                        className="w-[58px] h-[58px]"
                        src={logo}
                        alt="HezarfApp Logo"
                    />
                </Link>
            </div>

            <div className={`fixed top-0 right-0 h-screen bg-white shadow-2xl z-10 flex flex-col gap-6 pt-12 px-16 transition-transform duration-300 ease-in-out transform ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:static md:h-auto md:flex-row md:justify-between md:bg-[#f5f5f5] md:shadow-none md:p-1 md:gap-1 md:rounded-lg md:translate-x-0 w-full`}>

                <ul className="flex flex-col md:flex-row m-0 p-0 list-none">
                    <li className={`flex items-center rounded-lg transition-colors duration-300 ${activeMenu === "HOME" ? "bg-white" : ""}`}>
                        <Link
                            to="/"
                            className="text-sm leading-[24px] font-bold cursor-pointer bg-transparent py-2 px-4 border-none w-full"
                            onClick={() => setActiveMenu("HOME")}
                        >
                            HOME
                        </Link>
                    </li>
                    <li className={`flex items-center rounded-lg transition-colors duration-300 ${activeMenu === "CONTACT" ? "bg-white" : ""}`}>
                        <Link
                            to="/contact"
                            className="text-sm leading-[24px] font-bold cursor-pointer bg-transparent py-2 px-4 border-none w-full"
                            onClick={() => setActiveMenu("CONTACT")}
                        >
                            Contact Us
                        </Link>
                    </li>
                    <li className={`flex items-center rounded-lg transition-colors duration-300 ${activeMenu === "ABOUT" ? "bg-white" : ""}`}>
                        <Link
                            to="/about"
                            className="text-sm leading-[24px] font-bold cursor-pointer bg-transparent py-2 px-4 border-none w-full"
                            onClick={() => setActiveMenu("ABOUT")}
                        >
                            About Us
                        </Link>
                    </li>
                    <li className={`flex items-center rounded-lg transition-colors duration-300 ${activeMenu === "DASHBOARD" ? "bg-white" : ""}`}>
                        <Link
                            to="/dashboard"
                            className="text-sm leading-[24px] font-bold cursor-pointer bg-transparent py-2 px-4 border-none w-full"
                            onClick={() => setActiveMenu("DASHBOARD")}
                        >
                            Dashboard
                        </Link>
                    </li>
                </ul>

                <div className="flex flex-col md:flex-row gap-2">
                    <Link
                        to="/login"
                        className="text-sm leading-[24px] font-bold cursor-pointer bg-transparent py-2 px-4 rounded-lg transition-colors duration-300 border-none"
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="text-sm leading-[24px] font-bold cursor-pointer bg-transparent py-2 px-4 rounded-lg transition-colors duration-300 border-solid border-1 border-[#595D62]"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>

            <button
                className="hamburger-menu md:hidden flex flex-col justify-between w-6 h-4 cursor-pointer border-none bg-transparent relative z-11 p-0"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                aria-expanded={showMenu}
            >
                <span className={`bar w-full h-0.5 bg-black rounded transition-all duration-300 origin-center ${showMenu ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                <span className={`bar w-full h-0.5 bg-black rounded transition-all duration-300 ${showMenu ? 'opacity-0' : ''}`}></span>
                <span className={`bar w-full h-0.5 bg-black rounded transition-all duration-300 origin-center ${showMenu ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
            </button>
        </nav>
    )
}

export default Navbar;
