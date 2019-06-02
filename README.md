# imdb-server

A simple server with user system.

Able to search,add,rate,get and delete movies from user list.

Only scrapes limited information from imdb.

## Getting Started

### Setup

Must have a mysql server setup.  
Copy `/config/config.example.json` to `/config/config.json` with your mysql db info

Copy `.env.example` to `.env` and replace the default value to a secure value of your choice.

### Installing

```
npm install
```

### Create Tables

Change `forceUpdate` to `true`

inside `./index.js`

then `npm start`

This will create or drop and create tables based on models.

### Start Server

```
npm start
```

## Documentation

### [Auth Endpoints](https://github.com/forrestw92/imdb-server/wiki/Auth-Endpoints)

### [Movie Endpoints](https://github.com/forrestw92/imdb-server/wiki/Movie-Endpoints)

### [Scraping New Data](https://github.com/forrestw92/imdb-server/wiki/Scraping-New-Data)
