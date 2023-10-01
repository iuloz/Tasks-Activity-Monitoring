import { useState } from "react";

function TasksItem({ id, date, task, tag, start, end, hours }) {
    const [isActive, setIsActive] = useState(true);
    const [status, setStatus] = useState("Inactive");
    const [color, setColor] = useState("#ffd5bb");
    const [taskName, setTaskName] = useState(task);
    const [editing, setEditing] = useState(false);

    const changeStatus = () => {
        setStatus(isActive ? "Active" : "Inactive");
        setColor(isActive ? "lightgreen" : "#ffd5bb");
        setIsActive(!isActive);
    }

    const renameTask = (e) => {
        setTaskName(e.target.value);
        setEditing(false);
    }

    const startEditing = () => {
        setEditing(true);
    }

    return (
        <div key={id} className="task-item" style={{backgroundColor: color}}>
            <p style={{display:"inline"}}>Date: {date}</p><span onClick={changeStatus} className="status">{status}</span>
            <p style={{fontWeight:"bold", paddingBottom:"10px", paddingTop:"5px", cursor:"pointer"}}>
                {editing ?
                    (<input type="text"
                            value={taskName}
                            onChange={e=>setTaskName(e.target.value)}
                            onBlur={renameTask}
                            autoFocus
                            style={{height:"10px"}}
                    />)
                    :
                    (<p onDoubleClick={startEditing}>{taskName}</p>)}
            </p>
            <p>Tag: {tag}</p>
            <p>Starts: {start}</p>
            <p>Ends: {end}</p>
            <p>Hours: {hours}</p>
        </div>
    );
}
export default TasksItem;