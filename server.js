const express = require('express');
const bodyParser = require('body-parser');
const sql = require('./db.js');

const server = express();
const port = 3000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/', (req, res) => {
  res.send('qna server is online and true');
})

server.get('/qa/questions', async (req, res) => {
  const questions = await sql`
    select
      q.question_id,
      q.question_body,
      q.question_date,
      q.asker_name,
      q.question_helpfulness,
      q.reported,
      json_object_agg (
        answers.answer_id,
        json_build_object(
          'id', answers.answer_id,
          'body', answers.answer_body,
          'date', answer_date,
          'answerer_name', answerer_name,
          'helpfulness', answer_helpfulness,
          'photos', photos
        )
      )  answers
    from questions q
    inner join (
      --replace with answers
      select
        answers.question_id,
        answers.answer_id,
        answers.answer_body,
        answers.answer_date,
        answers.answerer_name,
        answers.answer_helpfulness,
        json_agg(
          json_build_object(
            'id', answers_photos.photo_id,
            'url', answers_photos.photo_url
          )
        ) photos
      from answers
      inner join answers_photos on (answers.answer_id = answers_photos.answer_id)
      group by answers.answer_id
    ) as answers
    on (q.question_id = answers.question_id)
    where
      product_id = ${req.query.product_id}
      and q.reported = ${false}
    group by q.question_id
    limit ${req.query.count || 5}
  `
  res.send(questions);
})

server.get('/qa/questions/:question_id/answers', async (req, res) => {
  const answers = await sql`
      select
        answers.answer_id as answer_id,
        answer_body as body,
        answer_date as date,
        answerer_name,
        answer_helpfulness as helpfulness,
        json_agg(
          json_build_object(
            'id', photos.photo_id,
            'url', photos.photo_url
          )
        ) as photos
      from answers
      inner join answers_photos photos on (answers.answer_id = photos.answer_id)
      where question_id = ${req.params.question_id}
      group by answers.answer_id
    `
    res.send(answers);
})

server.post('/qa/questions', async (req, res) => {
  console.log('POSTing to questions...');
  console.log(req.body);
  // await sql`
  //   insert into questions (
  //     product_id,
  //     question_body,
  //     question_date,
  //     asker_name,
  //     asker_email
  //   )
  // `
  res.send('POSTed to questions');
})

server.post('/qa/questions/:question_id/answers', async (req, res) => {

})






server.put('/qa/questions/:question_id/helpful', async (req, res) => {})

// server.put('qa/questions/:question_id/report', async (req, res) = {}) < this might be rollable into above

server.put('/qa/answers/:question_id/helpful', async (req, res) => {})

// server.put('qa/answers/:question_id/report', async (req, res) = {})



server.listen(port, () => {
  console.log(`sdc6 qna server.js now listening at port ${port}...`)
})