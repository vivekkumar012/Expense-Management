import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import AuthRoute from "./routes/auth.routes.js";

const app = express();
dotenv.config();
app.use(express.json())

const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  })

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.use("/api/v1/auth", AuthRoute);



app.listen(PORT, () => {
    console.log("App is listening on Port 5000")
});