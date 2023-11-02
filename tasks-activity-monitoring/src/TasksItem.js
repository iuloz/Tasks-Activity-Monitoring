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
        await fetch(`http://localhost:3010/tasks/${props.id}`, {
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
            props.allTaskObjects.forEach(async item => {
                if (item.id !== props.id && item.status === 'Active') {
                    await fetch(`http://localhost:3010/tasks/${item.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Inactive', end: [...item.end, dateTime] })
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
            await addToApi('status', isActive ? 'Active' : 'Inactive');
            let updatedStartTimes = startTimes;
            let updatedEndTimes = endTimes;

            if (isActive) {
                updatedStartTimes = [...updatedStartTimes, dateTime];
                setStartTimes(updatedStartTimes);
                await addToApi('start', updatedStartTimes);
                await new Promise(resolve => setTimeout(resolve, 200));
            } else {
                updatedEndTimes = [...updatedEndTimes, dateTime];
                setEndTimes(updatedEndTimes);
                await addToApi('end', updatedEndTimes);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            await fetch('http://localhost:3010/tasks')
                .then(response => response.json())
                .then(data => props.setNewTaskList(data))
                .catch(error => console.error('Error fetching data:', error));
            props.setItemStatus(false);

        } else {

            setIsActive(!isActive);
            setStatus(isActive ? 'Active' : 'Inactive');
            setColor(isActive ? 'lightgreen' : '#ffd5bb');
            await addToApi('status', isActive ? 'Active' : 'Inactive');
            await new Promise(resolve => setTimeout(resolve, 200));
            let updatedStartTimes = startTimes;
            let updatedEndTimes = endTimes;
            if (isActive) {
                updatedStartTimes = [...updatedStartTimes, dateTime];
                setStartTimes(updatedStartTimes);
                await addToApi('start', updatedStartTimes);
                await new Promise(resolve => setTimeout(resolve, 200));
            } else {
                updatedEndTimes = [...updatedEndTimes, dateTime];
                setEndTimes(updatedEndTimes);
                await addToApi('end', updatedEndTimes);
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
    }


    const editTask = async e => {
        if (e.target.value.trim() !== '') {
            setTask(e.target.value);
            setTaskEditing(false);
            await addToApi('task', task);
        }
    }

    const addTag = async () => {
        if (newTag.trim() !== '') {
            setTags([...tags, newTag]);
            setNewTag('');
            await addToApi('tags', [...tags, newTag]);
            props.uniqueTagsUpdate();
        }
        setAddingTag(false);
    }

    const handleTagEdit = (index, editedTag) => {
        const updatedTags = [...tags];
        updatedTags[index] = editedTag;
        setTags(updatedTags);
    }

    const editTag = async (index, editedTag) => {
        if (editedTag.trim() !== '') {
            const updatedTags = [...tags];
            updatedTags[index] = editedTag;
            setTags(updatedTags);
            await addToApi('tags', [...tags]);
            setEditTagIndex(null);
            props.uniqueTagsUpdate();
        }
    }

    const deleteTag = async index => {
        if (tags.length > 1) {
            let updatedTags = [...tags];
            updatedTags.splice(index, 1);
            setTags(updatedTags);
            await addToApi('tags', updatedTags);
            props.uniqueTagsUpdate();
        }
    }

    const removeComponent = async () => {
        setRemove(true);
        await fetch(`http://localhost:3010/tasks/${props.id}`, {
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
            <p tabIndex={0} ref={buttonRef4} onKeyDown={e => handleKeyDown(e, buttonRef4)} onClick={changeStatus} className='status'>{status}</p>
        </div>
    );
}


export default TasksItem;