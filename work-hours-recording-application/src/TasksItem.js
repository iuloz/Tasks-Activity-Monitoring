import { useState } from "react";

function TasksItem({ date, task, tag, start, end, hours }) {
    const [isActive, setIsActive] = useState(true);
    const [status, setStatus] = useState("Inactive");
    const [color, setColor] = useState("#ffd5bb");
    const [taskName, setTaskName] = useState(task);
    const [taskEditing, setTaskEditing] = useState(false);
    const [tagName, setTagName] = useState(tag);
    const [tagEditing, setTagEditing] = useState(false);
    const [remove, setRemove] = useState(false);


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
        setRemove(true);
    }




    return remove ? null : (
        <div className="task-item" style={{ backgroundColor: color }}>
            <p style={{ display: "inline" }}>{date}</p><span onClick={changeStatus} className="status">{status}</span>

            {taskEditing ? (
                <input
                    type="text"
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                    onBlur={renameTask}
                    autoFocus
                    style={{ height: "10px" }}
                />
            ) : (
                <p className="task" onDoubleClick={editTask}>{taskName}</p>
            )}

            <p style={{ display: "inline-block" }}>Tag:
                {tagEditing ? (
                    <input
                        type="text"
                        value={tagName}
                        onChange={e => setTagName(e.target.value)}
                        onBlur={renameTag}
                        autoFocus
                        style={{ height: "10px", width: "130px" }}
                    />
                ) : (
                    <span className="tag-span" onDoubleClick={editTag}> {tagName}</span>
                )}
            </p>

            <p>Starts: {start}</p>
            <p>Ends: {end}</p>
            <p>Hours: {hours}<span id="delete_task" onClick={deleteTaskComponent}>⤬</span></p>
        </div>
    );
}


export default TasksItem;