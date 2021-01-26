# Dublin Planning Perimission Map

## Introduction

The Dublin Planning Permission web application allows a user to explore a map of Dublin,
interact with recent planning permission applications and filter
the applications based on the decision made by the council as well as 
by when the application was submitted.

The main objective of this project was to explore the work involved in creating a full-stack web application, 
and to become familiar with some of the relevant modern technologies.


## Technologies

### Frontend
- Vue.js
    - Javascript
    - HTML
    - CSS/SCSS
- Leaflet.js
- Elements of Bootstrap

### Backend
- Flask
    - Python
- SQLAlchemy
- PostgreSQL

### Network & Hosting
- Netlify
- AWS EC2
- Ubuntu
- Nginx 


## Diagram

![Flow Chart](./docs/flowchart_white.png)

## Backend Functions
The data was originally sourced from [opendata.dublincity.ie](https://opendata.dublincity.ie/PandDOpenData/).
It comes in the form of a single csv file that is updated and replaced regularly.
I processed the file and loaded the information into a PostgreSQL database. 
The information in the databse is queried through a flask server which uses SQLAlchemy for the ORM.



## Future Improvements

- Improve design and UI
- Automate the collection and addition of new applications to the database
- Additional filters and search capabilities 
