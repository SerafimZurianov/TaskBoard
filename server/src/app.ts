import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import tasksRouter from "./routes/tasks";

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Server is running'});
});

app.use('/auth', authRouter);
app.use('/tasks', tasksRouter);

export default app;