import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setUpSocket from "./socket.js";
import messagesRoutes from "./routes/MessageRoutes.js";
dotenv.config();
const app = express();

const port = process.env.PORT || 3001;
const dbUrl = process.env.DATABASE_URL;

app.use(cors({
  origin: [process.env.ORIGIN],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials: true
}));

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messagesRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

setUpSocket(server);

mongoose.connect(dbUrl).then(() => {
  console.log('Database connected');
}).catch(err => console.log(err.message));