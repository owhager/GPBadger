/**
 * @file RateMyProf.js
 * @description React card that fetches and displays Rate My Professor (RMP) ratings
 *              for profs at at UW-Madison.
 * 
 * @dependencies
 * - React: used as agreed upon app wide language
 * - react-bootstrap: used for UI features / design
 * - @mtucourses/rate-my-professors: npm library that fetches professor ratings
 * 
 * @author Angie Gorton
 */


import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const ratings = require('@mtucourses/rate-my-professors').default;


/**
 * Retreives Rate My Professor (RMP) ratings for individual professors at UW-Madison
 * @param firstName First name of searched prof
 * @param lastName Last name of searched prof
 * @returns object of RMP stats (average diffculty, average rating, and would take again %)
 */

export async function getRateMyProfData(firstName, lastName) {
  try {

    //filter based on last name
    //second param is UW-Madison school ID code in Rate My Professor - DO NOT CHANGE
    const results = await ratings.searchTeacher(lastName.toLowerCase(), 'U2Nob29sLTE4NDE4');

    //filter last name results based on first name to get profID
    const prof = results.find((p) => p.firstName.toLowerCase() === firstName.toLowerCase());
    
    if (prof) {
      //search for prof based on unique prof id
      const profInfo = await ratings.getTeacher(prof.id);
      return profInfo; // Return the data directly instead of using state
    }

    return null; // Return null if professor is not found
  } catch (error) {
    console.error("Error fetching professor data:", error);
    return null;
  }
}

const RateMyProf = (props) => {
  const [profData, setProfData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRateMyProfData(props.firstName, props.lastName);
      setProfData(data);
    };

    fetchData(); 
  }, [props.firstName, props.lastName]); // re-fetch data if params change

  return (
    <div>
      {profData ? (
        <Card style={{ width: '40rem' }}>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>{props.firstName} {props.lastName}</h2>
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

export default RateMyProf;
