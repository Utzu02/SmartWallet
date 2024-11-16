import express from 'express';
import router from "./Routes/index.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import emailCrawler from './email-crawler.js';
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8080;
const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';

const app = express();

emailCrawler(300);

app.use(cors({
    origin: ['*'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true  
}));


app.use(express.json());
app.use(cookieParser());


app.use(router);


app.options('*', cors());


app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(SERVER_PORT, () => {
    console.log(`Listening on ${SERVER_HOST}:${SERVER_PORT}`);
});

