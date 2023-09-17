import { useState } from "react";
import HoursRecordingsItem from "./HoursRecordingsItem";

function HoursRecordings() {
    const [hoursRecords, setHoursRecords] = useState([]);
    const [newHoursRecord, setNewHoursRecord] = useState({ id: "", hours: "" });
    const [timeFrom, setTimeFrom] = useState("");
    const [timeTill, setTimeTill] = useState("");

    const recordHours = async (event) => {
        await event.preventDefault();
        if (newHoursRecord.hours === "") {
            return;
        } else {
            setHoursRecords([...hoursRecords, newHoursRecord]);
        }
        setNewHoursRecord({ id: "", hours: "" });
    }

    const inputChanged = (event) => {
        setNewHoursRecord({ id: "", hours: event.target.value });
    }

    return (
        <>
            <h1>Work Hours Recording</h1>
            <form onSubmit={recordHours}>
                <input id="input" type="text" placeholder="Work hours" name="name" value={newHoursRecord.hours} onChange={inputChanged}></input>
                <input id="submitBtn" type="submit" value="Add" />
                <input type="text" placeholder="Time from" name="name"></input>

            </form>
            <HoursRecordingsItem hoursRecords={hoursRecords} timeFrom={timeFrom} timeTill={timeTill} />
        </>
    )
}

export default HoursRecordings;