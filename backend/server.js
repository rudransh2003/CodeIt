import 'dotenv/config';
import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import projectModel from './models/project.model.js';
import { generateResult } from './services/ai.service.js';
import redisClient from './services/redis.service.js';

const port = process.env.PORT || 5000;

const clearRedisOnRestart = async () => {
  try {
    await redisClient.flushall(); // Clears all Redis data
    console.log('Redis cleared on server restart - all existing tokens invalidated');
  } catch (error) {
    console.error('Error clearing Redis on restart:', error);
  }
};

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.use(async (socket, next) => {
     try {
         const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[ 1 ];
        const projectId = socket.handshake.query.projectId;

         if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return next(new Error('Invalid projectId'));
        }

        socket.project = await projectModel.findById(projectId);

        if (!token) {
            return next(new Error('Authentication error'))
        }

         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         if (!decoded) {
            return next(new Error('Authentication error'))
        }

        socket.user = decoded;

         next();

     } catch (error) {
        next(error)
    }

})

io.on('connection', socket => {
    socket.roomId = socket.project._id.toString()
    console.log('a user connected');
    socket.join(socket.roomId);
    socket.on('project-message', async data => {
        const message = data.message;
        const aiIsPresentInMessage = message.includes('@ai');
        socket.broadcast.to(socket.roomId).emit('project-message', data)
        if (aiIsPresentInMessage) {
            const prompt = message.replace('@ai', '');
            const result = await generateResult(prompt);
            io.to(socket.roomId).emit('project-message', {
                message: result,
                sender: {
                    _id: 'ai',
                    email: 'AI'
                }
            })
            return
        }
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(socket.roomId)
    });
});

server.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    // Clear Redis after server starts successfully
    await clearRedisOnRestart();
});