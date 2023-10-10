import { useState, useEffect } from 'react';
import TasksItem from './TasksItem';

// This is recordings list view, made during whole time
function AllRecordings() {
    const [recordingsList, setRecordingList] = useState([]);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [uniqueTags, setUniqueTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [filterActive, setFilterActive] = useState(false);

    // Fetching all recordings from db.json
    useEffect(() => {
        fetch('http://127.0.0.1:3010/records')
            .then(response => response.json())
            .then(data => setRecordingList(data))
            .catch(error => console.error('Error fetching data:', error));
    }, [showFilterDropdown]);

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



    return (
        <div>
            <button className='filtering' onClick={() => setShowFilterDropdown(!showFilterDropdown)}>Filter by Tags &#9660;</button>
            {showFilterDropdown && (
                <div className='filter-dropdown'>
                    {uniqueTags.map(tag => (
                        <label key={tag}>
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
            }}>Reset Filter</button><br/>

            {filterActive ? (
                recordingsList.map((item, index) => (
                    selectedTags.every(tag => item.tags.some(itemTag => itemTag.toLowerCase() === tag.toLowerCase())) && (
                        <TasksItem
                            key={index}
                            id={item.id}
                            date={item.date}
                            status={item.status}
                            task={item.task}
                            tags={item.tags}
                            start={item.start}
                            end={item.end}
                            hours={item.hours}
                            existingTags={uniqueTags}
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
                        start={item.start}
                        end={item.end}
                        hours={item.hours}
                        existingTags={uniqueTags}
                    />
                ))
            )
            }

        </div>
    );
}


export default AllRecordings;