import React, { useState } from "react";
import alarmSound from "../assets/alarm.mp3";
import "../Components/alarm.css";

const Alarm = () => {
    const [alarmDetails, setAlarmDetails] = useState([]);
    const [activeAlarm, setActiveAlarm] = useState(null); 
    const [audioInstance, setAudioInstance] = useState(null); instance
    const [timers, setTimers] = useState([]); 
    const [hour, setHour] = useState("");
    const [minute, setMinute] = useState("");

    // ======== Hour Change: <=12 ====================
    const handleHourChange = (event) => {
        const value = event.target.value;

        if (/^\d{0,2}$/.test(value)) {
            if (value === "" || (Number(value) >= 1 && Number(value) <= 12)) {
                setHour(value); 
            } else if (value.length === 2 && value[0] === "0") {
                setHour(value[1]);
            }
        }
    };

    // ============= Minute Change: <= 59 ====================
    const handleMinuteChange = (event) => {
        const value = event.target.value;

        if (/^\d{0,2}$/.test(value)) {
            if (value === "" || (Number(value) >= 0 && Number(value) <= 59)) {
                setMinute(value); 
            } else if (value.length === 2 && value[0] === "0") {
                setMinute(value[1]); 
            }
        }
    };

    // ============= Add Alarm ====================
    const submitHandler = (event) => {
        event.preventDefault();

        // User Input
        let alarmHr = parseInt(event.target[0].value);
        const alarmMin = parseInt(event.target[1].value);
        const am = event.target[2].checked;
        const pm = event.target[3].checked;

        
        if (alarmHr < 1 || alarmHr > 12) {
            alert("Please enter a valid hour (1-12).");
            return;
        }
        if (alarmMin < 0 || alarmMin > 59) {
            alert("Please enter a valid minute (0-59).");
            return;
        }

        if (pm && alarmHr !== 12) {
            alarmHr += 12;
        } else if (am && alarmHr === 12) {
            alarmHr = 0; 
        } else if (pm && alarmHr === 12) {
            alarmHr = 12; 
        }

        const date = new Date();
        const currentHr = date.getHours();
        const currentMin = date.getMinutes();
        const currentSec = date.getSeconds();

        let diff =
            alarmHr * 3600 +
            alarmMin * 60 -
            (currentHr * 3600 + currentMin * 60 + currentSec);

        if (diff < 0) {
            diff += 24 * 3600; 
        }

        const alarmTime = {
            hr: alarmHr === 0 ? 12 : alarmHr > 12 ? alarmHr - 12 : alarmHr, 
            min: alarmMin,
            ampm: alarmHr >= 12 ? "PM" : "AM",
            enabled: true,
            snoozed: false, 
        };

        setAlarmDetails([...alarmDetails, alarmTime]);

        scheduleAlarm(alarmTime, diff);

        setHour("");
        setMinute("");
        event.target[0].value = ""; 
        event.target[1].value = ""; 
        event.target[2].checked = false; 
        event.target[3].checked = false; 
    };

    // ============= New Alarm ====================
    const scheduleAlarm = (alarm, diff) => {
        const timerId = setTimeout(() => {
            triggerAlarm(alarm);
        }, diff * 1000);

        setTimers([...timers, { alarm, timerId }]);
    };

    // ============= Trigger Alarm ====================
    const triggerAlarm = (alarm) => {
        setActiveAlarm(alarm); 
        const audio = new Audio(alarmSound); 
        audio.loop = true; 
        audio.play();
        setAudioInstance(audio); 

        setAlarmDetails((prevDetails) =>
            prevDetails.map((item) =>
                item.hr === alarm.hr &&
                item.min === alarm.min &&
                item.ampm === alarm.ampm
                    ? { ...item, enabled: false }
                    : item
            )
        );
    };

    // ============= Stop Alarm ====================
    const stopAlarm = () => {
        if (audioInstance) {
            audioInstance.pause(); 
            audioInstance.currentTime = 0; 
        }
        setAudioInstance(null); 
        setActiveAlarm(null); 

        setAlarmDetails((prevDetails) =>
            prevDetails.map((item) =>
                item.hr === activeAlarm.hr &&
                item.min === activeAlarm.min &&
                item.ampm === activeAlarm.ampm
                    ? { ...item, enabled: false }
                    : item
            )
        );
    };

    // ============= Snooze Alarm ====================
    const snoozeAlarm = () => {
        if (audioInstance) {
            audioInstance.pause(); 
            audioInstance.currentTime = 0; 
        }
        setAudioInstance(null); 
        setActiveAlarm(null); 

        const snoozeTime = 5 * 60 * 1000; // Snooze for 5 minutes
        const snoozeAlarm = {
            ...activeAlarm,
            snoozed: true, 
        };

        setAlarmDetails((prevDetails) =>
            prevDetails.map((item) =>
                item.hr === snoozeAlarm.hr &&
                item.min === snoozeAlarm.min &&
                item.ampm === snoozeAlarm.ampm
                    ? { ...item, snoozed: true }
                    : item
            )
        );

        setTimeout(() => {
            triggerAlarm(snoozeAlarm);
        }, snoozeTime);
    };

    // ============= Toggle between states ====================
    const toggleAlarm = (index) => {
        const alarm = alarmDetails[index];
        setAlarmDetails((prevDetails) =>
            prevDetails.map((item, i) =>
                i === index
                    ? { ...item, enabled: !item.enabled, snoozed: false }
                    : item
            )
        );

        if (!alarm.enabled) {
            // Re-enable the alarm
            const date = new Date();
            const currentHr = date.getHours();
            const currentMin = date.getMinutes();
            const currentSec = date.getSeconds();

            let diff =
                alarm.hr * 3600 +
                alarm.min * 60 -
                (currentHr * 3600 + currentMin * 60 + currentSec);

            if (diff < 0) {
                diff += 24 * 3600; 
            }

            scheduleAlarm(alarm, diff);
        } else {
            const timerToCancel = timers.find((t) => t.alarm === alarm);
            if (timerToCancel) {
                clearTimeout(timerToCancel.timerId);
                setTimers(timers.filter((t) => t !== timerToCancel));
            }
        }
    };

    const cancelAlarm = (index) => {
        const timerToCancel = timers.find(
            (t) => t.alarm === alarmDetails[index]
        );
        if (timerToCancel) {
            clearTimeout(timerToCancel.timerId);
            setTimers(timers.filter((t) => t !== timerToCancel));
        }

        setAlarmDetails(alarmDetails.filter((_, i) => i !== index));
    };

    return (
        <div className="alarm-container">
            // =========== Set New Alarm ========
            <form
                action="#"
                onSubmit={submitHandler}
                className="set-alarm-form"
            >
                <div className="form-first-row">
                    <input
                        type="number"
                        name="hr"
                        id="hr"
                        placeholder="00"
                        value={hour}
                        onChange={handleHourChange}
                        min="1"
                        max="12"
                        required
                    />
                    <small className="colon">:</small>
                    <input
                        type="number"
                        name="min"
                        id="min"
                        placeholder="00"
                        value={minute}
                        onChange={handleMinuteChange}
                        min="0"
                        max="59"
                        required
                    />
                    <div className="set-am-pm">
                        <input
                            type="radio"
                            name="format"
                            id="am"
                            className="am-pm-input"
                        />
                        <label htmlFor="am" className="am-pm-label">
                            AM
                        </label>

                        <input
                            type="radio"
                            name="format"
                            id="pm"
                            className="am-pm-input"
                        />
                        <label htmlFor="pm" className="am-pm-label">
                            PM
                        </label>
                    </div>
                </div>

                <div className="submit-button-div">
                    <button type="submit" className="submit-button">
                        Set Alarm
                    </button>
                </div>
            </form>

            {/* ========== All New Alarms ========== */}
            <div className="alarm-list">
                <h3 className="alarm-list-heading">Scheduled Alarms:</h3>

                <div className="all-alarms">
                {alarmDetails.map((alarm, index) => (
                    <div key={index} className="single-alarm">
                        <h4 className="alarm-name">Alarm {index + 1}</h4>
                        <div className="alarm-info">
                            <p>
                                {alarm.hr}:
                                {alarm.min.toString().padStart(2, "0")}{" "}
                                {alarm.ampm}{" "}
                                {alarm.enabled
                                    ? "(Enabled)"
                                    : alarm.snoozed
                                    ? "(Snoozed)"
                                    : "(Disabled)"}
                            </p>

                            {/* Toggle between Disable/Enable button */}
                            <div className="toggle-button">
                                <input
                                    type="checkbox"
                                    id={`toggle-${index}`}
                                    checked={alarm.enabled || alarm.snoozed} // Enable if snoozed
                                    onChange={() => toggleAlarm(index)}
                                />
                                <label htmlFor={`toggle-${index}`}></label>
                            </div>
                        </div>

                        <button
                            onClick={() => cancelAlarm(index)}
                            className="cancel-alarm-button"
                        >
                            <i className="ri-close-circle-fill"></i>
                        </button>
                    </div>
                ))}
                </div>
                
            </div>

            =========== Alarm notification popup =================
            {activeAlarm && (
                <div className="notification">
                    <h3>Alarm Ringing!</h3>
                    <p>
                        {activeAlarm.hr}:
                        {activeAlarm.min.toString().padStart(2, "0")}{" "}
                        {activeAlarm.ampm}
                    </p>
                    <button onClick={stopAlarm}>Stop</button>
                    <button onClick={snoozeAlarm}>Snooze</button>
                </div>
            )}
        </div>
    );
};

export default Alarm;
