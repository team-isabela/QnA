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
  console.log('POSTing to answers...')
  console.log(req.params);
  console.log(req.body);
  const [newAnswer] = await sql`
    insert into answers (
      question_id,
      answer_body,
      answer_date,
      answerer_name,
      answerer_email,
      reported,
      answer_helpfulness
    )
    values (
      ${req.params.question_id},
      ${req.body.body},
      ${new Date()},
      ${req.body.name},
      ${req.body.email},
      ${false},
      ${0}
    )
    returning *
  `
  for (let photo of req.body.photos) {
    console.log(typeof photo);
    await sql`
      insert into answers_photos (
        answer_id,
        photo_url
      )
      values (
        ${newAnswer.answer_id},
        ${photo}
      )
    `
  }

  res.sendStatus(201);
})

server.put('/qa/questions/:question_id/:mark', async (req, res) => {
  res.status(204);
  console.log(req.params.mark);
  if (req.params.mark === 'helpful') {
    await sql`
      update questions
        set question_helpfulness = question_helpfulness + 1
      where question_id = ${req.params.question_id}
    `
  } else if (req.params.mark === 'report') {
    await sql`
      update questions
        set reported = ${true}
      where question_id = ${req.params.question_id}
    `
  } else {
    res.status(404);
    console.log(404);
  }
  res.end();
})

// server.put('qa/questions/:question_id/report', async (req, res) = {}) < this might be rollable into above

server.put('/qa/answers/:question_id/helpful', async (req, res) => {})

// server.put('qa/answers/:question_id/report', async (req, res) = {})



server.listen(port, () => {
  console.log(`sdc6 qna server.js now listening at port ${port}...`)
})