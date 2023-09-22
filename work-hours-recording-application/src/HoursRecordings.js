import { useState } from "react";
import HoursRecordingsItem from "./HoursRecordingsItem";

function HoursRecordings() {
    const [hoursRecords, setHoursRecords] = useState([]);
    const [newHoursRecord, setNewHoursRecord] = useState({date: "", task: "", start: "", end: "", hours: ""});

    const recordHours = async (event) => {
        await event.preventDefault();
        if (newHoursRecord.start === "" || newHoursRecord.end === "") {
            return;
        } else {
            // Calculating time difference between star and end time
            const [hoursStart, minutesStart] = newHoursRecord.start.split(':').map(Number);
            const [hoursEnd, minutesEnd] = newHoursRecord.end.split(':').map(Number);
            if (minutesStart > 59 || minutesStart < 0 || hoursStart > 23 || hoursStart < 0
                || minutesEnd > 59 || minutesEnd < 0 || hoursEnd > 23 || hoursEnd < 0){
                alert('Please, provide time in correct format: "hh:mm"');
                return;
            } else {
                const dateStart = new Date(0, 0, 0, hoursStart, minutesStart);
                const dateEnd = new Date(0, 0, 0, hoursEnd, minutesEnd);
                const timeDifference = Math.abs(dateEnd < dateStart ? dateEnd-dateStart+24*1000*60*60 : dateEnd-dateStart);
                const hoursDifference = (timeDifference / (1000 * 60 * 60)).toFixed(1);

                setNewHoursRecord(prev => ({ ...prev, hours: hoursDifference }));
                setHoursRecords(prev => [...prev, { ...newHoursRecord, hours: hoursDifference }]);
            }
        }
        // Setting empty fields for start and end to make input fields empty after form submit
        setNewHoursRecord(prev => ({ ...prev, task: "", start: "", end: "" }));
    }

    const hoursChanged = (event) => {
        const date = (new Date()).toLocaleDateString("fi-FI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        setNewHoursRecord({ ...newHoursRecord, date: date, [event.target.name]: event.target.value });
    }


    return (
        <>
            <h2>Hours Recording</h2>
            <form onSubmit={recordHours}>
                <label htmlFor="task">Task: </label>
                <input id="taskInput" type="text"  placeholder="Type the task" name="task" value={newHoursRecord.task} onChange={hoursChanged}></input>
                <label htmlFor="start">Start time: </label>
                <input type="text"  placeholder="hh:mm" name="start" value={newHoursRecord.start} onChange={hoursChanged}></input>
                <label htmlFor="end">End time: </label>
                <input type="text" placeholder="hh:mm" name="end" value={newHoursRecord.end} onChange={hoursChanged}></input>
                <input id="submitBtn" type="submit" value="Add" />
            </form>
            <HoursRecordingsItem hoursRecords={hoursRecords} />
        </>
    )
}

export default HoursRecordings;