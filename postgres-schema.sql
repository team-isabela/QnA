DROP DATABASE IF EXISTS QnA;

DROP TABLE IF EXISTS questions, answers, answers_photos;

CREATE DATABASE QnA;

CREATE TABLE questions (
 product_id INTEGER,
 question_id BIGSERIAL,
 question_body VARCHAR,
 question_date DATE,
 asker_name VARCHAR,
 asker_email VARCHAR,
 reported BOOLEAN,
 question_helpfulness INTEGER
);


ALTER TABLE questions ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);

COPY questions
FROM '/home/kpoduri/projects/hackreactor/senior-phase/sdc6/csv-data/questions.csv'
DELIMITER ',' CSV HEADER;

CREATE TABLE answers (
 answer_id BIGSERIAL,
 question_id INTEGER,
 answer_body VARCHAR,
 answer_date DATE,
 answerer_name VARCHAR,
 answerer_email VARCHAR,
 reported BOOLEAN,
 answer_helpfulness INTEGER
);


ALTER TABLE answers ADD CONSTRAINT answers_pkey PRIMARY KEY (answer_id);

COPY answers
FROM '/home/kpoduri/projects/hackreactor/senior-phase/sdc6/csv-data/answers.csv'
DELIMITER ',' CSV HEADER;

CREATE TABLE answers_photos (
 photo_id BIGSERIAL,
 answer_id INTEGER,
 photo_url VARCHAR
);

COPY answers_photos
FROM '/home/kpoduri/projects/hackreactor/senior-phase/sdc6/csv-data/answers_photos.csv'
DELIMITER ',' CSV HEADER;

ALTER TABLE answers_photos ADD CONSTRAINT answers_photos_pkey PRIMARY KEY (photo_id);

ALTER TABLE answers ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES questions(question_id);
ALTER TABLE answers_photos ADD CONSTRAINT answers_photos_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES answers(answer_id);