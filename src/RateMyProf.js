
const ratings = require('@mtucourses/rate-my-professors').default;

/**
 * Retreives Rate My Professor (RMP) ratings for individual professors at UW-Madison
 * @param firstName First name of searched prof
 * @param lastName Last name of searched prof
 * @returns object of RMP stats
 */
export default async function getRateMyProfData(firstName, lastName) {

  //filter based on last name
  //second param is UW-Madison school ID code in Rate My Professor - DO NOT CHANGE
  const filteredProfs = await ratings.searchTeacher(lastName.toLowerCase(),'U2Nob29sLTE4NDE4');

  console.log(filteredProfs);

  let profID = null;

  //filter last name results based on first name to get profID
  for(let i =0; i < filteredProfs.length; i++){
    if(filteredProfs[i].firstName.toLowerCase()=== firstName.toLowerCase()){
      profID = filteredProfs[i].id;
    }
  }

  //search for prof based on unique prof id
  const profData = await ratings.getTeacher(profID);

  console.log(profData);

  return profData;
  
};
