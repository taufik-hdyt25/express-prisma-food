import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import router from "./routes";
import { parseData } from "./middlewares/parseFormData";

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.get("/", (req, res) => res.send("Connect Nih"));

// Routes
app.use("/api/v1", router);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
