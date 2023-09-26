function Form({ task, recordTask, inputChanged }){

    return (
        <div>
            <form onSubmit={recordTask}>
                <label htmlFor="task_input">Task:<span>*</span> </label>
                <input id="task_input" type="text"  placeholder="Type the task" name="task" value={task.task} onChange={inputChanged}></input>
                <label htmlFor="tag_input">Tag: </label>
                <input id="tag_input" type="text" placeholder="Type the tag" name="tag" value={task.tag} onChange={inputChanged}></input>
                <label htmlFor="start">Start time:<span>*</span> </label>
                <input id="start" type="text"  placeholder="hh:mm" name="start" value={task.start} onChange={inputChanged}></input>
                <label htmlFor="end">End time:<span>*</span> </label>
                <input id="end" type="text" placeholder="hh:mm" name="end" value={task.end} onChange={inputChanged}></input>
                <input id="submit_btn" type="submit" value="Add" /><span style={{float:"right"}}>* <span style={{color:'black', float:"right"}}> - mandatory fields</span></span>
            </form>
        </div>
    );
}

export default Form;