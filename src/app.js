/*let courseList; //Stores all the courses returned by the fetch request

/*
Function that display all courses passed into it by the cours parameter
*/
function displayCourses(cours) {
	let courses = document.getElementById("courses");
	courses.innerHTML = "";
	document.getElementById("num-results").innerText = `${cours.length}`;
	for (let course of cours) {
		const newDivider = document.createElement('div');
		newDivider.setAttribute("class", "col-12 col-md-6 col-lg-4 col-xl-3");
		const newCourse = document.createElement('h2');
		newCourse.innerText = `${course.name}`;

		courses.appendChild(newDivider);
		newDivider.appendChild(newCourse);
	}
}

/*
Function that filters the courses based on the current search input
*/
function handleSearch(e) {
	e?.preventDefault();

	//Implement the search
	let students = document.getElementById("courses");
	students.innerHTML = "";
	displayCourses(courseList.filter(cour => `${cour.name.toLowerCase()}`.includes(document.getElementById("search-course").value.trim().toLowerCase())));
}

document.getElementById("search-btn").addEventListener("click", handleSearch);
//MadGrades API course name fetch request
fetch("https://api.madgrades.com/v1/courses", {
	headers: {
		"Authorization": "Token token=052ae8133724409ba61902593bee5db6"
	}
})
.then((res) => res.json())
.then(data => {
	courseList = JSON.parse(JSON.stringify(data.results));
	console.log(courseList);
	displayCourses(courseList);
})
