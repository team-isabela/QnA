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
          'helpfulness', answer_helpfulness
        )
      )  answers
    from questions q
    inner join answers on (q.question_id = answers.question_id)
    where
      product_id = ${req.query.product_id}
      and q.reported = ${false}
    group by q.question_id
    limit ${req.query.count || 5}
  `
  console.log(questions[0].answers);
  // for (let question of questions) {
  //   question.answers = {};
  //   const answers = await sql`
  //     select
  //       answer_id as id,
  //       answer_body as body,
  //       answer_date as date,
  //       answerer_name,
  //       answer_helpfulness as helpfulness
  //     from answers
  //     where question_id = ${question.question_id}
  //   `
  //   for (let answer of answers) {
  //     const photos = await sql`
  //       select
  //         photo_id as id,
  //         photo_url as url
  //       from answers_photos
  //       where answer_id = ${answer.id}`
  //     answer.photos = photos;
  //     question.answers[answer.id] = answer;
  //   }
  // }
  // res.send({
  //   product_id: req.query.product_id,
  //   results: questions
  // });
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
            'id', answers_photos.photo_id,
            'url', answers_photos.photo_url
          )
        ) photos
      from answers
      inner join answers_photos on (answers.answer_id = answers_photos.answer_id)
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