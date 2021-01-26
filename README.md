# Dublin Planning Perimission Map
## Introduction
The Dublin Planning Permission application allows a user to explore a map of dublin
with up-to-date information on recent applications and to filter
the applications based on the decision made by the council as well as 
by when the application was submitted.

The goal of this project was to explore the work involved in creating a full-stack web application, 
and to become familiar with some modern technologies.

The data was originally sourced from [opendata.dublincity.ie](https://opendata.dublincity.ie/PandDOpenData/).
It comes in the form of a single csv file that is updated every week. 
I processed the file and loaded the information into a PostgreSQL database. The information in the databse is queried through a flask server which uses SQLAlchemy.

## Technologies
### Frontend
- Vue.js
- Leaflet.js
- vue2leaflet
- axios
### Backend
- Flask
- PostgreSQL
- SQLAlchemy
- Nginx ?

