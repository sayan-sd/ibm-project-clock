import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    // Load theme preference from localStorage on component mount
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setIsDarkTheme(storedTheme === "dark");
            if (storedTheme === "dark") {
                document.body.classList.add("dark-theme");
            } else {
                document.body.classList.remove("dark-theme");
            }
        }
    }, []);

    // Toggle theme and store preference in localStorage
    const toggleTheme = () => {
        setIsDarkTheme((prevTheme) => {
            const newTheme = !prevTheme;
            // Save the new theme in localStorage
            localStorage.setItem("theme", newTheme ? "dark" : "light");
            if (newTheme) {
                document.body.classList.add("dark-theme");
            } else {
                document.body.classList.remove("dark-theme");
            }
            return newTheme;
        });
    };

    return (
        <div className="navbar">
            <div className="logo">
                <h1>Clock App</h1>
            </div>
            <div className="nav-links">
                <NavLink to={"/"} className={"nav-link"}>
                    Home
                </NavLink>
                <NavLink to={"stopwatch"} className={"nav-link"}>
                    Stopwatch
                </NavLink>
                <NavLink to={"alarm"} className={"nav-link"}>
                    Alarm
                </NavLink>
                <i
                    className={`ri-${isDarkTheme ? "sun" : "moon"}-fill theme-icon`}
                    onClick={toggleTheme}
                    style={{ cursor: "pointer" }}
                ></i>
            </div>
        </div>
    );
};

export default Navbar;
