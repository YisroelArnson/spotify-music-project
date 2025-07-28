# 🎵 spotify-music-project

A nostalgic playlist generator and music data explorer.

## 📌 Overview

The spotify-music-project is a web app that lets users create Spotify playlists based on specific time periods — such as a single month, a season, or a custom range. Whether you’re in the mood to relive Summer 2018 or explore your personal soundtrack from Fall 2015, this app brings back the vibes.

In addition to generating playlists, the app collects and processes user-generated data to highlight musical trends. Users’ song selections help build a growing database that reveals insights like:
	•	🎤 Top artists
	•	🎧 Most popular genres
	•	📊 Playlist trends over time

## ✨ Features
### 🎯 Time-Based Playlist Creation
Choose a year/month or a date range and instantly create a playlist with songs popular during that time.

### 📝 Custom Playlist Naming
Give your throwback playlist a custom name to match the mood.
### 📈 Data Collection & Analysis
Songs and playlists created via the app are stored and analyzed to identify trends in listening habits.
### 📊 Music Insights Dashboard
See aggregated data from all users including top artists and genre breakdowns.

## 🛠 Tech Stack
### Backend:
	•	Node.js  
	•	Express.js
	•	MongoDB with Mongoose
 
 ### Frontend:
	•	HTML/CSS
	•	Vanilla JavaScript
 
 ### Spotify Integration:
	•	Spotify Web API for playlist creation and track retrieval

# 🧠 Why I Built This
I created this project because I wanted to listen to music that I used to listen to. I thought it could be useful to create a web app that enables users to create playlists from certain time periods. They can choose a specific year and month, or a range of time. For example, if I wanted to go listen to music that I was listening to summer '18, I could put that into the field, enter a playlist name, and then create a playlist with those songs. I could then enjoy some 2018 summer jams on repeat.
I also wanted to collect data through this website so I could find key data points about what people are listenign to. So any songs added to a playlist through this site is saved in a mongoDB database. I process the data, saving invidual songs and playlists. I then display features like top artist, or most popular genre from the data collected.
