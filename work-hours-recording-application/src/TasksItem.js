import { useState, useRef } from 'react';


function TasksItem(props) {
    const [isActive, setIsActive] = useState(props.status === 'Active' ? false : true);
    const [status, setStatus] = useState(props.status);
    const [color, setColor] = useState(props.status === 'Active' ? 'lightgreen' : '#ffd5bb');
    const [task, setTask] = useState(props.task);
    const [taskEditing, setTaskEditing] = useState(false);
    const [remove, setRemove] = useState(false);
    const [addingTag, setAddingTag] = useState(false);
    const [tags, setTags] = useState(props.tags);
    const [newTag, setNewTag] = useState('');
    const [editTagIndex, setEditTagIndex] = useState(null);
    const [startTimes, setStartTimes] = useState(props.startTimes);
    const [endTimes, setEndTimes] = useState(props.endTimes);
    const dragElementRef = useRef(null);
    const [timeTotal, setTimeTotal] = useState(props.timeTotal);
    const buttonRef1 = useRef();
    const buttonRef2 = useRef();
    const buttonRef3 = useRef();
    const buttonRef4 = useRef();
    const buttonRef5 = useRef();
    const buttonRef6 = useRef();
    const tagRefs = useRef([]);
    const tagDeleteRefs = useRef([]);
    const tagEditInputRefs = useRef([]);



    const addToApi = async (key, value) => {
        const requestBody = { [key]: value };
        await fetch(`http://localhost:3010/records/${props.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(`${key} changed to '${value}'`);
            });
    }


    const changeStatus = async () => {
        const dateTime = (new Date()).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });

        let mode = null;
        await fetch('http://localhost:3010/settings')
            .then(response => response.json())
            .then(data => {
                mode = data.mode;
            })
            .catch(error => console.error('Error fetching data:', error));
        if (mode === 'one' && isActive) {
            props.recordingsList.forEach(async item => {
                await new Promise(resolve => setTimeout(resolve, 200));
                if (item.id !== props.id && item.status === 'Active') {
                    const lastStartTime = new Date(item.start[item.start.length - 1].replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    const lastEndTime = new Date(dateTime.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                    const differenceInSeconds = Math.floor((lastEndTime - lastStartTime) / 1000);
                    const hours = Math.floor(differenceInSeconds / 3600);
                    const minutes = Math.floor((differenceInSeconds % 3600) / 60);
                    const seconds = differenceInSeconds % 60;
                    const [prevHours, prevMinutes, prevSeconds] = item.timeTotal.split(':').map(Number);
                    const newTimeTotal = `${hours + prevHours}:${minutes + prevMinutes}:${seconds + prevSeconds}`;
                    const components = newTimeTotal.split(':');
                    let formattedTime = components.map(component => component.padStart(2, '0'));
                    formattedTime = formattedTime.join(':');
                    await fetch(`http://localhost:3010/records/${item.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Inactive', end: [...item.end, dateTime], timeTotal: formattedTime })
                    })
                        .then(resp => resp.json())
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            });
            setIsActive(!isActive);
            setStatus(isActive ? 'Active' : 'Inactive');
            setColor(isActive ? 'lightgreen' : '#ffd5bb');
            await new Promise(resolve => setTimeout(resolve, 200));
            await addToApi('status', isActive ? 'Active' : 'Inactive');
            let updatedStartTimes = startTimes;
            let updatedEndTimes = endTimes;

            if (isActive) {
                updatedStartTimes = [...updatedStartTimes, dateTime];
                setStartTimes(updatedStartTimes);
                await new Promise(resolve => setTimeout(resolve, 200));
                await addToApi('start', updatedStartTimes);
            } else {
                updatedEndTimes = [...updatedEndTimes, dateTime];
                setEndTimes(updatedEndTimes);
                await new Promise(resolve => setTimeout(resolve, 200));
                await addToApi('end', updatedEndTimes);
            }

            if (updatedStartTimes.length === updatedEndTimes.length && updatedStartTimes.length > 0) {
                const dateStartString = updatedStartTimes[updatedStartTimes.length - 1];
                const dateEndString = updatedEndTimes[updatedEndTimes.length - 1];
                const dateStart = new Date(dateStartString.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                const dateEnd = new Date(dateEndString.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                const differenceInMilliseconds = dateEnd - dateStart;
                const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
                const hours = Math.floor(differenceInSeconds / 3600);
                const minutes = Math.floor((differenceInSeconds % 3600) / 60);
                const seconds = differenceInSeconds % 60;
                const [prevHours, prevMinutes, prevSeconds] = timeTotal.split(':').map(Number);
                const newTimeTotal = `${hours + prevHours}:${minutes + prevMinutes}:${seconds + prevSeconds}`;
                const components = newTimeTotal.split(':');
                let formattedTime = components.map(component => component.padStart(2, '0'));
                formattedTime = formattedTime.join(':');
                setTimeTotal(formattedTime);
                await new Promise(resolve => setTimeout(resolve, 200));
                await addToApi('timeTotal', formattedTime);
            }

            fetch('http://localhost:3010/records')
                .then(response => response.json())
                .then(data => props.setNewTaskList(data))
                .catch(error => console.error('Error fetching data:', error));
            props.setItemStatus(false);

        } else {

            setIsActive(!isActive);
            setStatus(isActive ? 'Active' : 'Inactive');
            setColor(isActive ? 'lightgreen' : '#ffd5bb');
            await new Promise(resolve => setTimeout(resolve, 200));
            await addToApi('status', isActive ? 'Active' : 'Inactive');
            let updatedStartTimes = startTimes;
            let updatedEndTimes = endTimes;
            if (isActive) {
                updatedStartTimes = [...updatedStartTimes, dateTime];
                setStartTimes(updatedStartTimes);
                await new Promise(resolve => setTimeout(resolve, 200));
                await addToApi('start', updatedStartTimes);
            } else {
                updatedEndTimes = [...updatedEndTimes, dateTime];
                setEndTimes(updatedEndTimes);
                await new Promise(resolve => setTimeout(resolve, 200));
                await addToApi('end', updatedEndTimes);
            }

            if (updatedStartTimes.length === updatedEndTimes.length && updatedStartTimes.length > 0) {
                const dateStartString = updatedStartTimes[updatedStartTimes.length - 1];
                const dateEndString = updatedEndTimes[updatedEndTimes.length - 1];
                const dateStart = new Date(dateStartString.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                const dateEnd = new Date(dateEndString.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
                const differenceInMilliseconds = dateEnd - dateStart;
                const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
                const hours = Math.floor(differenceInSeconds / 3600);
                const minutes = Math.floor((differenceInSeconds % 3600) / 60);
                const seconds = differenceInSeconds % 60;
                const [prevHours, prevMinutes, prevSeconds] = timeTotal.split(':').map(Number);
                const newTimeTotal = `${hours + prevHours}:${minutes + prevMinutes}:${seconds + prevSeconds}`;
                const components = newTimeTotal.split(':');
                let formattedTime = components.map(component => component.padStart(2, '0'));
                formattedTime = formattedTime.join(':');
                setTimeTotal(formattedTime);
                await new Promise(resolve => setTimeout(resolve, 200));
                await addToApi('timeTotal', formattedTime);
            }
        }
    }


    const editTask = e => {
        if (e.target.value.trim() !== '') {
            setTask(e.target.value);
            setTaskEditing(false);
            addToApi('task', task);
        }
    }

    const addTag = () => {
        if (newTag.trim() !== '') {
            setTags([...tags, newTag]);
            setNewTag('');
            addToApi('tags', [...tags, newTag]);
            props.uniqueTagsUpdate();
        }
        setAddingTag(false);
    }

    const handleTagEdit = (index, editedTag) => {
        const updatedTags = [...tags];
        updatedTags[index] = editedTag;
        setTags(updatedTags);
    }

    const editTag = (index, editedTag) => {
        if (editedTag.trim() !== '') {
            const updatedTags = [...tags];
            updatedTags[index] = editedTag;
            setTags(updatedTags);
            addToApi('tags', [...tags]);
            setEditTagIndex(null);
            props.uniqueTagsUpdate();
        }
    }

    const deleteTag = index => {
        if (tags.length > 1) {
            let updatedTags = [...tags];
            updatedTags.splice(index, 1);
            setTags(updatedTags);
            addToApi('tags', updatedTags);
            props.uniqueTagsUpdate();
        }
    }

    const removeComponent = async () => {
        setRemove(true);
        await fetch(`http://localhost:3010/records/${props.id}`, {
            method: 'DELETE'
        })
            .then(resp => resp.json())
            .then(() => console.log('Deleted succesfully'));
        // props.uniqueTagsUpdate();
    }


    const onDragStartHandler = (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
    }

    const onDragOver = (e) => {
        e.preventDefault();
    }

    const onDrop = (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(data);

        const dropTarget = e.target.closest('.task-item');
        if (dropTarget) {
            const rect = dropTarget.getBoundingClientRect();
            const mouseX = e.clientX;
            const targetX = rect.left + rect.width / 2;

            if (mouseX < targetX) {
                dropTarget.parentNode.insertBefore(draggedElement, dropTarget);
            } else {
                dropTarget.parentNode.insertBefore(draggedElement, dropTarget.nextElementSibling);
            }
        }
    }

    const handleKeyDown = (e, buttonRef) => {
        if (buttonRef.current && (e.key === ' ' || e.key === 'Spacebar')) {
            e.preventDefault();
            buttonRef.current.click();
        }
    };

    const handleKeyDownEnter = (e, buttonRef) => {
        if (buttonRef.current && (e.key === 'Enter')) {
            e.preventDefault();
            buttonRef.current.blur();
        }
    };

    const handleKeyDownTags = (e, index, refs) => {
        if (refs.current[index] && (e.key === ' ' || e.key === 'Spacebar')) {
            e.preventDefault();
            refs.current[index].click();
        }
    };

    const handleKeyDownTagsEdit = (e, index, refs) => {
        if (refs.current[index] && (e.key === 'Enter')) {
            e.preventDefault();
            refs.current[index].blur();
        }
    };




    return remove ? null : (
        <div
            className='task-item'
            style={{ backgroundColor: color }}
            draggable='true'
            onDragStart={onDragStartHandler}
            ref={dragElementRef}
            id={props.id}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <p style={{ display: 'inline', fontSize: '0.7rem' }}>Created: {props.date}</p>
            <span tabIndex={0} ref={buttonRef1} onKeyDown={e => handleKeyDown(e, buttonRef1)} id='delete_task' onClick={removeComponent}>⤬</span>


            {taskEditing ? (
                <input
                    name='editTask'
                    autoComplete='off'
                    className='component-input'
                    type='text'
                    value={task}
                    onChange={e => setTask(e.target.value)}
                    onBlur={editTask}
                    autoFocus
                    ref={buttonRef5}
                    onKeyDown={e => handleKeyDownEnter(e, buttonRef5)}
                />
            ) : (
                <p tabIndex={0} ref={buttonRef2} onKeyDown={e => handleKeyDown(e, buttonRef2)} className='task' onClick={() => setTaskEditing(true)}>{task}</p>
            )}

            <p style={{ textDecoration: 'underline' }}>Tags: </p>
            {Array.isArray(tags) && tags.map((tag, index) => (
                <div key={index}>
                    {editTagIndex === index ? (
                        <input
                            name='editTag'
                            autoComplete='off'
                            className='component-input'
                            type='text'
                            value={tags[index]}
                            onChange={e => handleTagEdit(index, e.target.value)}
                            onBlur={e => editTag(index, e.target.value)}
                            autoFocus
                            ref={ref => tagEditInputRefs.current[index] = ref}
                            id={index}
                            onKeyDown={e => handleKeyDownTagsEdit(e, index, tagEditInputRefs)}
                        />
                    ) : (
                        <p>
                            <span
                                tabIndex={0}
                                className='tag-span'
                                onClick={() => setEditTagIndex(index)}
                                ref={ref => tagRefs.current[index] = ref}
                                id={index}
                                onKeyDown={e => handleKeyDownTags(e, index, tagRefs)}
                            >{tag}</span>
                            <span
                                tabIndex={0}
                                className='tag-delete'
                                onClick={() => deleteTag(index)}
                                ref={ref => tagDeleteRefs.current[index] = ref}
                                id={index}
                                onKeyDown={e => handleKeyDownTags(e, index, tagDeleteRefs)}
                            >⤬</span>
                        </p>
                    )}
                </div>
            ))}

            {addingTag ? (
                <div>
                    <input
                        placeholder='Click or arrow down key to see all tags'
                        name='addTag'
                        autoComplete='off'
                        className='component-input'
                        type='text'
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onBlur={addTag}
                        autoFocus
                        list='existingTags'
                        ref={buttonRef6}
                        onKeyDown={e => handleKeyDownEnter(e, buttonRef6)}
                    />
                    <datalist id='existingTags'>
                        {props.existingTags.map(tag => (
                            <option key={tag} value={tag} />
                        ))}
                    </datalist>
                </div>
            ) : (
                <span
                    tabIndex={0}
                    ref={buttonRef3}
                    onKeyDown={e => handleKeyDown(e, buttonRef3)}
                    className='tag-span'
                    onClick={() => setAddingTag(true)}
                    style={{ color: 'green', fontSize: '1.2rem', cursor: 'pointer' }}
                >+</span>
            )}
            <p>Total active when last paused: {timeTotal}</p>
            <p tabIndex={0} ref={buttonRef4} onKeyDown={e => handleKeyDown(e, buttonRef4)} onClick={changeStatus} className='status'>{status}</p>
        </div>
    );
}


export default TasksItem;