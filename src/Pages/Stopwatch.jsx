import React, { useRef, useState } from "react";
import "../Components/Stopwatch.css";

const Stopwatch = () => {
    const [time, setTime] = useState({ min: 0, sec: 0, ms: 0 });
    const [running, setRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const timeRef = useRef(null);

    const formatTime = (time) => {
        const { min, sec, ms } = time;
        return `${min <= 9 ? "0" + min : min} : ${
            sec <= 9 ? "0" + sec : sec
        } : ${ms <= 9 ? "0" + ms : ms}`;
    };

    const calculateDiff = (current, previous) => {
        const currentMs = current.min * 6000 + current.sec * 100 + current.ms;
        const previousMs =
            previous.min * 6000 + previous.sec * 100 + previous.ms;

        const diffMs = currentMs - previousMs;
        const diffMin = Math.floor(diffMs / 6000);
        const diffSec = Math.floor((diffMs % 6000) / 100);
        const diffMsOnly = diffMs % 100;

        return { min: diffMin, sec: diffSec, ms: diffMsOnly };
    };

    const handleStartStop = () => {
        if (running) {
            clearInterval(timeRef.current);
        } else {
            timeRef.current = setInterval(() => {
                setTime((prevTime) => {
                    let { min, sec, ms } = prevTime;
                    ms += 1;
                    if (ms >= 100) {
                        ms = 0;
                        sec += 1;
                    }
                    if (sec >= 60) {
                        sec = 0;
                        min += 1;
                    }
                    return { min, sec, ms };
                });
            }, 10);
        }
        setRunning(!running);
    };

    const handleReset = () => {
        clearInterval(timeRef.current);
        setTime({ min: 0, sec: 0, ms: 0 });
        setRunning(false);
        setLaps([]);
    };

    const handleLap = () => {
        const newLap = {
            time: { ...time },
            diff:
                laps.length > 0
                    ? calculateDiff(time, laps[laps.length - 1].time)
                    : time,
        };
        setLaps([...laps, newLap]);
    };

    const handleClearLaps = () => {
        setLaps([]);
    };

    return (
        <div className="stopwatch-container">
            <div className="stopwatch-left">
                <h1 className="stop-watch-time">{formatTime(time)}</h1>
                <div className="buttons">
                    <button onClick={handleStartStop}>
                        {running ? "Stop" : "Start"}
                    </button>
                    <button onClick={handleReset}>Reset</button>
                    <button onClick={handleLap} disabled={!running}>
                        Lap
                    </button>
                    <button
                        onClick={handleClearLaps}
                        disabled={laps.length === 0}
                    >
                        Clear Laps
                    </button>
                </div>
            </div>

            <div className="stopwatch-right">
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: "10%" }}>#</th>
                            <th style={{ width: "45%" }}>Time</th>
                            <th style={{ width: "45%" }}>Diff</th>
                        </tr>
                    </thead>
                </table>
                <div className="table-body-wrapper">
                    <table>
                        <tbody>
                            {/* Render laps in descending order */}
                            {[...laps].reverse().map((lap, index) => (
                                <tr key={index}>
                                    <td>{laps.length - index}</td>{" "}
                                    {/* Show lap number in descending order */}
                                    <td>{formatTime(lap.time)}</td>
                                    <td>{formatTime(lap.diff)}</td>
                                </tr>
                            ))}

                            {/* Placeholder row at the end */}
                            {laps.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        style={{
                                            textAlign: "center",
                                            padding: "1rem",
                                        }}
                                    >
                                        No laps yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Stopwatch;
