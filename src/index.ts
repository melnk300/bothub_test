import express from 'express';
// @ts-ignore
import cookieParser from 'cookie-parser';

import CategoryRoute from "./presentation/routes/CategoryRoute";
import AuthRoute from "./presentation/routes/AuthRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/categories', CategoryRoute);
app.use('/auth', AuthRoute);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});