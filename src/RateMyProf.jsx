import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const ratings = require('@mtucourses/rate-my-professors').default;

const RateMyProf = (props) => {
  const [filteredProfs, setFilteredProfs] = useState([]);
  const [profData, setProfData] = useState(null);

  useEffect(() => {
    async function getStudentData() {
      try {
        const results = await ratings.searchTeacher(props.lastName.toLowerCase(), 'U2Nob29sLTE4NDE4');
        setFilteredProfs(results);

        const prof = results.find((p) => p.firstName.toLowerCase() === props.firstName.toLowerCase());

        if (prof) {
          const profInfo = await ratings.getTeacher(prof.id);
          setProfData(profInfo);
        }
      } catch (error) {
        console.error("Error fetching professor data:", error);
      }
    }

    getStudentData();
  }, [props.firstName, props.lastName]); // Depend on props to re-fetch data

  return (
    <div>
      {profData ? (


        <Card style={{ width: '40rem' }}>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>

                <h2 >{props.firstName} {props.lastName}</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                Average Rating: {profData.avgRating}
              </ListGroup.Item>
              <ListGroup.Item>
                Difficulty: {profData.avgDifficulty}
              </ListGroup.Item>
              <ListGroup.Item>
                Would Take Again: {Math.round(profData.wouldTakeAgainPercent)}%
              </ListGroup.Item>

            </ListGroup>

          </Card.Body>
        </Card>


      ) : (
        <p>Loading professor data...</p>
      )}
    </div>
  );
};

export default RateMyProf
