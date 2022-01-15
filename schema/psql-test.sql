DROP DATABASE IF EXISTS QnA; --will throw an error if you're already on qna but it's fine

CREATE DATABASE QnA;

\c qna;

DROP TABLE IF EXISTS questions, answers, answers_photos;

CREATE TABLE questions (
 question_id BIGSERIAL,
 product_id INTEGER,
 question_body VARCHAR,
 question_date BIGINT,
 asker_name VARCHAR,
 asker_email VARCHAR,
 reported BOOLEAN DEFAULT false,
 question_helpfulness INTEGER DEFAULT 0
);



ALTER TABLE questions ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);

CREATE INDEX qid ON questions (question_id);

COPY questions
FROM PROGRAM 'head -1000 /home/kpoduri/projects/hackreactor/senior-phase/sdc6/csv-data/questions.csv'
DELIMITER ',' CSV HEADER;

UPDATE questions SET question_date = question_date/1000;
ALTER TABLE questions
ALTER COLUMN question_date TYPE TIMESTAMP USING to_timestamp(question_date);

CREATE TABLE answers (
 answer_id BIGSERIAL,
 question_id INTEGER,
 answer_body VARCHAR,
 answer_date BIGINT,
 answerer_name VARCHAR,
 answerer_email VARCHAR,
 reported BOOLEAN,
 answer_helpfulness INTEGER
);


ALTER TABLE answers ADD CONSTRAINT answers_pkey PRIMARY KEY (answer_id);
CREATE INDEX aid ON answers (answer_id);

COPY answers
FROM PROGRAM 'head -1000 /home/kpoduri/projects/hackreactor/senior-phase/sdc6/csv-data/answers.csv'
DELIMITER ',' CSV HEADER;

UPDATE answers SET answer_date = answer_date/1000;
ALTER TABLE answers
ALTER COLUMN answer_date TYPE TIMESTAMP USING to_timestamp(answer_date);

CREATE TABLE answers_photos (
 photo_id BIGSERIAL,
 answer_id INTEGER,
 photo_url VARCHAR
);

ALTER TABLE answers_photos ADD CONSTRAINT answers_photos_pkey PRIMARY KEY (photo_id);
CREATE INDEX pid ON answers_photos (photo_id);


COPY answers_photos
FROM PROGRAM 'head -1000 /home/kpoduri/projects/hackreactor/senior-phase/sdc6/csv-data/answers_photos.csv'
DELIMITER ',' CSV HEADER;

ALTER TABLE answers ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES questions(question_id);
ALTER TABLE answers_photos ADD CONSTRAINT answers_photos_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES answers(answer_id);