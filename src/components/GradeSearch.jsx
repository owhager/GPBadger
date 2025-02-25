import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';

export default function GradeSearch() {
  const [courseList, setCourseList] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-4 fw-bold text-dark">📚 GradeSearch</h1>

      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="input-group shadow">
              <Form.Control
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 bg-light"
              />
              <Button type="submit" variant="dark"> Search</Button>
            </div>
          </Col>
        </Row>
      </Form>

      
      <div className="text-center mb-3">
        <h4 className="text-muted">Total Results: {filteredCourses.length}</h4>
      </div>

    
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="dark" />
        </div>
      )}

     
      {!loading && (
        <Row>
          {filteredCourses.map((course, index) => (
            <Col key={index} xs={12} md={6} lg={4} xl={3} className="mb-4">
              <Card className="shadow-sm h-100 border-0 bg-light">
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-dark">{course.name}</Card.Title>
                  <Card.Text className="text-muted">Course Code: {course.code || "N/A"}</Card.Text>
                  <Button variant="outline-dark mt-auto">View Details</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};
