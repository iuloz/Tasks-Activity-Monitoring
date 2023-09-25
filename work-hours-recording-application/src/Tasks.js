import { useState } from "react";
import TasksItem from "./TasksItem";

function Tasks() {
    const [taskList, setTaskList] = useState([]);
    const [task, setTask] = useState({date: "", task: "", tags: [], start: "", end: "", hours: ""});

    const recordHours = async (event) => {
        await event.preventDefault();
        if (task.start === "" || task.end === "") {
            return;

        } else {
            // Calculating time difference between start and end time
            const [hoursStart, minutesStart] = task.start.split(':').map(Number);
            const [hoursEnd, minutesEnd] = task.end.split(':').map(Number);
            if (minutesStart > 59 || minutesStart < 0 || hoursStart > 23 || hoursStart < 0
                || minutesEnd > 59 || minutesEnd < 0 || hoursEnd > 23 || hoursEnd < 0){
                alert('Please, provide time in correct format: "hh:mm"');
                return;

            } else {
                const dateStart = new Date(0, 0, 0, hoursStart, minutesStart);
                const dateEnd = new Date(0, 0, 0, hoursEnd, minutesEnd);
                const timeDifference = Math.abs(dateEnd < dateStart ? dateEnd-dateStart+24*1000*60*60 : dateEnd-dateStart);
                const hoursDifference = (timeDifference / (1000 * 60 * 60)).toFixed(1);
                setTask(prev => ({ ...prev, hours: hoursDifference }));
                setTaskList(prev => [...prev, { ...task, hours: hoursDifference }]);
            }
        }
        // Setting empty fields for start and end to make input fields empty after form submit
        setTask(prev => ({ ...prev, task: "", start: "", end: "" }));
    }

    const hoursChanged = (event) => {
        const date = (new Date()).toLocaleDateString("fi-FI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        setTask({ ...task, date: date, [event.target.name]: event.target.value });
    }


    return (
        <>
            <h2>Create your task</h2>
            <form onSubmit={recordHours}>
                <label htmlFor="taskInput">Task: </label>
                <input id="taskInput" type="text"  placeholder="Type the task" name="task" value={task.task} onChange={hoursChanged}></input>
                {/* <label htmlFor="start">Start time: </label>
                <input id="start" type="text"  placeholder="hh:mm" name="start" value={task.start} onChange={hoursChanged}></input> */}
                {/* <label htmlFor="end">End time: </label>
                <input id="end" type="text" placeholder="hh:mm" name="end" value={task.end} onChange={hoursChanged}></input> */}
                <input id="submitBtn" type="submit" value="Add" />
            </form>
            <TasksItem taskList={taskList} />
        </>
    )
}

export default Tasks;