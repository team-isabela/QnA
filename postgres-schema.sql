CREATE TABLE questions (
 product_id INTEGER,
 question_id BIGSERIAL,
 question_body VARCHAR,
 question_date TIMESTAMP,
 asker_name VARCHAR,
 question_helpfulness INTEGER,
 reported BOOLEAN
);


ALTER TABLE questions ADD CONSTRAINT questions_pkey PRIMARY KEY (question_id);

CREATE TABLE answers (
 question_id INTEGER,
 answer_id BIGSERIAL,
 answer_body INTEGER,
 answer_date TIMESTAMP,
 answerer_name VARCHAR,
 answer_helpfulness INTEGER
);


ALTER TABLE answers ADD CONSTRAINT answers_pkey PRIMARY KEY (answer_id);

CREATE TABLE photos (
 answer_id INTEGER,
 photo_id BIGSERIAL,
 url VARCHAR
);


ALTER TABLE photos ADD CONSTRAINT photos_pkey PRIMARY KEY (photo_id);

ALTER TABLE answers ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES questions(question_id);
ALTER TABLE photos ADD CONSTRAINT photos_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES answers(answer_id);
