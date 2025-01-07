import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import UserRoute from './presentation/routes/UserRoute';
import CategoryRoute from "./presentation/routes/CategoryRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/users', UserRoute);
app.use('/categories', CategoryRoute);


if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


export default app;