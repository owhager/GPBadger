/**
 * @file GradeSearch.jsx
 * @description Homepage for the GradeSearch website that fetches and displays UW-Madison courses and enables users to 
 *              search through all courses.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';

import { Link } from 'react-router-dom'; //Added Link for navigation to CourseDetails page
import Nav from './Nav';

export default function GradeSearch() {
  const searchInput = useRef(); // Stores user input in search bar
  const currentPage = useRef(); // Stores the current page the user is on
  const pageInput = useRef();

  const [courseList, setCourseList] = useState([]); // List of courses to be currently displayed to the user
  const [totalResults, setTotalResults] = useState(0); // Number of current course search results
  const [totalPages, setTotalPages] = useState(0); // Number of current pages of course search results
  const [loading, setLoading] = useState(false);

  /**
   * Retreives and displays first page of courses at UW-Madison from MadGrades API
   */
  useEffect(() => {
    // Default fetch request to MadGrades API returning first page of results
    fetch(`https://api.madgrades.com/v1/courses`, {
      headers: {
        "Authorization": "Token token=052ae8133724409ba61902593bee5db6"
      }
    })
      .then((res) => res.json())
      .then(data => {
        setCourseList(data.results);
        setTotalResults(data.totalCount);
        setTotalPages(data.totalPages);
        currentPage.current = 1;
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  /**
   * Retreives and displays first page of user course search results from MadGrades API
   */
  const handleSearch = (e) => {
    e.preventDefault();
    currentPage.current = 1;

    // MadGrades API request returning first page of user course search results
    fetch(`https://api.madgrades.com/v1/courses?page=1&query=${searchInput.current.value.trim().toLowerCase()}`, {
      headers: {
        "Authorization": "Token token=052ae8133724409ba61902593bee5db6"
      }
    })
      .then((res) => res.json())
      .then(data => {
        setCourseList(data.results);
        setTotalResults(data.totalCount);
        setTotalPages(data.totalPages);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  /**
   * Retreives and displays the page of user course search results that the user is currently on from MadGrades API
   */
  const changePage = async () => {
    // MadGrades API request returning the given page of user course search results
    const resp = await fetch(`https://api.madgrades.com/v1/courses?page=${currentPage.current}&query=${searchInput.current.value.trim().toLowerCase()}`, {
      headers: {
        "Authorization": "Token token=052ae8133724409ba61902593bee5db6"
      }
    })
    const data = await resp.json();
    setCourseList(data.results);
    setTotalResults(data.totalCount);
    setTotalPages(data.totalPages);
  }

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
                ref={searchInput}
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
        <h4 className="text-muted">Total Results: {totalResults}</h4>
        {/* bootstrap muted text for subtle styling */}
      </div>

      <div className="text-center mb-3">
        {/* bootstrap utility classes for centering text and adding bottom margin */}
        <h4 className="text-muted">Total Pages: {totalPages}</h4>
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
          {courseList.map((course, index) => (
            <Col key={index} xs={12} md={6} lg={4} xl={3} className="mb-4">
              {/* bootstrap column with responsive grid sizes for different breakpoints */}
              <Card className="shadow-sm h-100 border-0 bg-light">
                {/* bootstrap card with a small shadow, full height, no border, and light background */}
                <Card.Body className="d-flex flex-column">
                  {/* bootstrap card body with flex column to align content */}
                  <Card.Title className="text-dark">{course.name}</Card.Title>
                  {/* bootstrap card title with dark text */}
                  <Card.Text className="text-muted">Course Code: {course.subjects[0].abbreviation + " " + course.subjects[0].code}</Card.Text>
                  {/* bootstrap muted text for subtle styling */}
                  <Button
                    as={Link}
                    to={`/course/${course.id}`}
                    state={{course}}
                    variant="outline-dark mt-auto">
                    View Details
                  </Button>
                  {/* bootstrap outlined button with dark theme, mt-auto to push button to bottom */}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Pagination className="mt-3" count={totalPages}>
        <Pagination.Prev disabled={currentPage.current === 1} onClick={() => {
          currentPage.current = currentPage.current - 1;
          changePage();
        }}>Prev</Pagination.Prev>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index}
            active={index + 1 === currentPage.current}
            hidden={!(index + 1 === currentPage.current)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={currentPage.current === totalPages} onClick={() => {
          currentPage.current = currentPage.current + 1;
          changePage();
        }}>Next</Pagination.Next>
      </Pagination>
      <Form className="mb-4">
        {/* bootstrap form with bottom margin for spacing */}
        <Row>
          {/* bootstrap row with center alignment */}
          <Col md={3}>
            {/* bootstrap column with width adjustment on medium screens */}
            <div className="input-group shadow">
              {/* bootstrap input group for combining input and button, shadow for subtle elevation */}
              <Form.Control
                type="text"
                placeholder="Jump to page..."
                ref={pageInput}
                className="border-0 bg-light"
              />
              {/* bootstrap form control with no border and light background for soft appearance */}
              <Button onClick={ () => {
                if (Number.isInteger(Number(pageInput.current.value)) && Number(pageInput.current.value) > 0 && Number(pageInput.current.value) < totalPages) {
                  currentPage.current = pageInput.current.value;
                  changePage();
                } else {
                  console.log("no");
                }
              }}> Go to Page</Button>
              {/* bootstrap button with dark variant for styling */}
            </div>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};
