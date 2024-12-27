import express from 'express';
import CategoryRoute from "./presentation/routes/CategoryRoute";

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/categories', CategoryRoute);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});