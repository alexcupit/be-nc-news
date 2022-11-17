# Northcoders News API

This app has been created as part of the Northcoders Software Enginerring course.

The project allows the user to access a variety of endpoints that interact with a database of news articles. The server has been hosted which links to a hosted database and it can also be used locally, simply follow the set up instructions below.

## Hosted Version

The server has been hosted at:

https://black-springbok-cap.cyclic.app/api

The above shows a list of all enpoints available on this server to interact with the database, all with example data and available queries.

## Local Version Set Up

Min version requirements for local operation:

- Node: v18.10.0
- psql: v14.5

To run this programme locally, fork and clone this repo onto your local machine. Install dependencies by running the following command in the terminal:

```
npm install
```

Environment variables need to be declared in two files created locally in the root folder:

1. env.development

```
PGDATABASE=nc_news
```

2. env.test

```
PGDATABASE=nc_news_test
```

Next, the database will need creating and seeding by running the following commands:

```
npm run setup-dbs
npm run seed
```

The test suite can be executed using:

```
npm test
```

This will run unit testing for the util functions used in the database seeding and also integration testing for the server endpoints.

Enjoy interacting with this database!
