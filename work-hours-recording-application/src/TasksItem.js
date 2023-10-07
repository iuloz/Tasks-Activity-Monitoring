import { useState } from 'react';

function TasksItem({ id, date, task, tag, start, end, hours }) {
    const [isActive, setIsActive] = useState(true);
    const [status, setStatus] = useState('Inactive');

    const [color, setColor] = useState('#ffd5bb');

    const [taskName, setTaskName] = useState(task);
    const [taskEditing, setTaskEditing] = useState(false);

    const [remove, setRemove] = useState(false);

    const [addingTag, setAddingTag] = useState(false);
    const [tags, setTags] = useState([tag]);
    const [newTag, setNewTag] = useState('');
    const [editTagIndex, setEditTagIndex] = useState(null);

    const addToApi = async (key, value) => {
        const requestBody = { [key]: value };
        await fetch(`http://127.0.0.1:3010/records/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
            });
    }

    const changeStatus = () => {
        setStatus(isActive ? 'Active' : 'Inactive');
        setColor(isActive ? 'lightgreen' : '#ffd5bb');
        setIsActive(!isActive);
    }

    const editTask = (e) => {
        if (e.target.value.trim() !== '') {
            setTaskName(e.target.value);
            setTaskEditing(false);
            addToApi('task', taskName);
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
            await fetch(`http://127.0.0.1:3010/records/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tags: [...tags, newTag]
                })
            })
                .then(resp => resp.json())
                .then(data => {
                    console.log(data);
                });
        } else {
            if (editedTag.trim() !== '') {
                const updatedTags = [...tags];
                updatedTags[index] = editedTag;
                setTags(updatedTags);
                await fetch(`http://127.0.0.1:3010/records/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tags: [...tags]
                    })
                })
                    .then(resp => resp.json())
                    .then(data => {
                        console.log(data);
                    });
                setEditTagIndex(null);
            }
        }
        setAddingTag(false);
    }

    const deleteTag = (index) => {
        if (tags.length > 1) {
            let updatedTags = [...tags];
            updatedTags.splice(index, 1);
            setTags(updatedTags);
        }
    }

    const removeComponent = async () => {
        setRemove(true);
        await fetch(`http://127.0.0.1:3010/records/${id}`, {
            method: 'DELETE'
        })
            .then(resp => resp.json())
            .then(() => console.log('Deleted succesfully'));
    }



    return remove ? null : (
        <div className='task-item' style={{ backgroundColor: color }}>
            <p style={{ display: 'inline', fontSize: '0.7rem' }}>{date}</p><span onClick={changeStatus} className='status'>{status}</span>

            {taskEditing ? (
                <input
                    className='component-input'
                    type='text'
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                    onBlur={editTask}
                    autoFocus
                />
            ) : (
                <p className='task' onClick={() => setTaskEditing(true)}>{taskName}</p>
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
            <p>Starts: {start}</p>
            <p>Ends: {end}</p>
            <p>Hours: {hours}<span id='delete_task' onClick={removeComponent}>⤬</span></p>
        </div>
    );
}


export default TasksItem;