import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';

export default function CourseDetails() {
    // useLocation() is used to access the state (course data) passed from GradeSearch.jsx
    const location = useLocation();

    // useNavigate() allows us to programmatically navigate to the previous page
    const navigate = useNavigate();

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
                    <p><strong>Instructor:</strong> {course.instructor || "TBD"}</p>
                    <p><strong>Credits:</strong> {course.credits || "TBD"}</p>
                    <p><strong>Semester:</strong> {course.semester || "TBD"}</p>

                    {/* Course Description - Displays provided description or a placeholder if missing */}
                    <p>{course.description || "No description available."}</p>

                    {/* Back Button - Navigates back to the previous page when clicked */}
                    <Button variant="dark" onClick={() => navigate(-1)}>Back to Search</Button>
                </Card.Body>
            </Card>
        </Container>
    );
}
