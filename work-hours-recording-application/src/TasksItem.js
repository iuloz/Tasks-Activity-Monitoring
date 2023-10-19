import { useState, useRef, useEffect } from 'react';


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
    const [timer, setTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [timeTotal, setTimeTotal] = useState(props.timeTotal);
    // const [allTasks, setAllTasks] = useState([]);


    // useEffect(() => {
    //     fetch('/records')
    //         .then(response => response.json())
    //         .then(data => setAllTasks(data))
    //         .catch(error => console.error('Error fetching data:', error));
    // }, []);


    useEffect(() => {
        const [hours, minutes, seconds] = timeTotal.split(':').map(Number);
        setTimer({ hours, minutes, seconds });
        const interval = setInterval(() => {
            if (status === 'Active') {
                setTimer(prevTime => {
                    const newSeconds = prevTime.seconds + 1;
                    const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
                    const newHours = prevTime.hours + Math.floor(newMinutes / 60);
                    return {
                        hours: newHours,
                        minutes: newMinutes % 60,
                        seconds: newSeconds % 60,
                    };
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [status, timeTotal]);



    const addToApi = async (key, value) => {
        const requestBody = { [key]: value };
        await fetch(`/records/${props.id}`, {
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

        let mode = null;
        await fetch('/settings')
            .then(response => response.json())
            .then(data => {
                mode = data.mode;
            })
            .catch(error => console.error('Error fetching data:', error));
        console.log(mode);
        if (mode === 'one' && isActive) {
            props.recordingsList.forEach(async item => {
                await new Promise(resolve => setTimeout(resolve, 200));
                if (item.id !== props.id && item.status === 'Active') {
                    await fetch(`/records/${item.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Inactive' })
                    })
                        .then(resp => resp.json())
                        .catch(error => {
                            console.error('Error:', error);
                        });
                }
            });
        }

        setIsActive(!isActive);
        setStatus(isActive ? 'Active' : 'Inactive');
        setColor(isActive ? 'lightgreen' : '#ffd5bb');
        await new Promise(resolve => setTimeout(resolve, 200));
        await addToApi('status', isActive ? 'Active' : 'Inactive');
        const dateTime = (new Date()).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
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
            let newTimeTotal = new Date();
            newTimeTotal.setHours(hours + prevHours, minutes + prevMinutes, seconds + prevSeconds);
            newTimeTotal = newTimeTotal.toTimeString().slice(0, 8);
            setTimeTotal(newTimeTotal);
            await new Promise(resolve => setTimeout(resolve, 200));
            await addToApi('timeTotal', newTimeTotal);
        }

        props.setItemStatus(!props.itemStatus);

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
        await fetch(`/records/${props.id}`, {
            method: 'DELETE'
        })
            .then(resp => resp.json())
            .then(() => console.log('Deleted succesfully'));
        props.uniqueTagsUpdate();
    }


    const onDragStart = (e) => {
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





    return remove ? null : (
        <div
            className='task-item'
            style={{ backgroundColor: color }}
            draggable='true'
            onDragStart={onDragStart}
            ref={dragElementRef}
            id={props.id}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            <p style={{ display: 'inline', fontSize: '0.7rem' }}>Created: {props.date}</p><span onClick={changeStatus} className='status'>{status}</span>

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
                />
            ) : (
                <p className='task' onClick={() => setTaskEditing(true)}>{task}</p>
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
                        />
                    ) : (
                        <p>
                            <span className='tag-span' onClick={() => setEditTagIndex(index)}>{tag} </span>
                            <span className='tag-delete' onClick={() => deleteTag(index)}> ⤬</span>
                        </p>
                    )}
                </div>
            ))}

            {addingTag ? (
                <div>
                    <input
                        name='addTag'
                        autoComplete='off'
                        className='component-input'
                        type='text'
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onBlur={addTag}
                        autoFocus
                        list='existingTags'
                    />
                    <datalist id='existingTags'>
                        {props.existingTags.map(tag => (
                            <option key={tag} value={tag} />
                        ))}
                    </datalist>
                </div>
            ) : (
                <span className='tag-span' onClick={() => setAddingTag(true)} style={{ color: 'green', fontSize: '1.2rem', cursor: 'pointer' }}> +</span>
            )}
            <p>Total active: {String(timer.hours).padStart(2, '0')}:{String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
                <span id='delete_task' onClick={removeComponent}>⤬</span>
            </p>
        </div>
    );
}


export default TasksItem;