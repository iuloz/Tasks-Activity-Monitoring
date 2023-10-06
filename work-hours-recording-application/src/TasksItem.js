import { useState } from 'react';

function TasksItem({ date, task, tag, start, end, hours }) {
    const [isActive, setIsActive] = useState(true);
    const [status, setStatus] = useState('Inactive');

    const [color, setColor] = useState('#ffd5bb');

    const [taskName, setTaskName] = useState(task);
    const [taskEditing, setTaskEditing] = useState(false);

    const [remove, setRemove] = useState(false);

    const [addingTag, setAddingTag] = useState(false);
    const [tags, setTags] = useState([]);
    const [newTag, setNewTag] = useState('');
    const [editTagIndex, setEditTagIndex] = useState(null);

    const changeStatus = () => {
        setStatus(isActive ? 'Active' : 'Inactive');
        setColor(isActive ? 'lightgreen' : '#ffd5bb');
        setIsActive(!isActive);
    }

    const addTag = () => {
        if (newTag.trim() !== '') {
            setTags([...tags, newTag]);
            setNewTag('');
        }
        setAddingTag(false);
        setEditTagIndex(null);
    }

    const handleTagEdit = (index, editedTag) => {
        const updatedTags = [...tags];
        updatedTags[index] = editedTag;
        setTags(updatedTags);
    }



    return remove ? null : (
        <div className='task-item' style={{ backgroundColor: color }}>
            <p style={{ display: 'inline' }}>{date}</p><span onClick={changeStatus} className='status'>{status}</span>

            {taskEditing ? (
                <input
                    className='component-input'
                    type='text'
                    value={taskName}
                    onChange={e => setTaskName(e.target.value)}
                    onBlur={e => {setTaskName(e.target.value); setTaskEditing(false)}}
                    autoFocus
                />
            ) : (
                <p className='task' onClick={() => setTaskEditing(true)}>{taskName}</p>
            )}

            <div>
                {tags.map((tag, index) => (
                    <p key={index}>
                        {editTagIndex === index ? (
                                <input
                                    className='component-input'
                                    type="text"
                                    value={tags[index]}
                                    onChange={e => handleTagEdit(index, e.target.value)}
                                    onBlur={addTag}
                                    autoFocus
                                />
                        ) : (
                            <span onClick={() => setEditTagIndex(index)}>{tag}</span>
                        )}
                    </p>
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
                    <span onClick={()=>setAddingTag(true)} style={{color:'green', fontSize:'0.7rem'}}>➕</span>
                )}
            </div>

            <p>Starts: {start}</p>
            <p>Ends: {end}</p>
            <p>Hours: {hours}<span id='delete_task' onClick={() => setRemove(true)}>⤬</span></p>
        </div>
    );
}


export default TasksItem;