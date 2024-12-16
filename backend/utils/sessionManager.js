import pty from 'node-pty';

class Session {
  clients = new Set();

  constructor(id, initialDirectory=process.env.HOME) {
    this.id = id;
    this.ptyProcess = pty.spawn('zsh', [], {
      name: 'xterm-256color',
      cols: 140,
      rows: 64,
      cwd: initialDirectory,
      env: process.env
    });
    console.log('PTY process spawned with PID:', this.ptyProcess.pid);

    this.ptyProcess.onData((data) => {      
      this.sendToClients('shell:data', {data} );
    });
  }

  addClient(socket) {
    this.clients.add(socket);
  }

  removeClient(socket) {
    this.clients.delete(socket);
  }

  write(message) {   
    console.log(`PTY writting ${message}`);
     
    this.ptyProcess.write(message);
  }

  resize(cols, rows) {
    this.ptyProcess.resize(cols, rows);
  }

  kill() {
    this.ptyProcess.kill();
  }

  sendToClients(event, data) {
    // console.log('Sending event:', event, 'with data:', data);
    
    for (let client of this.clients) {
      client.emit(event, data);
    }
  }

  changeDirectory(path) {
    this.write(`cd ${path}\r`);
  }
}

class SessionManager {
  terminals = {}
  constructor() {
    this.sessions = new Map();
    this.tabCounter = 1
  }

  createSession(id, initialDirectory=process.env.HOME) {
    const session = new Session(id, initialDirectory);
    // session.write('\r');
    this.sessions.set(id, session);
    this.terminals[id] = session
    return session;
  }

  getSession(id) {
    // console.log(`PTY GetSession:: ${JSON.stringify(this.terminals[id])}`);
    
    // return this.sessions.get(id);
    return this.terminals[id];
  }

  getSessionBySocket(socket) {
    for (let [id, session] of this.terminals) {
      if (session.clients.has(socket)) {
        return session;
      }
    }
    return null;
  }

  removeClient(socket) {
    for (let session of this.sessions.values()) {
      session.removeClient(socket);
    }
  }
}

export const sessionManager = new SessionManager();