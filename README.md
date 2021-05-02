# Stat Tracker Markdown

My favorite sport is basketball and I have always dreamed of being some sort of coach. I created this app for assistant coaches who are in charge of keeping track of stats. You can log in, view and edit your players, then view and edit their stats.

[Click here to view Stat Tracker, switch to a mobile view for proper setup](https://pacific-plains-42070.herokuapp.com/)

### Resource

**players**

Attributes:

* player_name (number)
* player_ppg (number)
* player_rebounds (number)
* player_assists (number)
* player_steals (number)
* player_blocks (number)
* player_turnovers (number)
* player_fouls (number)

### REST Endpoints

Name                           | Method | Path
-------------------------------|--------|------------------
Retrieve Players Collection    | GET    | /players
Insert Players member          | POST   | /players
Delete Players member          | DELETE | /players/playerId
Update Players member          | PUT    | /players/playerId

* Update takes place in two different places in the app

<img width="361" alt="Screen Shot 2021-05-02 at 2 51 27 PM" src="https://user-images.githubusercontent.com/54300598/116827380-efe0f780-ab55-11eb-8432-4f61449823e1.png">
