CREATE DATABASE LEONAPP;
--\c user
CREATE TABLE USERDB (
    user_id serial PRIMARY KEY,
    user_name VARCHAR(50) UNIQUE NOT NULL CHECK (length(user_name) > 5),
    auth_measure VARCHAR(20) CHECK (auth_measure IN ('self', 'google', 'github')),
    user_email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(50),
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP,
    CONSTRAINT password_requirements CHECK (
        (auth_measure IN ('google', 'github') AND password IS NULL) OR
        (auth_measure NOT IN ('google', 'github') AND password IS NOT NULL AND length(password) > 5)
    )
);


-- postdb
CREATE TABLE postdb (
    post_id serial PRIMARY KEY,
    user_id integer REFERENCES userdb(user_id),
    made_by VARCHAR(20) NOT NULL,
    post_content TEXT NOT NULL CHECK (length(post_content) > 0),
    reactions INTEGER[],
    isParentPost boolean NOT NULL,
    replies INTEGER[],
    time_created TIMESTAMP NOT NULL
);
