function Form(props){
    return (
        <>
            <h2>Create your task</h2>
            <form onSubmit={props.recordTask}>
                <label htmlFor="taskInput">Task: </label>
                <input id="taskInput" type="text"  placeholder="Type the task" name="task" value={props.task.task} onChange={props.inputChanged}></input>
                <label htmlFor="start">Start time: </label>
                <input id="start" type="text"  placeholder="hh:mm" name="start" value={props.task.start} onChange={props.inputChanged}></input>
                <label htmlFor="end">End time: </label>
                <input id="end" type="text" placeholder="hh:mm" name="end" value={props.task.end} onChange={props.inputChanged}></input>
                <input id="submitBtn" type="submit" value="Add" />
            </form>
        </>
    );
}

export default Form;