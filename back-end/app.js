import express from 'express';
import router from "./Routes/index.js";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT || 8080;
const SERVER_HOST = process.env.SERVER_HOST || '0.0.0.0';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173'], 
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


app.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`Listening on ${SERVER_HOST}:${SERVER_PORT}`);
});
