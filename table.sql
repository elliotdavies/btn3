CREATE TABLE Person (
    name VARCHAR(90) NOT NULL PRIMARY KEY,
    age INT,
    description VARCHAR(1000),
    picture BLOB,
    search_link VARCHAR(500) NOT NULL
);