# Specification Document

## TeamName

<!--The name of your team.-->
Team Table 15

### Project Abstract

<!--A one paragraph summary of what the software will do.-->

The software that we are creating throughout this project will fetch and display UW-Madison course data and display it to users through a website. The data used for this website will be primarily retrieved from the MadGrades API to share reliable and up to date grade information about UW-Madison courses. It will also enable users to easily access this data through multiple search functionilties. 

### Customer

<!--A brief description of the customer for this software, both in general (the population who might eventually use such a system) and specifically for this document (the customer(s) who informed this document). Every project will have a customer from the CS506 instructional staff. Requirements should not be derived simply from discussion among team members. Ideally your customer should not only talk to you about requirements but also be excited later in the semester to use the system.-->

The customers we are targeting with our software are University of Wisconsin - Madion students. The website we are building will allow students, when looking for different classes to potentially enroll in, to easily search though courses and access data on the grades earned by students taking the course in past semesters. We aim to help simplify the process of course selection for these university students through this software.

### Specification

<!--A detailed specification of the system. UML, or other diagrams, such as finite automata, or other appropriate specification formalisms, are encouraged over natural language.-->

<!--Include sections, for example, illustrating the database architecture (with, for example, an ERD).-->

<!--Included below are some sample diagrams, including some example tech stack diagrams.-->

#### Technology Stack

```mermaid
flowchart RL
subgraph Front End
	A(Javascript: React)
end
	
subgraph Database
	C[(MySQL)]
end
subgraph MadGrades
	D[(MadGrades API)]
end

A <--> C
A <--> D
```

#### Database



#### Class Diagram



#### Flowchart



#### Behavior
```mermaid
stateDiagram
    [*] --> DisplayCourses: Show All Courses
    DisplayCourses --> SearchLoading : Type Search
    DisplayCourses --> Login : Press Login Button
    DisplayCourses --> Signup: Press Signup Button
    SearchLoading --> DisplayCourses: Show Search Results
    Login --> DisplayCourses: Enable Logged In Priviledges
    Signup --> Login: Choose Username/Password
```

#### Sequence Diagram

```mermaid
sequenceDiagram
participant ReactFrontend
participant MadGrades API
participant MySQLDatabase
ReactFrontend ->> MadGrades API: HTTP Request (e.g., GET /api/data)
activate MadGrades API
ReactFrontend ->> MySQLDatabase: Query (e.g., SELECT * FROM data_table)
activate MySQLDatabase
MySQLDatabase -->> ReactFrontend: Result Set
deactivate MySQLDatabase
MadGrades API -->> ReactFrontend: JSON Response
deactivate MadGrades API
```

### Standards & Conventions

<!--This is a link to a seperate coding conventions document / style guide-->
[Style Guide & Conventions](STYLE.md)