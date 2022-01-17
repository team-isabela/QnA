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
      question_id,
      question_body,
      question_date,
      asker_name,
      question_helpfulness,
      reported
    from questions
    where product_id = ${req.query.product_id} and reported = ${false}
    limit ${req.query.count || 5}
  `
  for (let question of questions) {
    question.answers = {};
    const answers = await sql`
      select
        answer_id as id,
        answer_body as body,
        answer_date as date,
        answerer_name,
        answer_helpfulness as helpfulness
      from answers
      where question_id = ${question.question_id}
    `
    for (let answer of answers) {
      const photos = await sql`
        select
          photo_id as id,
          photo_url as url
        from answers_photos
        where answer_id = ${answer.id}`
      answer.photos = photos;
      question.answers[answer.id] = answer;
    }
  }
  res.send({
    product_id: req.query.product_id,
    results: questions
  });
})

server.get('/qa/questions/:question_id/answers', async (req, res) => {
  const answers = await sql`
      select
        answer_id as answer_id,
        answer_body as body,
        answer_date as date,
        answerer_name,
        answer_helpfulness as helpfulness
      from answers
      where question_id = ${req.params.question_id}
    `
    for (let answer of answers) {
      const photos = await sql`
        select
          photo_id as id,
          photo_url as url
        from answers_photos
        where answer_id = ${answer.id}`
      answer.photos = photos;
    }
    res.send(answers);
})

server.post('/qa/questions', async (req, res) => {
  console.log('POSTing to questions...');
  await sql`
    insert into questions (
      product_id,
      question_body,
      question_date,
      asker_name,
      asker_email,
      reported,
      question_helpfulness
    )
    values (
      ${req.body.product_id},
      ${req.body.body},
      ${new Date()},
      ${req.body.name},
      ${req.body.email},
      ${false},
      ${0}
    )
  `
  res.sendStatus(201);
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