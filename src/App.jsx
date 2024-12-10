import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Clock from "./Pages/Clock";
import Stopwatch from "./Pages/Stopwatch";
import Alarm from "./Pages/Alarm";
import Navbar from "./Components/Navbar";

function App() {
    return (
        <div>
            <Navbar />

            <Routes>
                <Route path="/" element={<Clock />} />
                <Route path="/stopwatch" element={<Stopwatch />} />
                <Route path="/alarm" element={<Alarm />} />
            </Routes>
        </div>
    );
}

export default App;
