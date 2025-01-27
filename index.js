import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from './models/user.js';
import { processData } from './utils/process-data.js';
import { keepAlive } from './utils/keep-alive.js';

const dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await mongoose.connect(dbUrl); // Establish MongoDB connection
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
}

const app = express();
const port = 7000;

// Enable CORS
app.use(cors({
    origin: ['https://test-eight-mu-85.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST'],
}));

// Define a simple route
app.get('/', (req, res) => {
    res.json({ msg: 'Hello World' });
});

const server = http.createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 5 * 1024 * 1024, // 5MB
    cors: {
        origin: ['https://test-eight-mu-85.vercel.app', 'http://localhost:3000'],
        methods: ["GET", "POST"],
    },
});

io.on('connection', (socket) => {
    let userId = null;

    socket.on('user-auth', async (data, callback) => {
        try {
            const user = await User.findById(data.id);
            callback({ authenticated: !!user });
            if (user) userId = data.id;
        } catch (error) {
            callback({ authenticated: null });
        }
    });

    socket.on("image-upload", async (data, callback) => {
        if(data.length < 2) {
            callback({ isSuccess: false, message: "Please upload both images" });
            return;
        }
        if (!userId) {
            callback({ isSuccess: false, message: "Authentication required" });
            return;
        }
        callback({ isSuccess: true });
        await processData(data, socket, userId);
    });

    socket.on("disconnect", () => {
    });
});


if (process.env.NODE_ENV === 'production') {
    const url = 'YOUR_RENDER_URL'; // Your Render deployment URL
    keepAlive(url);
}


connectToMongoDB().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
