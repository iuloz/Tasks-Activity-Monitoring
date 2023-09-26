import "./styles.css"

function TasksItem({ date, task, tags, start, end, hours }) {

    return (
        <div className="task-item">
            <p>Date: {date}</p>
            <p>{task}</p>
            <p>Tags: {tags}</p>
            <p>Starts: {start}</p>
            <p>Ends: {end}</p>
            <p>Hours: {hours}</p>
        </div>
    );
}
export default TasksItem;