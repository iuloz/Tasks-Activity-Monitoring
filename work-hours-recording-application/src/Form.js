function Form({ task, recordTask, inputChanged }){

    return (
        <div>
            <form onSubmit={recordTask} style={{marginRight: '20px', marginTop:'10px'}}>
                <label htmlFor='task_input'>Task:<span className='asterisk'>*</span> </label>
                <input id='task_input' type='text'  placeholder='Type the task' name='task' value={task.task} onChange={inputChanged}></input>
                <label htmlFor='tag_input'>Tag:<span className='asterisk'>*</span> </label>
                <input id='tag_input' type='text' placeholder='Type the tag' name='tags' value={task.tags} onChange={inputChanged}></input>
                {/* <label htmlFor='start'>Start time:<span className='asterisk'>*</span> </label>
                <input id='start' type='text'  placeholder='hh:mm' name='start' value={task.start} onChange={inputChanged}></input>
                <label htmlFor='end'>End time:<span className='asterisk'>*</span> </label>
                <input id='end' type='text' placeholder='hh:mm' name='end' value={task.end} onChange={inputChanged}></input> */}
                <input id='submit_btn' type='submit' value='Add' /><span className='asterisk' style={{float:'right'}}>* <span style={{color:'black', float:'right'}}> - mandatory fields</span></span>
            </form>
        </div>
    );
}

export default Form;