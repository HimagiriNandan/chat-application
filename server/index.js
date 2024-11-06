import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactsRoutes from "./routes/ContactRoutes.js";
import setUpSocket from "./socket.js";
import messagesRoutes from "./routes/MessageRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";
import path from "path";

dotenv.config();
const app = express();

const port = process.env.PORT || 3001;
const dbUrl = "mongodb+srv://himagirinandan:Nandan2004@chatcluster1.yehfj.mongodb.net/Chat-application";
const _dirname = path.resolve();

app.use(cors({
  origin: ["https://syncwave-joxr.onrender.com"],
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
app.use("/api/channel", channelRoutes);

app.use(express.static(path.join(_dirname, '/client/my-project/dist')));
app.get('*', ( req, res) => {
  res.sendFile(path.resolve(_dirname, 'client', 'my-project', 'dist', 'index.html'));
})

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

setUpSocket(server);

mongoose.connect(dbUrl).then(() => {
  console.log('Database connected');
}).catch(err => console.log(err.message));