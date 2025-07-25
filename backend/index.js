import express from "express";
import "dotenv/config";
import connectDb from "./config/database.js";
import router from "./routes/todo.route.js";
import cors from "cors"; // Correct import

const app = express();

app.use(cors()); // ✅ Allows all origins
app.use(express.json());

connectDb();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.send("App is live");
});

app.use('/api/v1/', router);

app.listen(port, () => {
    console.log("App is listening at port:", port);
});
