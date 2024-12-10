import React, { useState } from "react";
import alarmSound from "../assets/alarm.mp3";
import "../Components/alarm.css";

const Alarm = () => {
    const [alarmDetails, setAlarmDetails] = useState([]);
    const [activeAlarm, setActiveAlarm] = useState(null); // Tracks the ringing alarm
    const [audioInstance, setAudioInstance] = useState(null); // Tracks the alarm sound instance
    const [timers, setTimers] = useState([]); // Stores alarm timer IDs


    const submitHandler = (event) => {
        event.preventDefault();

        // User Input
        let alarmHr = parseInt(event.target[0].value);
        const alarmMin = parseInt(event.target[1].value);
        const am = event.target[2].checked;
        const pm = event.target[3].checked;

        // Adjust alarmHr for 24-hour format
        if (pm && alarmHr === 12) {
            alarmHr = 12;
        } else if (am && alarmHr === 12) {
            alarmHr = 0;
        } else if (pm) {
            alarmHr += 12;
        }

        // Current Time
        const date = new Date();
        const currentHr = date.getHours();
        const currentMin = date.getMinutes();
        const currentSec = date.getSeconds();

        // Calculate Time Difference in seconds
        let diff =
            (alarmHr * 3600 + alarmMin * 60) - (currentHr * 3600 + currentMin * 60 + currentSec);

        if (diff < 0) {
            diff += 24 * 3600; // Adjust to next day if negative
        }

        // Format alarmTime for storage
        const alarmTime = {
            hr: alarmHr > 12 ? alarmHr - 12 : alarmHr,
            min: alarmMin,
            ampm: alarmHr >= 12 ? "PM" : "AM",
            enabled: true,
            snoozed: false, // Default snoozed state
        };

        setAlarmDetails([...alarmDetails, alarmTime]);

        // Schedule the alarm
        scheduleAlarm(alarmTime, diff);
    };

    const scheduleAlarm = (alarm, diff) => {
        const timerId = setTimeout(() => {
            triggerAlarm(alarm);
        }, diff * 1000);

        setTimers([...timers, { alarm, timerId }]);
    };

    const triggerAlarm = (alarm) => {
        setActiveAlarm(alarm); // Activate alarm
        const audio = new Audio(alarmSound); // Create a new audio instance
        audio.loop = true; // Enable looping for continuous ringing
        audio.play();
        setAudioInstance(audio); // Store the audio instance

        // Disable the alarm after it rings
        setAlarmDetails((prevDetails) =>
            prevDetails.map((item) =>
                item.hr === alarm.hr && item.min === alarm.min && item.ampm === alarm.ampm
                    ? { ...item, enabled: false }
                    : item
            )
        );
    };

    const stopAlarm = () => {
        if (audioInstance) {
            audioInstance.pause(); // Pause the audio
            audioInstance.currentTime = 0; // Reset audio playback position
        }
        setAudioInstance(null); // Clear the audio instance
        setActiveAlarm(null); // Dismiss the active alarm

        // Set the alarm as disabled when stopped
        setAlarmDetails((prevDetails) =>
            prevDetails.map((item) =>
                item.hr === activeAlarm.hr && item.min === activeAlarm.min && item.ampm === activeAlarm.ampm
                    ? { ...item, enabled: false }
                    : item
            )
        );
    };

    const snoozeAlarm = () => {
        if (audioInstance) {
            audioInstance.pause(); // Pause the audio
            audioInstance.currentTime = 0; // Reset audio playback position
        }
        setAudioInstance(null); // Clear the audio instance
        setActiveAlarm(null); // Dismiss notification

        // Schedule snoozed alarm for 5 minutes later
        const snoozeTime = 5 * 60 * 1000; // Snooze for 5 minutes
        const snoozeAlarm = {
            ...activeAlarm,
            snoozed: true, // Mark as snoozed
        };

        setAlarmDetails((prevDetails) =>
            prevDetails.map((item) =>
                item.hr === snoozeAlarm.hr && item.min === snoozeAlarm.min && item.ampm === snoozeAlarm.ampm
                    ? { ...item, snoozed: true }
                    : item
            )
        );

        setTimeout(() => {
            triggerAlarm(snoozeAlarm);
        }, snoozeTime);
    };

    const toggleAlarm = (index) => {
        const alarm = alarmDetails[index];
        setAlarmDetails((prevDetails) =>
            prevDetails.map((item, i) =>
                i === index ? { ...item, enabled: !item.enabled, snoozed: false } : item
            )
        );

        if (!alarm.enabled) {
            // Re-enable the alarm
            const date = new Date();
            const currentHr = date.getHours();
            const currentMin = date.getMinutes();
            const currentSec = date.getSeconds();

            let diff =
                (alarm.hr * 3600 + alarm.min * 60) -
                (currentHr * 3600 + currentMin * 60 + currentSec);

            if (diff < 0) {
                diff += 24 * 3600; // Adjust to next day if negative
            }

            scheduleAlarm(alarm, diff);
        } else {
            // Disable the alarm (cancel the timer)
            const timerToCancel = timers.find((t) => t.alarm === alarm);
            if (timerToCancel) {
                clearTimeout(timerToCancel.timerId);
                setTimers(timers.filter((t) => t !== timerToCancel));
            }
        }
    };

    const cancelAlarm = (index) => {
        // Cancel the timer for the alarm
        const timerToCancel = timers.find((t) => t.alarm === alarmDetails[index]);
        if (timerToCancel) {
            clearTimeout(timerToCancel.timerId);
            setTimers(timers.filter((t) => t !== timerToCancel));
        }

        // Remove the alarm from the list
        setAlarmDetails(alarmDetails.filter((_, i) => i !== index));
    };

    return (
        <div>
            <form action="#" onSubmit={submitHandler}>
                <input
                    type="number"
                    name="hr"
                    id="hr"
                    placeholder="Hour"
                    min="1"
                    max="12"
                    required
                />
                <input
                    type="number"
                    name="min"
                    id="min"
                    placeholder="Minute"
                    min="0"
                    max="59"
                    required
                />
                <label>
                    <input type="radio" name="format" id="am" required /> AM
                </label>
                <label>
                    <input type="radio" name="format" id="pm" required /> PM
                </label>
                <button type="submit">Set Alarm</button>
            </form>
    
            <h3>Scheduled Alarms:</h3>
            {alarmDetails.map((alarm, index) => (
                <div key={index}>
                    <h4>Alarm {index + 1}</h4>
                    <p>
                        {alarm.hr}:{alarm.min.toString().padStart(2, "0")} {alarm.ampm}{" "}
                        {alarm.enabled
                            ? "(Enabled)"
                            : alarm.snoozed
                            ? "(Snoozed)"
                            : "(Disabled)"}
                    </p>
                    
                    {/* Toggle between Disable/Enable button */}
                    {alarm.snoozed || alarm.enabled ? (
                        <button onClick={() => toggleAlarm(index)}>Disable</button>
                    ) : (
                        <button onClick={() => toggleAlarm(index)}>Enable</button>
                    )}
                    
                    <button onClick={() => cancelAlarm(index)}>Cancel Alarm</button>
                </div>
            ))}
    
            {/* Display active alarm notification */}
            {activeAlarm && (
                <div className="notification">
                    <h3>Alarm Ringing!</h3>
                    <p>
                        {activeAlarm.hr}:{activeAlarm.min.toString().padStart(2, "0")}{" "}
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
