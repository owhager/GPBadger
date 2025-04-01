/**
 * @file GradeSearch.jsx
 * @description Homepage for the GradeSearch website that fetches and displays UW-Madison courses and enables users to 
 *              search through all courses.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Container, Form, Button, Row, Col, Card, Spinner, Modal } from 'react-bootstrap';
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

  const [sortOption, setSortOption] = useState("");
  const [selectedGPA, setSelectedGPA] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);

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

  const sortCourses = (courses, option) => {
    return [...courses].sort((a, b) => {
      if (option === "A-Z") return a.name.localeCompare(b.name);
      if (option === "Z-A") return b.name.localeCompare(a.name);
      if (option === "Course Code Ascending Order") return parseInt(a.number || 0) - parseInt(b.number || 0);
      if (option === "Course Code Descending Order") return parseInt(b.number || 0) - parseInt(a.number || 0);


      return 0;
    });
  };

  const applyFilters = () => {
    fetch(`https://api.madgrades.com/v1/courses?page=all`, {
      headers: {
        "Authorization": "Token token=052ae8133724409ba61902593bee5db6"
      }
    })
      .then((res) => res.json())
      .then(data => {
        let filteredCourses = data.results; 

        if (!selectedLevel && !selectedGPA) {
          // If both filters are empty, show all courses
          setCourseList(data.results);
          setTotalResults(data.totalCount);
          setTotalPages(data.totalPages);
        } else {
          if (selectedLevel) {
            filteredCourses = filteredCourses.filter(course =>
              Math.floor(course.number / 100) * 100 === parseInt(selectedLevel)
            );
          }
          if (selectedGPA) {
            filteredCourses = filteredCourses.filter(course =>
              course.averageGPA && course.averageGPA >= parseFloat(selectedGPA)
            );
          }
          setCourseList(sortCourses(filteredCourses, sortOption));
          setTotalResults(filteredCourses.length);
          setTotalPages(Math.ceil(filteredCourses.length / 10));
        }
        
        setShowFilterModal(false);
      })
      .catch((error) => console.error("Error fetching data:", error));
};


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
        let filteredCourses = data.results;

        if (selectedLevel) {
          filteredCourses = filteredCourses.filter(course =>
            Math.floor(course.number / 100) * 100 === parseInt(selectedLevel)
          );
        }

        if (selectedGPA) {
          filteredCourses = filteredCourses.filter(course =>
            course.averageGPA && course.averageGPA >= parseFloat(selectedGPA)
          );
        }

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

      <h1 className="text-center mb-4 fw-bold text-dark">📚 GPBadger</h1>
      {/* bootstrap utility classes for centering text, adding margin, bold font, and dark text color */}

      <Row className="align-items-center mb-4">
  {/* Search Bar - Reduce Width */}
  <Col md={5}>
    <Form onSubmit={handleSearch}>
      <div className="input-group shadow">
        <Form.Control type="text" placeholder="Search courses..." ref={searchInput} className="border-0 bg-light" />
        <Button type="submit" variant="dark">Search</Button>
      </div>
    </Form>
  </Col>

  {/* Sorting & Filter in Same Column - Align Together */}
  <Col md={4} className="d-flex align-items-center justify-content-end">
    <Form.Select
      value={sortOption}
      onChange={(e) => {
        setSortOption(e.target.value);
        setCourseList(sortCourses(courseList, e.target.value));
      }}
      className="me-2" // Adds spacing between Sort & Filter
    >
      <option value="">Sort: None</option>
      <option value="A-Z">Sort: A-Z</option>
      <option value="Z-A">Sort: Z-A</option>
      <option value="Course Code Ascending Order">Sort: Course Code: Low to High</option>
      <option value="Course Code Descending Order">Sort: Course Code: High to Low</option>
    </Form.Select>

   
    <Button variant="outline-dark" className="px-3 py-2 fw-bold border-2" onClick={() => setShowFilterModal(true)}>Filter</Button>

  </Col>
</Row>

      {/* Filter Modal */}
      <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Filter Courses</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* GPA Filter */}
          <Form.Group className="mb-3">
            <Form.Label>Filter by GPA</Form.Label>
            <Form.Select value={selectedGPA} onChange={(e) => setSelectedGPA(e.target.value)}>
              <option value="">Select GPA</option>
              <option value="4.0">4.0+</option>
              <option value="3.5">3.5+</option>
              <option value="3.0">3.0+</option>
              <option value="2.5">2.5+</option>
              <option value="2.0">2.0+</option>
            </Form.Select>
          </Form.Group>

          {/* Course Level Filter */}
          <Form.Group>
            <Form.Label>Filter by Course Level</Form.Label>
            <Form.Select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
              <option value="">Select Level</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
              <option value="500">500 Level</option>
              <option value="600">600 Level</option>
              <option value="700">700 Level</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFilterModal(false)}>Cancel</Button>
          <Button variant="dark" onClick={applyFilters}>Apply Filters</Button>
        </Modal.Footer>
      </Modal>


      <div className="text-center mb-3">
        {/* bootstrap utility classes for centering text and adding bottom margin */}
        <h4 className="text-muted">Total Results: {totalResults}</h4>
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
                  <Card.Text className="text-muted">Course Code: {course.subjects[0].abbreviation + " " + course.number}</Card.Text>
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
      <Pagination className="mt-3 justify-content-center" count={totalPages}>

        <Pagination.Prev disabled={currentPage.current <= 1} onClick={() => {
          currentPage.current = parseInt(Number(currentPage.current) - 1);
          changePage();
        }}>Prev</Pagination.Prev>
        <Pagination.Item>{currentPage.current}</Pagination.Item>
        <Pagination.Next disabled={currentPage.current >= totalPages} onClick={() => {
          currentPage.current = parseInt(Number(currentPage.current) + 1);
          changePage();
        }}>Next</Pagination.Next>
        <Form className="mb-4">
        {/* bootstrap form with bottom margin for spacing */}
        <Row>
          {/* bootstrap row with center alignment */}
          <Col md={12}>
            {/* bootstrap column with width adjustment on medium screens */}
            <div className="input-group">
              {/* bootstrap input group for combining input and button, shadow for subtle elevation */}
              <Form.Control
                type="text"
                placeholder="Jump to page..."
                ref={pageInput}
                className="border-0 bg-light"
              />
              {/* bootstrap form control with no border and light background for soft appearance */}
              <Button onClick={ () => {
                if (Number.isInteger(Number(pageInput.current.value)) && Number(pageInput.current.value) > 0 && Number(pageInput.current.value) <= totalPages) {
                  currentPage.current = pageInput.current.value;
                  changePage();
                }
              }}>Go to Page</Button>
              {/* bootstrap button with dark variant for styling */}
            </div>
          </Col>
        </Row>
      </Form>
      </Pagination>
      <div className="text-center">
        <h6 className="text-secondary">Total Pages: {totalPages}</h6>
      </div>
    </Container>
  );
};
