DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reset_codes;
DROP TABLE IF EXISTS friends;

CREATE TABLE users(
     id         SERIAL PRIMARY KEY,
     first      VARCHAR(255) NOT NULL,
     last       VARCHAR(255) NOT NULL,    
     email      VARCHAR(255) NOT NULL UNIQUE,
     password   VARCHAR(255) NOT NULL,
     img_url    VARCHAR(255),
     bio        VARCHAR(700),
     city       VARCHAR(255) NOT NULL, 
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

CREATE TABLE reset_codes (
    id          SERIAL PRIMARY KEY,
    email       VARCHAR(255) NOT NULL,
    code        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friends( 
    id SERIAL PRIMARY KEY, 
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false
);

  CREATE TABLE posts( 
  id SERIAL PRIMARY KEY, 
  user_id INT REFERENCES users(id),
  post VARCHAR(700) NOT NULL,
  post_img VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

  CREATE TABLE preview( 
  id SERIAL PRIMARY KEY, 
  post_id INT REFERENCES posts(id),
  preview_url VARCHAR(255),
  preview_title VARCHAR(255),
  preview_img VARCHAR(255),
  preview_desc VARCHAR(700) NOT NULL,

);


-- UNIQUE REFERENCES users(email),