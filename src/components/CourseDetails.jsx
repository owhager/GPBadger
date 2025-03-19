import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import {getRateMyProfData, RateMyProf} from '../RateMyProf'

export default function CourseDetails() {
    // useLocation() is used to access the state (course data) passed from GradeSearch.jsx
    const location = useLocation();

    // useNavigate() allows us to programmatically navigate to the previous page
    const navigate = useNavigate();
    
    const [courseGrades, setCourseGrades] = useState([]); // Stores course grade information
    const [courseGPA, setCourseGPA] = useState("Loading..."); // Stores average course GPA
    const [courseInstructor, setCourseInstructor] = useState("Loading...");
    const [rateInstructor, setRateInstructor] = useState(null); // Stores RateMyProf information if there is any
    const [displayRate, setDisplayRate] = useState(<p></p>); // Stores the ratings to display if there is RateMyProf information

    /*
     * Extract course data from the location state.
     * If no data is found (e.g., if the page is accessed directly via URL),
     * we set default placeholder values to avoid errors.
     */
    const course = location.state?.course || {
        name: "Unknown Course", // Default course name if not provided
        code: "N/A", // Default course code if not provided
        instructor: "TBD", // Default placeholder for missing instructor information
        credits: "TBD", // Default placeholder for missing credit hours
        semester: "TBD", // Default placeholder for missing semester info
        description: "No description available.", // Default placeholder for missing description
    };

    useEffect(() => {
    // MadGrades API calling fetching course grade information
    fetch(`https://api.madgrades.com/v1/courses/${course.uuid}/grades`, {
        headers: {
          "Authorization": "Token token=052ae8133724409ba61902593bee5db6"
        }
      })
        .then((res) => res.json())
        .then(data => {
          setCourseGrades(data);
          setCourseInstructor(data.courseOfferings[0].sections[0].instructors[0].name);

          // Calculate Average GPA after fetching grade data if available
          if (Number(data.cumulative.total) != 0) {
          let totalCount = (Number(data.cumulative.aCount * 4.00)) + (Number(data.cumulative.abCount * 3.50)) + Number((data.cumulative.bCount * 3.00)) + (Number(data.cumulative.bcCount * 2.50)) + (Number(data.cumulative.cCount * 2.00)) + (Number(data.cumulative.dCount * 1.00)) + (Number(data.cumulative.fCount * 0.00));
          setCourseGPA((totalCount / Number(data.cumulative.total)).toFixed(2));
          } else {
            setCourseGPA("No GPA Available")
          }

          // RateMyProf request getting Instructor data if available
          let instructorName = data.courseOfferings[0].sections[0].instructors[0].name.split(" ");
          getRateMyProfData(instructorName[0], instructorName[1])
          .then((res) => {
            if (res != null) {
            setRateInstructor(res);
            setDisplayRate(<div><p><strong>Instructor Difficulty:</strong> {res.avgDifficulty + "/5"|| "TBD"}</p>
                <p><strong>Instructor Rating:</strong> {res.avgRating  + "/5"|| "TBD"}</p>
                <p><strong>Would Take Instructor Again Percentage:</strong> {res.wouldTakeAgainPercent.toFixed(2) + "%" || "TBD"}</p></div>);
            } else {
                setDisplayRate(<p>No Instuctor Ratings are Avaible</p>);
            }
        });
          
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);

    return (
        <Container className="py-5">
            {/* Bootstrap container to provide consistent padding and layout */}
            <Card className="shadow-sm border-0 p-4">
                {/* Card component for displaying course details with subtle shadow and padding */}
                <Card.Body>
                    {/* Course Name - Displayed as a bold heading */}
                    <h2 className="fw-bold">{course.name}</h2>

                    {/* Course Code - Uses optional chaining to safely access subject information */}
                    <h5 className="text-muted">
                        Course Code: {course.subjects?.[0]?.abbreviation + " " + course.subjects?.[0]?.code || "N/A"}
                    </h5>
                    {/* Display Instructor, Credits, and Semester information with placeholders for missing values */}
                    <p><strong>Average GPA:</strong> {courseGPA || "TBD"}</p>
                    <p><strong>Instructor:</strong> {courseInstructor || "TBD"}</p>
                    {displayRate}
                    {/* Back Button - Navigates back to the previous page when clicked */}
                    <Button variant="dark" onClick={() => navigate(-1)}>Back to Search</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}
