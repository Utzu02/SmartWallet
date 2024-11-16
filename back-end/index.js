import express from 'express';
import cors from 'cors';

import config from './config.js';
import emailCrawler from './email-crawler.js';

const app = express();

app.use(cors());
app.use(express.json());
emailCrawler();

app.listen(config.port, () =>
  console.log(`Server is live @ ${config.hostUrl}`),
);