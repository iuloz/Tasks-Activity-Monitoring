import { useState } from "react";

function TasksItem({ id, date, task, tag, start, end, hours }) {
    const [isActive, setIsActive] = useState(true);
    const [status, setStatus] = useState("Inactive");
    const [color, setColor] = useState("#ffd5bb");
    const [taskName, setTaskName] = useState(task);
    const [taskEditing, setTaskEditing] = useState(false);
    const [tagName, setTagName] = useState(tag);
    const [tagEditing, setTagEditing] = useState(false);

    const changeStatus = () => {
        setStatus(isActive ? "Active" : "Inactive");
        setColor(isActive ? "lightgreen" : "#ffd5bb");
        setIsActive(!isActive);
    }

    const renameTask = (e) => {
        setTaskName(e.target.value);
        setTaskEditing(false);
    }

    const editTask = () => {
        setTaskEditing(true);
    }

    const renameTag = (e) => {
        setTagName(e.target.value);
        setTagEditing(false);
    }

    const editTag = () => {
        setTagEditing(true);
    }

    const deleteTaskComponent = () => {

    }




    return (
        <div key={id} className="task-item" style={{backgroundColor: color}}>
            <p style={{display:"inline"}}>{date}</p><span onClick={changeStatus} className="status">{status}</span>
            <p class="task">
                {taskEditing ?
                    (<input type="text"
                            value={taskName}
                            onChange={e => setTaskName(e.target.value)}
                            onBlur={renameTask}
                            autoFocus
                            style={{height:"10px"}}
                    />)
                    :
                    (<p onDoubleClick={editTask}>{taskName}</p>)}
            </p>
            <p style={{display:"inline-block"}}>Tag: <span class="tag-span">
                {tagEditing ?
                    (<input type="text"
                            value={tagName}
                            onChange={e => setTagName(e.target.value)}
                            onBlur={renameTag}
                            autoFocus
                            style={{height:"10px", width:"130px"}}
                    />)
                    :
                    (<span class="tag-span" onDoubleClick={editTag}>{tagName}</span>)}
            </span></p>
            <p>Starts: {start}</p>
            <p>Ends: {end}</p>
            <p>Hours: {hours}<span id="delete_task" onClick={deleteTaskComponent}>⤬</span></p>
        </div>
    );
}
export default TasksItem;