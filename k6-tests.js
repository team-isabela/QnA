import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1000, //stimulate how many virtual users
  duration: '30s', //how long you want it to run
};

// tests random QUESTIONS endpoint
export default function () {
  http.get(
    `http://localhost:3000/qa/questions/?product_id=${
      Math.floor(Math.random() * (1000000 - 1 + 1)) + 1
    }`
  );
}

// tests random ANSWERS endpoint

// export default function () {
//   http.get(`http://localhost:3000/qa/questions/${Math.floor(Math.random() * (1000000 - 1 + 1)) + 1}/answers`);
// }
