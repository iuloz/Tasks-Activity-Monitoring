import { useState } from "react";

function TasksItem({ id, date, task, tag, start, end, hours }) {
    const [isActive, setIsActive] = useState(true);
    const [status, setStatus] = useState("Inactive");
    const [color, setColor] = useState("#ffd5bb");

    const changeStatus = () => {
        setStatus(isActive ? "Active" : "Inactive");
        setColor(isActive ? "lightgreen" : "#ffd5bb");
        setIsActive(!isActive);
    }

    return (
        <div key={id} className="task-item" style={{backgroundColor: color}}>
            <p style={{display:"inline"}}>Date: {date}</p><span onClick={changeStatus} className="status">{status}</span>
            <p style={{fontWeight:"bold"}}>{task}</p>
            <p>Tag: {tag}</p>
            <p>Starts: {start}</p>
            <p>Ends: {end}</p>
            <p>Hours: {hours}</p>
        </div>
    );
}
export default TasksItem;