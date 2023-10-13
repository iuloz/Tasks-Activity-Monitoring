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
    const [timeTotal, setTimeTotal] = useState(0);


    useEffect(() => {
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
    }, [status]);



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


    const changeStatus = () => {
        setStatus(isActive ? 'Active' : 'Inactive');
        setColor(isActive ? 'lightgreen' : '#ffd5bb');
        setIsActive(!isActive);
        addToApi('status', isActive ? 'Active' : 'Inactive');
        const dateTime = (new Date()).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
        isActive ? setStartTimes([...startTimes, dateTime]) : setEndTimes([...endTimes, dateTime]);
        addToApi(isActive ? 'start' : 'end', isActive ? [...startTimes, dateTime] : [...endTimes, dateTime]);


        // if (startTimes.length === endTimes.length && startTimes.length > 0) {
        //     const date1String = startTimes[startTimes.length - 1];
        //     const date2String = startTimes[startTimes.length - 1];
        //     const date1 = new Date(date1String.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
        //     const date2 = new Date(date2String.replace(/(\d{2}).(\d{2}).(\d{4}), (\d{2}):(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5:$6"));
        //     const differenceInMilliseconds = date2 - date1;
        //     const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        //     const hours = Math.floor(differenceInSeconds / 3600);
        //     const minutes = Math.floor((differenceInSeconds % 3600) / 60);
        //     const seconds = differenceInSeconds % 60;
        //     setTimeTotal(`${hours}:${minutes}:${seconds}`);
        //     console.log(timeTotal);
        //     // console.log(`Difference: ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        // }


        // if (startTimes.length === endTimes.length && startTimes.length > 0) {
        //     const dateStartString = startTimes[startTimes.length - 1];
        //     const dateEndString = endTimes[endTimes.length - 1];
        //     const dateStart = parseDate(dateStartString);
        //     const dateEnd = parseDate(dateEndString);
        //     const differenceInMilliseconds = dateEnd - dateStart;
        //     const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
        //     const hours = Math.floor(differenceInSeconds / 3600);
        //     const minutes = Math.floor((differenceInSeconds % 3600) / 60);
        //     const seconds = differenceInSeconds % 60;
        //     const formattedDifference = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        //     // setTimeTotal(formattedDifference);
        //     console.log(`Formatted difference: ${formattedDifference}`);
        // }
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
            <p style={{ display: 'inline', fontSize: '0.7rem' }}>{props.date}</p><span onClick={changeStatus} className='status'>{status}</span>

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
            {/* <p>Starts: {props.start}</p>
            <p>Ends: {props.end}</p> */}
            <p>Total active: {String(timer.hours).padStart(2, '0')}:{String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
                <span id='delete_task' onClick={removeComponent}>⤬</span>
            </p>
        </div>
    );
}


export default TasksItem;