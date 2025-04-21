import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Col, Row, Form } from 'react-bootstrap';
import {getRateMyProfData, RateMyProf} from '../RateMyProf';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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
    const [barChart, setBarChart] = useState(<p></p>); // Stores Class Grade Totals Bar Chart
    const [offeringOption, setOfferingOption] = useState(""); // Stores the index of the course offering selected by the user


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
        .then(result => {
          setCourseGrades(result);
          setCourseInstructor(result.courseOfferings[0].sections[0].instructors[0].name);

          // Calculate Average GPA after fetching grade data if available
          if (Number(result.cumulative.total) != 0) {
          let totalCount = (Number(result.cumulative.aCount * 4.00)) + (Number(result.cumulative.abCount * 3.50)) + Number((result.cumulative.bCount * 3.00)) + (Number(result.cumulative.bcCount * 2.50)) + (Number(result.cumulative.cCount * 2.00)) + (Number(result.cumulative.dCount * 1.00)) + (Number(result.cumulative.fCount * 0.00));
          setCourseGPA((totalCount / Number(result.cumulative.total)).toFixed(2));
          } else {
            setCourseGPA("No GPA Available")
          }

          // RateMyProf request getting Instructor data if available
          let instructorName = result.courseOfferings[0].sections[0].instructors[0].name.split(" ");
          getRateMyProfData(instructorName[0], instructorName[1])
          .then((res) => {
            if (res != null) {
            setRateInstructor(res);
            const dataWould = {
                labels: ['Would', 'Would Not'],
                datasets: [
                  {
                    label: 'My Data',
                    data: [Number(res.wouldTakeAgainPercent), (100 - Number(res.wouldTakeAgainPercent))],
                    backgroundColor: ['blue', 'white'],
                    borderColor: 'rgba(0, 93, 255, 0.1)',
                    borderWidth: 1,
                  },
                ],
              };
              const dataRating = {
                labels: ['Would', 'Would Not'],
                datasets: [
                  {
                    label: 'My Data',
                    data: [Number(res.avgRating), (5 - Number(res.avgRating))],
                    backgroundColor: ['gold', 'white'],
                    borderColor: 'rgba(0, 93, 255, 0.1)',
                    borderWidth: 1,
                  },
                ],
              };
              const dataDiff = {
                labels: ['Would', 'Would Not'],
                datasets: [
                  {
                    label: 'My Data',
                    data: [Number(res.avgDifficulty), (5 - Number(res.avgDifficulty))],
                    backgroundColor: ['red', 'white'],
                    borderColor: 'rgba(0, 93, 255, 0.1)',
                    borderWidth: 1,
                  },
                ],
              };
              const options = {
                plugins: {
                  legend: {
                    display: false, // Show the legend
                    position: 'right', // Position of the legend
                  },
                },
                // Add more options as needed (e.g., tooltips, animations)
              };
              function DonutChartWould() {
                return (
                  <div style={{ width: '55px', height: '70px' }}>
                    <Doughnut data={dataWould} options={options} />
                  </div>
                );
              }
              function DonutChartRating() {
                return (
                  <div style={{ width: '55px', height: '70px' }}>
                    <Doughnut data={dataRating} options={options} />
                  </div>
                );
              }
              function DonutChartDiff() {
                return (
                  <div style={{ width: '55px', height: '70px' }}>
                    <Doughnut data={dataDiff} options={options} />
                  </div>
                );
              }
              setDisplayRate(<div><div><p><strong>Instructor Difficulty:</strong> {res.avgDifficulty + "/5"|| "TBD"}</p><DonutChartDiff/></div>
                <div><p><strong>Instructor Rating:</strong> {res.avgRating  + "/5"|| "TBD"}</p><DonutChartRating/></div>
                <div><p><strong>Would Take Instructor Again Percentage:</strong> {res.wouldTakeAgainPercent.toFixed(2) + "%" || "TBD"}</p><DonutChartWould/></div></div>);
            } else {
                setDisplayRate(<p>No Instuctor Ratings are Avaible</p>);
            }

            function BarChart({ chartData, options }) {
                return <Bar data={chartData} options={options} />;
              }
        
              const data = {
                labels: ['A', 'AB', 'B', 'BC', 'C', 'D', 'F'],
                datasets: [
                  {
                    label: 'Class Grade Totals',
                    data: [result.cumulative.aCount, result.cumulative.abCount, result.cumulative.bCount, result.cumulative.bcCount, result.cumulative.cCount, result.cumulative.dCount, result.cumulative.fCount],
                    backgroundColor: 'rgba(0, 0, 0, 0.85)'
                    ,
                    borderColor: 'rgba(0, 0, 0, 1)',
                    borderWidth: 1,
                  },
                ],
              };
              
              const options = {
                responsive: true,
                plugins: {
                  title: {
                    display: false,
                    text: 'GPA Data',
                  },
                },
              };
              setBarChart(<BarChart chartData={data} options={options} />);
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
                        Course Code: {course.subjects?.[0]?.abbreviation + " " + course.number || "N/A"}
                    </h5>
                    {/* Display Instructor, Credits, and Semester information with placeholders for missing values */}
                    <div style={{ paddingTop: '10px', paddingBottom: '1px' }}>
                    <p style={{ fontSize: '22px' }}><strong>Average GPA:</strong> {courseGPA || "TBD"}</p>
                    </div>
                    <p><strong>Instructor:</strong> {courseInstructor || "TBD"}</p>
                    {displayRate}
                    {/* Back Button - Navigates back to the previous page when clicked */}
                    <Button variant="dark" onClick={() => navigate(-1)}>Back to Search</Button>
                    <Container className='p-4'>
                    <Form.Group>
                    <Form.Label>Select Course Offering</Form.Label>
                    <Form.Select
                        value={offeringOption}
                        onChange={(e) => {
                        setOfferingOption(e.target.value);
                        if (!(e.target.value == "")) {
                        let courseOfferingNum = parseInt(e.target.value);
                        function BarChart({ chartData, options }) {
                          return <Bar data={chartData} options={options} />;
                        }
                        const data = {
                          labels: ['A', 'AB', 'B', 'BC', 'C', 'D', 'F'],
                          datasets: [
                            {
                              label: 'Class Grade Totals',
                              data: [courseGrades.courseOfferings[courseOfferingNum].cumulative.aCount, courseGrades.courseOfferings[courseOfferingNum].cumulative.abCount, courseGrades.courseOfferings[courseOfferingNum].cumulative.bCount, courseGrades.courseOfferings[courseOfferingNum].cumulative.bcCount, courseGrades.courseOfferings[courseOfferingNum].cumulative.cCount, courseGrades.courseOfferings[courseOfferingNum].cumulative.dCount, courseGrades.courseOfferings[courseOfferingNum].cumulative.fCount],
                              backgroundColor: 'rgba(0, 0, 0, 0.85)'
                              ,
                              borderColor: 'rgba(0, 0, 0, 1)',
                              borderWidth: 1,
                            },
                          ],
                        };
                        
                        const options = {
                          responsive: true,
                          plugins: {
                            title: {
                              display: false,
                              text: 'GPA Data',
                            },
                          },
                        };
                        setBarChart(<BarChart chartData={data} options={options}/>);
                      } else {
                        function BarChart({ chartData, options }) {
                          return <Bar data={chartData} options={options} />;
                        }
                        const data = {
                          labels: ['A', 'AB', 'B', 'BC', 'C', 'D', 'F'],
                          datasets: [
                            {
                              label: 'Class Grade Totals',
                              data: [courseGrades.cumulative.aCount, courseGrades.cumulative.abCount, courseGrades.cumulative.bCount, courseGrades.cumulative.bcCount, courseGrades.cumulative.cCount, courseGrades.cumulative.dCount, courseGrades.cumulative.fCount],
                              backgroundColor: 'rgba(0, 0, 0, 0.85)'
                              ,
                              borderColor: 'rgba(0, 0, 0, 1)',
                              borderWidth: 1,
                            },
                          ],
                        };

                        const options = {
                          responsive: true,
                          plugins: {
                            title: {
                              display: false,
                              text: 'GPA Data',
                            },
                          },
                        };
                        setBarChart(<BarChart chartData={data} options={options}/>); // Change the Bar Chart displayed to be the selected course offering data
                      }
                        }}
                          className="me-2" 
                        >
                        <option value="">Course Offering: Cumulative/All Terms</option>
                        {courseGrades.courseOfferings?.[0]?.termCode ? <option value="0">Course Offering: Term {courseGrades.courseOfferings?.[0]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[1]?.termCode ? <option value="1">Course Offering: Term {courseGrades.courseOfferings?.[1]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[2]?.termCode ? <option value="2">Course Offering: Term {courseGrades.courseOfferings?.[2]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[3]?.termCode ? <option value="3">Course Offering: Term {courseGrades.courseOfferings?.[3]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[4]?.termCode ? <option value="4">Course Offering: Term {courseGrades.courseOfferings?.[4]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[5]?.termCode ? <option value="5">Course Offering: Term {courseGrades.courseOfferings?.[5]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[6]?.termCode ? <option value="6">Course Offering: Term {courseGrades.courseOfferings?.[6]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[7]?.termCode ? <option value="7">Course Offering: Term {courseGrades.courseOfferings?.[7]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[8]?.termCode ? <option value="8">Course Offering: Term {courseGrades.courseOfferings?.[8]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[9]?.termCode ? <option value="9">Course Offering: Term {courseGrades.courseOfferings?.[9]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[10]?.termCode ? <option value="10">Course Offering: Term {courseGrades.courseOfferings?.[10]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[11]?.termCode ? <option value="11">Course Offering: Term {courseGrades.courseOfferings?.[11]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[12]?.termCode ? <option value="12">Course Offering: Term {courseGrades.courseOfferings?.[12]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[13]?.termCode ? <option value="13">Course Offering: Term {courseGrades.courseOfferings?.[13]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[14]?.termCode ? <option value="14">Course Offering: Term {courseGrades.courseOfferings?.[14]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[15]?.termCode ? <option value="15">Course Offering: Term {courseGrades.courseOfferings?.[15]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[16]?.termCode ? <option value="16">Course Offering: Term {courseGrades.courseOfferings?.[16]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[17]?.termCode ? <option value="17">Course Offering: Term {courseGrades.courseOfferings?.[17]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[18]?.termCode ? <option value="18">Course Offering: Term {courseGrades.courseOfferings?.[18]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[19]?.termCode ? <option value="19">Course Offering: Term {courseGrades.courseOfferings?.[19]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[20]?.termCode ? <option value="20">Course Offering: Term {courseGrades.courseOfferings?.[20]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[21]?.termCode ? <option value="21">Course Offering: Term {courseGrades.courseOfferings?.[21]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[22]?.termCode ? <option value="22">Course Offering: Term {courseGrades.courseOfferings?.[22]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[23]?.termCode ? <option value="23">Course Offering: Term {courseGrades.courseOfferings?.[23]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[24]?.termCode ? <option value="24">Course Offering: Term {courseGrades.courseOfferings?.[24]?.termCode}</option> : <></>}
                        {courseGrades.courseOfferings?.[25]?.termCode ? <option value="25">Course Offering: Term {courseGrades.courseOfferings?.[25]?.termCode}</option> : <></>}
                    </Form.Select>
                    </Form.Group>
                    </Container>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '150', paddingTop: '50px' }}>
                    <Col md={10}>
                    {barChart}
                    </Col>
                    </div>
                                       
                </Card.Body>
            </Card>
            
        </Container>
    );
}
