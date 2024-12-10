import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../Components/Clock.css";

const Clock = () => {
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const [date, setDate] = useState(
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    );

    setTimeout(() => {
        setTime(new Date().toLocaleTimeString());
        setDate(
            new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
    }, 1000);

    return (
        <div className="clock-container">
            <p className="motivation-line">Every second is a fresh start!</p>

            <h1 className="clock">
                {time}
            </h1>

            <p className="date-display">{date}</p>

            <div className="navigation-buttons">
                <NavLink to="/stopwatch" className="nav-button">
                    Stopwatch
                </NavLink>
                <NavLink to="/alarm" className="nav-button">
                    Alarm
                </NavLink>
            </div>
        </div>
    );
};

export default Clock;
