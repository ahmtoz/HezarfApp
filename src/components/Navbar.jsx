import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/hezarfapp_logo.png";
import LoginModal from "./LoginModal";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [activeMenu, setActiveMenu] = useState("HOME");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const { user, signOut } = useAuth();

    const toggleMenu = () => setShowMenu(!showMenu);

    return (
        <nav className="flex md:justify-start justify-between gap-4 items-center w-full pt-5 md:pt-15 px-5 md:px-10 lg:px-40 bg-white mx-auto" style={{ maxWidth: "1440px" }}>
            <div>
                <Link to="/">
                    <img
                        className="w-[58px] h-[58px]"
                        src={logo}
                        alt="HezarfApp Logo"
                    />
                </Link>
            </div>

            <div className={`fixed top-0 right-0 h-screen bg-white shadow-2xl z-10 flex flex-col gap-6 pt-12 px-16 transition-transform duration-300 ease-in-out transform ${showMenu ? 'translate-x-0' : 'translate-x-full'} md:static md:h-auto md:flex-row md:justify-between md:bg-light-gray md:shadow-none md:p-1 md:gap-1 md:rounded-lg md:translate-x-0 w-full`}>

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
                    {user ? (
                        <>
                            <span className="text-sm leading-[24px] font-bold py-2 px-2 flex items-center truncate max-w-[150px]" title={user.email}>
                                {user.email.split('@')[0]}
                            </span>
                            <button
                                onClick={signOut}
                                className="text-sm leading-[24px] font-bold cursor-pointer bg-black text-white py-2 px-4 rounded-lg transition-colors duration-300 border-none hover:bg-gray-800"
                            >
                                Çıkış Yap
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="text-sm leading-[24px] font-bold cursor-pointer bg-black text-white py-2 px-4 rounded-lg transition-colors duration-300 border-none hover:bg-gray-800"
                        >
                            Log in
                        </button>
                    )}
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

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
        </nav>
    )
}

export default Navbar;
