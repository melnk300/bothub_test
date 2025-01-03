import express from 'express';
// @ts-ignore
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import UserRoute from './presentation/routes/UserRoute';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/users', UserRoute);

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});