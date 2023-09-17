import { useState } from "react";
import HoursRecordingsItem from "./HoursRecordingsItem";

function HoursRecordings() {
    const [hoursRecords, setHoursRecords] = useState([]);
    const [newHoursRecord, setNewHoursRecord] = useState({ id: "", start: "", end: "" });

    const recordHours = async (event) => {
        await event.preventDefault();
        if (newHoursRecord.start === "" || newHoursRecord.end === "") {
            return;
        } else {
            setHoursRecords([...hoursRecords, newHoursRecord]);
        }
        setNewHoursRecord({ id: "", start: "", end: "" });
    }

    const hoursChanged = (event) => {
        setNewHoursRecord({ ...newHoursRecord, id: "", [event.target.name]: event.target.value });
    }


    return (
        <>
            <h1>Work Hours Recording</h1>
            <form onSubmit={recordHours}>
                <input type="text" placeholder="Start time" name="start" value={newHoursRecord.start} onChange={hoursChanged}></input>
                <input type="text" placeholder="End time" name="end" value={newHoursRecord.end} onChange={hoursChanged}></input>
                <input id="submitBtn" type="submit" value="Add" />
            </form>
            <HoursRecordingsItem hoursRecords={hoursRecords} />
        </>
    )
}

export default HoursRecordings;