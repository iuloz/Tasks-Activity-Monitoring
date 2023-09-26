import { useState } from "react";
import TasksItem from "./TasksItem";
import Form from "./Form";

function Tasks() {
    const [taskList, setTaskList] = useState([]);
    const [task, setTask] = useState({date: "", task: "", tags: [], start: "", end: "", hours: ""});

    const recordTask = async (event) => {
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

    const inputChanged = (event) => {
        const date = (new Date()).toLocaleDateString("fi-FI", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        setTask({ ...task, date: date, [event.target.name]: event.target.value });
    }


    return (
        <>
            <Form task={task} inputChanged={inputChanged} recordTask={recordTask}/>
            {
                taskList.map((item, index) => <TasksItem key={index} date={item.date} task={item.task} tags={item.tags} start={item.start} end={item.end} hours={item.hours}/>)
            }
        </>
    );
}

export default Tasks;