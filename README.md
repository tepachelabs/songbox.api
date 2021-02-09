Copyright © 2020, TepacheLabs

# Songbox

Songbox is a web service that allows users to listen to their music stored in Dropbox without having to install any app, directly from a web interface.

## Features:

1. Out of the box solution for mobile devices.
2. Dropbox stream cross-platform player.
3. Play music, mp3, audiobooks from Dropbox.
4. Supported audio formats: mp3, wav, ogg.
5. No need to install Dropbox app.
6. Access to Dropbox audio content anywhere
7. All your music, songs, audio, audio books, audio reports in one place.

**Other:**

1. Using HTML5 web browser.
2. No need to install any additional software.
3. No stored files in system memory.
4. Free to use.

## API Installation
```shell script
$ git clone https://github.com/tepachelabs/songbox.api.git
$ cd songbox.api
$ npm install
$ npm start

# Now you can make requests at http://localhost:4000
```

## System requirements
1. You'll need to install [Node.js](https://nodejs.org/es/).
2. You'll require a [Postgres](https://www.postgresql.org/) data base.

# Database query
First create ***users*** table then ***favorites***
```
CREATE TABLE users(
    user_id INT GENERATED ALWAYS AS IDENTITY,
    account_id TEXT NOT NULL,
    email TEXT NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE favorites(
    favorite_id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL, 
    song_name TEXT NOT NULL,
    path_lower TEXT NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id) 
            REFERENCES users(user_id)
);
```

## .env file for API
You need to create a ***.env*** file in the root of the project with the following data.
```
# APP
API_URL=http://localhost:4000
APP_URL=http://localhost:3000

# DROPBOX
APP_KEY=<dropbox app key>
APP_SECRET=<dropbox app secret>

# OTHER
DATABASE_USER=<Database user>
DATABASE_HOST=<Database url>
DATABASE_PASSWORD=<Database password>
DATABASE_NAME=<Database name>

# Checkout .env.example 
```

## API
```
** 1. GET -> /api/files/*
All files will be fetch from the path (*) -> /api/file/music/example

** 2. GET -> /api/file/*
Fetch a specific file link from the path (*) -> /api/file/music/example/route.mp3

** 3. GET -> /api/favorites
Fetch ALL songs marked as favorite.

** 4. POST -> /api/favorite
Marks a song file as favorite.

** 5. DELETE -> /api/favorite
Unmarks a song file from favorites.

** 6. GET -> /api/me
Fetch the basic of user from they're Dropbox account.

Checkout the examples -> https://documenter.getpostman.com/view/13525268/TW77f2pU
```
Checkout the [webapp repository](https://github.com/tepachelabs/songbox.webapp) to set up the whole project.
