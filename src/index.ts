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

const server = app.listen(process.env.PORT || 3000, () => {
    if (process.env.NODE_ENV !== 'test') {
        console.log('Server is running on port ' + (process.env.PORT || 3000));
    }
});

export const closeServer = async () => {
    return new Promise<void>((resolve, reject) => {
        server.close(err => {
            if (err) reject(err);
            else resolve();
        });
    });
};


export default app;