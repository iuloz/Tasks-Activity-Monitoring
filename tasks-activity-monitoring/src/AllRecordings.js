import { useState, useEffect } from 'react';
import TasksItem from './TasksItem';
import { v4 as uuidv4 } from 'uuid';
import Form from './Form';




function AllRecordings() {
    const [allTaskObjects, setAllTaskObjects] = useState([]);
    const [color, setColor] = useState('whitesmoke');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [filterActive, setFilterActive] = useState(false);
    const [updateTags, setUpdateTags] = useState(false);
    const [render, setRender] = useState(false);
    const [taskList, setTaskList] = useState([]);
    const [task, setTask] = useState({ id: '', date: '', status: 'Inactive', task: '', tags: [], start: [], end: [] });


    // Fetching theme to set the color
    useEffect(() => {
        fetch('http://localhost:3010/settings')
            .then(response => response.json())
            .then(data => setColor(data.theme === 'light' ? 'black' : 'whitesmoke'))
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    // Artificial rerendering when in 'single active task' mode, so that status of previous task changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setRender(true);
        }, 200);
        return () => clearTimeout(timer);
    }, [render]);


    // Fetching all task objects from db.json
    useEffect(() => {
        fetch('http://localhost:3010/tasks')
            .then(response => response.json())
            .then(data => setAllTaskObjects(data))
            .catch(error => console.error('Error fetching data:', error));
        // setRender(prev => !prev);
    }, [showFilterDropdown, updateTags]);


    // Setting array of unique tags
    useEffect(() => {
        const tagsSet = new Set();
        allTaskObjects.forEach(item => {
            item.tags.forEach(tag => tagsSet.add(tag));
        });
        setUniqueTags(Array.from(tagsSet));
    }, [allTaskObjects]);


    // Ticking tag checkbox in filtering
    const toggleTag = (tag) => {
        setSelectedTags(prevTags => (
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]));
    }

    const applyFilter = () => {
        setFilterActive(true);
        setShowFilterDropdown(false);
    }

    // Updating unique tags list from TasksItem component triggering useEffect
    const newTagsFromTaskItem = () => {
        setUpdateTags(!updateTags);
    }

    // Rerendering from child component by triggering useEffect
    const setItemStatus = (stat) => {
        setRender(stat);
    }

    // Updating task objects list
    const setNewTaskList = (list) => {
        setAllTaskObjects(list);
    }

    // Updating db.json content
    const addTaskToApi = async () => {
        await fetch('http://localhost:3010/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
            });
    }

    // Adding new task component
    const recordTask = async (event) => {
        event.preventDefault();
        if (task.task === '' || task.tags.length < 1) {
            return;
        } else {
            setTaskList([...taskList, task]);
            await addTaskToApi();
            setUpdateTags(!updateTags);
        }

        // Setting empty fields for task and tag to make input fields empty after form submit
        setTask(prev => ({ ...prev, task: '', tags: [] }));
    }

    // Setting new task
    const inputChanged = (event) => {
        const date = (new Date()).toLocaleDateString('fi-FI', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
        let key = event.target.name;
        let value = event.target.value;
        setTask({ ...task, id: uuidv4(), date: date, [key]: (key === 'tags') ? [value] : value });
    }



    return !render ? null : (
        <div>
            <button className='filtering' onClick={() => setShowFilterDropdown(!showFilterDropdown)}>Filter by Tags ▶</button>
            {showFilterDropdown && (
                <div className='filter-dropdown'>
                    {uniqueTags.map(tag => (
                        <label id='filter_tag' key={tag} style={{ color: color }}>
                            <input
                                name='checkbox'
                                type='checkbox'
                                checked={selectedTags.includes(tag)}
                                onChange={() => toggleTag(tag)}
                            />
                            {tag}
                        </label>
                    ))}
                    <button className='filtering' onClick={applyFilter}>Apply</button>
                </div>
            )}
            <button className='filtering' onClick={() => {
                setSelectedTags([]);
                setFilterActive(false);
            }}>Reset Filter</button>

            <Form task={task} inputChanged={inputChanged} recordTask={recordTask} />

            {filterActive ? (
                allTaskObjects.map((item, index) => (
                    selectedTags.every(tag => item.tags.includes(tag)) && (
                        <TasksItem
                            key={index}
                            id={item.id}
                            date={item.date}
                            status={item.status}
                            task={item.task}
                            tags={item.tags}
                            startTimes={item.start}
                            endTimes={item.end}
                            existingTags={uniqueTags}
                            uniqueTagsUpdate={newTagsFromTaskItem}
                            setItemStatus={setItemStatus}
                            allTaskObjects={allTaskObjects}
                            setNewTaskList={setNewTaskList}
                        />
                    )
                ))
            ) : (
                allTaskObjects.map((item, index) => (
                    <TasksItem
                        key={index}
                        id={item.id}
                        date={item.date}
                        status={item.status}
                        task={item.task}
                        tags={item.tags}
                        startTimes={item.start}
                        endTimes={item.end}
                        existingTags={uniqueTags}
                        uniqueTagsUpdate={newTagsFromTaskItem}
                        setItemStatus={setItemStatus}
                        allTaskObjects={allTaskObjects}
                        setNewTaskList={setNewTaskList}
                    />
                )
                )
            )
            }
        </div>
    );

}


export default AllRecordings;