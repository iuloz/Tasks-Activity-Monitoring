import { useState } from 'react';

function TasksItem( props ) {
    const [isActive, setIsActive] = useState(props.status === 'Active' ? false : true);
    const [status, setStatus] = useState(props.status);
    const [color, setColor] = useState(props.status === 'Active' ? 'lightgreen' : '#ffd5bb');
    const [task, setTask] = useState(props.task);
    const [taskEditing, setTaskEditing] = useState(false);
    const [remove, setRemove] = useState(false);
    const [addingTag, setAddingTag] = useState(false);
    const [tags, setTags] = useState([props.tag]);
    const [newTag, setNewTag] = useState('');
    const [editTagIndex, setEditTagIndex] = useState(null);

    const addToApi = async (key, value) => {
        const requestBody = { [key]: value };
        await fetch(`http://127.0.0.1:3010/records/${props.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(`${key} changed to "${value}"`);
            });
    }

    const changeStatus = () => {
        setStatus(isActive ? 'Active' : 'Inactive');
        setColor(isActive ? 'lightgreen' : '#ffd5bb');
        setIsActive(!isActive);
        addToApi('status', isActive ? 'Active' : 'Inactive');
    }

    const editTask = e => {
        if (e.target.value.trim() !== '') {
            setTask(e.target.value);
            setTaskEditing(false);
            addToApi('task', task);
        }
    }

    const handleTagEdit = async (index, editedTag) => {
        const updatedTags = [...tags];
        updatedTags[index] = editedTag;
        setTags(updatedTags);
    }

    const addTag = async (index, editedTag) => {
        if (newTag.trim() !== '') {
            setTags([...tags, newTag]);
            setNewTag('');
            addToApi('tags', [...tags, newTag]);
        } else {
            if (editedTag.trim() !== '') {
                const updatedTags = [...tags];
                updatedTags[index] = editedTag;
                setTags(updatedTags);
                addToApi('tags', [...tags]);
                setEditTagIndex(null);
            }
        }
        setAddingTag(false);
    }

    const deleteTag = index => {
        if (tags.length > 1) {
            let updatedTags = [...tags];
            updatedTags.splice(index, 1);
            setTags(updatedTags);
            addToApi('tags', updatedTags);
        }
    }

    const removeComponent = async () => {
        setRemove(true);
        await fetch(`http://127.0.0.1:3010/records/${props.id}`, {
            method: 'DELETE'
        })
            .then(resp => resp.json())
            .then(() => console.log('Deleted succesfully'));
    }



    return remove ? null : (
        <div className='task-item' style={{ backgroundColor: color }}>
            <p style={{ display: 'inline', fontSize: '0.7rem' }}>{props.date}</p><span onClick={changeStatus} className='status'>{status}</span>

            {taskEditing ? (
                <input
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
            {tags.map((tag, index) => (
                <div key={index}>
                    {editTagIndex === index ? (
                        <input
                            className='component-input'
                            type="text"
                            value={tags[index]}
                            onChange={e => handleTagEdit(index, e.target.value)}
                            onBlur={e => addTag(index, e.target.value)}
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
                <input
                    className='component-input'
                    type="text"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onBlur={addTag}
                    autoFocus
                />
            ) : (
                <span className='tag-span' onClick={() => setAddingTag(true)} style={{ color: 'green', fontSize: '1.2rem', cursor: 'pointer' }}> +</span>
            )}
            <p>Starts: {props.start}</p>
            <p>Ends: {props.end}</p>
            <p>Hours: {props.hours}<span id='delete_task' onClick={removeComponent}>⤬</span></p>
        </div>
    );
}


export default TasksItem;