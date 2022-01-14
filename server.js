const express = require('express');
const sql = require('./db.js');

const server = express();
const port = 3000;

server.get('/', (req, res) => {
  res.send('root GET response');
})

server.get('/qa/questions', async (req, res) => {
  console.log(req.query);
  const questions = await sql`
    select * from questions
    where product_id = ${req.query.product_id}
    limit ${req.query.count || 5}
  `
  questions.forEach(async question => {
    // console.log(question);
    const answers = await sql`
    select * from answers
    where question_id = ${question.question_id}
    `
    // console.log(answers);
    // console.log(question.answers);
    question.answers = answers;
    // console.log(question.answers);
  })
  console.log(questions.answers);
  res.send(questions);
})

server.listen(port, () => {
  console.log(`sdc6 qna server.js now listening at port ${port}...`)
})