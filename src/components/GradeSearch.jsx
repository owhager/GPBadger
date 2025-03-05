import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';
import Nav from './Nav';

export default function GradeSearch() {
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("https://api.madgrades.com/v1/courses", {
      headers: {
        "Authorization": "Token token=052ae8133724409ba61902593bee5db6"
      }
    })
      .then((res) => res.json())
      .then(data => {
        setCourseList(data.results);
        setFilteredCourses(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const term = searchTerm.trim().toLowerCase();
        const filtered = courseList.filter(course =>
            course.name.toLowerCase().includes(term)
        );
        setFilteredCourses(filtered);
        setCurrentPage(1);
    };

    const displayCourses = () => {
        const startValue = (currentPage - 1) * itemsPerPage;
        const endValue = currentPage * itemsPerPage;
        const pagination = filteredCourses.slice(startValue, endValue);

        return pagination.map((course, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4 col-xl-3">
                {/* bootstrap grid system to adjust column sizes on different screen sizes */}
                <h2>{course.name}</h2>
            </div>
        ));
    };


    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  return (
    <Container className="py-5">
      {/* bootstrap container for consistent padding and layout */}
      
      <h1 className="text-center mb-4 fw-bold text-dark">📚 GradeSearch</h1>
      {/* bootstrap utility classes for centering text, adding margin, bold font, and dark text color */}

      <Form onSubmit={handleSearch} className="mb-4">
        {/* bootstrap form with bottom margin for spacing */}
        <Row className="justify-content-center">
          {/* bootstrap row with center alignment */}
          <Col md={6}>
            {/* bootstrap column with width adjustment on medium screens */}
            <div className="input-group shadow">
              {/* bootstrap input group for combining input and button, shadow for subtle elevation */}
              <Form.Control
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-light"
              />
              {/* bootstrap form control with no border and light background for soft appearance */}
              <Button type="submit" variant="dark"> Search</Button>
              {/* bootstrap button with dark variant for styling */}
            </div>
          </Col>
        </Row>
      </Form>

      <div className="text-center mb-3">
        {/* bootstrap utility classes for centering text and adding bottom margin */}
        <h4 className="text-muted">Total Results: {filteredCourses.length}</h4>
        {/* bootstrap muted text for subtle styling */}
      </div>

      {loading && (
        <div className="text-center my-4">
          {/* bootstrap text-center for alignment and margin-y for spacing */}
          <Spinner animation="border" variant="dark" />
          {/* bootstrap spinner component with border animation and dark variant */}
        </div>
      )}

      {!loading && (
        <Row>
          {/* bootstrap row for structuring course cards in a responsive grid */}
          {filteredCourses.map((course, index) => (
            <Col key={index} xs={12} md={6} lg={4} xl={3} className="mb-4">
              {/* bootstrap column with responsive grid sizes for different breakpoints */}
              <Card className="shadow-sm h-100 border-0 bg-light">
                {/* bootstrap card with a small shadow, full height, no border, and light background */}
                <Card.Body className="d-flex flex-column">
                  {/* bootstrap card body with flex column to align content */}
                  <Card.Title className="text-dark">{course.name}</Card.Title>
                  {/* bootstrap card title with dark text */}
                  <Card.Text className="text-muted">Course Code: {course.code || "N/A"}</Card.Text>
                  {/* bootstrap muted text for subtle styling */}
                  <Button variant="outline-dark mt-auto">View Details</Button>
                  {/* bootstrap outlined button with dark theme, mt-auto to push button to bottom */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
