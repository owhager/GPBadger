import React, { useState, useEffect } from 'react';
import { Pagination, Container, Form, Button } from 'react-bootstrap';

export default function GradeSearch(props) {
    const [courseList, setCourseList] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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
            })
            .catch((error) => console.error("Error fetching data:", error));
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
                <h2>{course.name}</h2>
            </div>
        ));
    };


    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

    return (
        <Container>
            <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">Grade Search</a>
                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <a
                                    className="nav-link"
                                    href="userpage.html"
                                    style={{ fontWeight: 500 }}
                                >
                                    Login
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <h1>GradeSearch</h1>
            <Form onSubmit={handleSearch} className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search courses"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    id="search-course"
                />
                <Button type="submit" id="search-btn" className="mt-2">
                    Search
                </Button>
            </Form>

            <div id="num-results">Total Results: {filteredCourses.length}</div>

            <div className="row" id="courses">
                {displayCourses()}
            </div>

            <Pagination className="mt-3">
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        </Container>
    );
};