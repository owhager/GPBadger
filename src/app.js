import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import GradeSearch from './components/GradeSearch';
import CourseDetails from './components/CourseDetails';
import UserPage from './userpage';

export default function App() {
    const [courseList, setCourseList] = useState([]);

    // Fetch courses from MadGrades API when component mounts
    useEffect(() => {
        fetch("https://api.madgrades.com/v1/courses", {
            headers: {
                "Authorization": "Token token=052ae8133724409ba61902593bee5db6"
            }
        })
        .then((res) => res.json())
        .then(data => {
            setCourseList(data.results);
        })
        .catch(error => console.error("Error fetching courses:", error));
    }, []);

    return (
        <Routes>
            {/* Homepage with course search and list */}
            <Route path="/" element={<GradeSearch courseList={courseList} />} />

            {/* Course details page */}
            <Route path="/course/:courseId" element={<CourseDetails />} />
        </Routes>
    );
    return (
    <div className="App">
      <UserPage />
    </div>
  );

}

