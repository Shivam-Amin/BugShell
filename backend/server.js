import { config } from "dotenv";
import { app } from "./app.js";
import db from "./models/index.js";

import { Server, Socket } from "socket.io";
import pty from "node-pty";
import { sessionManager } from "./utils/sessionManager.js";
import { log } from "console";

config({
  path: ".env",
});

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await db.sequelize.sync();
    console.log("Sync db");

    const server = app.listen(port, () => {
      console.log(`server is running on port ${port}...`);
    });

    const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
      },
    });

    io.engine.on("connection_error", console.log);

    // io.on("connection", (socket) => {
    //   // console.log("Connected to socket.io");
    //   const shell = 'zsh';

    // const ptyProcess = pty.spawn(shell, [], {
    //     name: 'xterm-256color',
    //     cols: 140,
    //     rows: 36,
    //     cwd: process.env.HOME,
    //     env: process.env
    //   });

    //   socket.on('join', ({sessionId, initialDirectory=process.env.HOME}) => {
    //   id = id;
    //   ptyProcess = pty.spawn('zsh', [], {
    //     name: 'xterm-256color',
    //     cols: 140,
    //     rows: 64,
    //     cwd: initialDirectory,
    //     env: process.env
    //   });
    //   console.log('PTY process spawned with PID:', ptyProcess.pid);

    //   ptyProcess.onData((data) => {
    //     socket.emit('shell:data', { data } );
    //   });
    // })

    //   socket.on('shell:input', (message) => {
    //     ptyProcess.write(message.command);
    //   });

    //   socket.on('shell:resize', (message) => {
    //     ptyProcess.resize(message.cols, message.rows);
    //   });

    //   socket.on('close', () => {
    //     ptyProcess.kill();
    //   });

    //   ptyProcess.onData((data) => socket.emit("shell:data", { data }));
    // })
    // io.engine.on("connection_error", console.log)

    io.on("connection", (socket) => {
      socket.on(
        "join",
        async ({ sessionId, initialDirectory = process.env.HOME }) => {
          const session = sessionManager.getSession(sessionId);
          if (session) {
            session.addClient(socket);
            console.log(`client reconnected: ${initialDirectory}`);
            // session.write('\r');

            socket.emit("reconnected", { sessionId });
          } else {
            // socket.emit('error', { message: 'Session not found' });
            // console.log(`${process.env.HOME}/shells/${initialDirectory}`);
            const session = sessionManager.createSession(
              sessionId,
              `${process.env.HOME}/shells/${initialDirectory}`,
            );
            session.addClient(socket);

            socket.emit("connected", { sessionId });
            // session.write('\r');
          }
        },
      );

      socket.on("shell:input", ({ command, id, initialDirectory }) => {
        // log("cmd:::", id);
        // log("cmd:::", String(command));
        const session = sessionManager.getSession(id);
        if (session) {
          // console.log('in session', command);

          session.write(command);
        } else {
          // console.log('no session');
          const session = sessionManager.createSession(
            id,
            `${process.env.HOME}/shells/${initialDirectory}`,
          );
          session.addClient(socket);
          session.write(command);
        }
      });

      socket.on("shell:resize", ({ cols, rows, initialDirectory, id }) => {
        log("resize:::", cols, rows, initialDirectory, id);
        const session = sessionManager.getSession(id);
        if (session) {
          log("resize if");
          session.resize(cols, rows);
        } else {
          // console.log('no session');
          log("resize else");
          const session = sessionManager.createSession(
            id,
            `${process.env.HOME}/shells/${initialDirectory}`,
          );
          session.addClient(socket);
          session.resize(cols, rows);
        }
      });

      socket.on("cleanup", ({ sessionId }) => {
        console.log(`Cleanup event received for session ${sessionId}`);

        const session = sessionManager.getSession(sessionId);
        if (session) {
          // Perform any necessary cleanup for the session
          // session.removeClient(socket);
          // sessionManager.removeClient(socket);
          // session.kill();
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
        // log(session)
        // sessionManager.removeClient(socket);
      });
    });
  } catch (error) {
    console.log("errrooorrrr-----============");

    console.log(error);
  }
};

start();

