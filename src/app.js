import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import GradeSearch from './components/GradeSearch';
import CourseDetails from './components/CourseDetails';
import UserPage from './userpage';
import ProfilePage from './components/ProfilePage'; 
import NavBar from './components/Nav'; 
import { useUser } from '../src/contexts/UserContext';

export default function App() {
  const [courseList, setCourseList] = useState([]);
  const { user } = useUser(); 

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
    <>
      <NavBar />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Login page */}
        <Route path="/login" element={<UserPage />} />
        <Route path="/main" element={<GradeSearch courseList={courseList} />} />
        {/* Course details page */}
        <Route path="/course/:courseId" element={<CourseDetails />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}
