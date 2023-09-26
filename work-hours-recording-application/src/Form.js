function Form({ task, recordTask, inputChanged }){

    return (
        <>
            <h2>Create your task</h2>
            <form onSubmit={recordTask}>
                <label htmlFor="task_input">Task: </label>
                <input id="task_input" type="text"  placeholder="Type the task" name="task" value={task.task} onChange={inputChanged}></input>
                <label htmlFor="tag_input">Tags: </label>
                <input id="tag_input" type="text" placeholder="Type the tag" name="tags" value={task.tags} onChange={inputChanged}></input>
                <label htmlFor="start">Start time: </label>
                <input id="start" type="text"  placeholder="hh:mm" name="start" value={task.start} onChange={inputChanged}></input>
                <label htmlFor="end">End time: </label>
                <input id="end" type="text" placeholder="hh:mm" name="end" value={task.end} onChange={inputChanged}></input>
                <input id="submit_btn" type="submit" value="Add" />
            </form>
        </>
    );
}

export default Form;