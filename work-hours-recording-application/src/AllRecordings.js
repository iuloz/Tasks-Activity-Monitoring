import { useState, useEffect } from 'react';
import TasksItem from './TasksItem';



// This is recordings list view, made during whole time
function AllRecordings() {
    const [recordingsList, setRecordingList] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [filterActive, setFilterActive] = useState(false);
    const [updateTags, setUpdateTags] = useState(false);
    // const [itemStatus, setItemStatus] = useState(false);
    const [render, setRender] = useState(false);





    useEffect(() => {
        const timer = setTimeout(() => {
            setRender(true);
        }, 200); // Render after 2 seconds

        return () => clearTimeout(timer); // Clean up the timer on component unmount
    }, [render]);


    // Fetching all recordings from db.json
    useEffect(() => {
        fetch('/records')
            .then(response => response.json())
            .then(data => setRecordingList(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [showFilterDropdown, updateTags]);

    // Setting array of unique tags
    useEffect(() => {
        const tagsSet = new Set();
        recordingsList.forEach(item => {
            item.tags.forEach(tag => tagsSet.add(tag));
        });
        setUniqueTags(Array.from(tagsSet));
    }, [recordingsList]);


    const toggleTag = (tag) => {
        setSelectedTags(prevTags => (
            prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]));
    }

    const applyFilter = () => {
        setFilterActive(true);
        setShowFilterDropdown(false);
    }

    const newTagsFromTaskItem = () => {
        setUpdateTags(!updateTags);
    }

    const setItemStatus = (stat) => {
        setRender(stat);
    }

    const setNewTaskList = (list) => {
        setRecordingList(list);
    }



    return !render ? null : (
        <div>
            <button className='filtering' onClick={() => setShowFilterDropdown(!showFilterDropdown)}>Filter by Tags &#9660;</button>
            {showFilterDropdown && (
                <div className='filter-dropdown'>
                    {uniqueTags.map(tag => (
                        <label id='filter_tag' key={tag}>
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
            }}>Reset Filter</button><br />

            {filterActive ? (
                recordingsList.map((item, index) => (
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
                            hours={item.hours}
                            existingTags={uniqueTags}
                            uniqueTagsUpdate={newTagsFromTaskItem}
                            timeTotal={item.timeTotal}
                            setItemStatus={setItemStatus}
                            recordingsList={recordingsList}
                            setNewTaskList={setNewTaskList}
                        />
                    )
                ))
            ) : (
                recordingsList.map((item, index) => (
                    <TasksItem
                        key={index}
                        id={item.id}
                        date={item.date}
                        status={item.status}
                        task={item.task}
                        tags={item.tags}
                        startTimes={item.start}
                        endTimes={item.end}
                        hours={item.hours}
                        existingTags={uniqueTags}
                        uniqueTagsUpdate={newTagsFromTaskItem}
                        timeTotal={item.timeTotal}
                        setItemStatus={setItemStatus}
                        recordingsList={recordingsList}
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