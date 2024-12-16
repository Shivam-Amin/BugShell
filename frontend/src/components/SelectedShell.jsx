import React, { useCallback, useContext, useEffect, useState } from "react";
import { Context, server } from "../main.jsx";
import axios from "axios";
import io from "socket.io-client";
import { Xterm } from "./xterm/Xterm.jsx";

import default_user_logo from "../assets/default_user_logo.jpg";
// import './../CSS/xterm.css';
import "xterm/css/xterm.css";
import ModifiedP from "./ui/ModifiedP.jsx";
import toast from "react-hot-toast";
import Loading from "./Loading.jsx";
import "../CSS/selectedShell.css";
import { useSearchParams } from "react-router-dom";
// import { IoMdHelp } from "react-icons/io";
import { MdAdd } from "react-icons/md";

const EndPoint = "http://localhost:5000";

const SelectedShell = () => {
  const {
    isAuth,
    setIsAuth,
    user,
    gitUser,
  } = useContext(Context);

  const [socket, setSocket] = useState(null);
  const [terminalReset, setTerminalReset] = useState(false);
  const [loading, setLoading] = useState(isAuth ? false : true);
  const [help, setHelp] = useState(false);
  const [terminal, setTerminal] = useState(null);

  const [terminalTabs, setTerminalTabs] = useState([{
    id: 1,
    socket: null,
    terminal: null,
  }]);
  const [activeTab, setActiveTab] = useState(1); // Track the active tab

  const [searchParams] = useSearchParams();
  const folderName = searchParams.get("folderName");
  const id = searchParams.get("id");

  const aiHelp = [
    { command: ":ai", description: "Ask ai anything." },
    {
      command: ":ai -t <task>",
      description:
        "Based on the prompt, generates commands that directly executes in the terminal",
    },
    {
      command: ":ai -f <file>",
      description: "Provide a file path to include its content as context.",
    },
    {
      command: ":ai -d <dir>",
      description: "Provide a directory path to include all files as context",
    },
    {
      command: ":ai -c",
      description:
        'Starts an context-based interactive chat window (type "exit" to exit)',
    },
  ];

  // const terminalRef = useRef(null);
  // const [ws, setWs] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      console.log(event);

      event.returnValue = "The session will get expire!!"; // Required for the alert to show in some browsers
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // setTerminal(null);
    };
  }, []);

  useEffect(() => {
    // connect socket to backend
    const newSocket = io(EndPoint);
    setSocket(newSocket);

    // return () => {
    //   if (newSocket || socket) {
    //     console.log('useEffect ended.');

    //     newSocket.emit('cleanup', { sessionId: id })

    //     // newSocket.disconnect()
    //     newSocket.off('shell:data');
    //     newSocket.off('error');
    //     setSocket(null)
    //     // setTerminal(null);
    //   }
    // }
  }, [globalThis.location.pathname]);

  const onInit = useCallback((term) => {
    setTerminal(term);

    term.reset();
    setTerminalReset(false);
    console.log(`reset:: ${terminalReset}`);

    if (!terminalReset) {
      // console.log('aldfjdlkfj');

      writeIcon(term);
      // term.writeln("\x1b[1;38;5;28m__________              \x1b[0m\x1b[1;38;5;55m_________.__           .__  .__   \x1b[0m");
      // term.writeln("\x1b[1;38;5;28m\\______   \\__ __  ____\x1b[0m\x1b[1;38;5;55m /   _____/|  |__   ____ |  | |  |  \x1b[0m");
      // term.writeln("\x1b[1;38;5;28m |    |  _/  |  \\/ ___\\\x1b[0m\x1b[1;38;5;55m\\_____  \\ |  |  \\_/ __ \\|  | |  |  \x1b[0m");
      // term.writeln("\x1b[1;38;5;28m |    |   \\  |  / /_/  >\x1b[0m\x1b[1;38;5;55m        \\|   Y  \\  ___/|  |_|  |__\x1b[0m");
      // term.writeln("\x1b[1;38;5;28m |______  /____/\\___  \x1b[0m\x1b[1;38;5;55m/_______  /|___|  /\\___  >____/____/\x1b[0m");
      // term.writeln("\x1b[1;38;5;28m        \\/     /_____/\x1b[0m\x1b[1;38;5;55m        \\/      \\/     \\/           \x1b[0m");
      // term.writeln("");
      // term.writeln("\r")
      // term.reset();
      setTerminalReset(true);
    }
  }, [terminalReset]);

  const onDispose = useCallback(() => {
    console.log("SelectShell disposeEEEE");

    setTerminal(null);
  }, []);

  const onData = (data) => {
    if (!terminal) return;
    // terminal.write(data);
    // console.log(data);

    socket.emit("shell:input", {
      command: data,
      id,
      initialDirectory: folderName,
    });
  };

  useEffect(() => {
    // let newSocket
    if (!socket) {
      console.log("socket not initialized");
    }
    if (!terminal) {
      console.log("terminal not initialized");
    }

    // if (socket && terminal) return;
    if (!socket) return;

    if (socket) {
      console.log("socket is there");
    }
    if (terminal) {
      console.log("terminal is there");
    }

    // console.log('socket, terminal');
    if (socket) {
      console.log("in socket joining");

      socket.emit("join", { sessionId: id, initialDirectory: folderName });

      // socket.emit("shell:input", { command: "\r", id: id, initialDirectory: folderName });

      socket.on("connected", ({ sessionId }) => {
        if (!terminal) return;
        console.log("connected");

        // NOTE: when running terminal first time, like when the init func. is called,
        // even if you don't emit \r in shell:input it'll create a new line ready to run cmd.
        // so, as the temrinalReset variable is set to true in init function,
        // use it to check whether it's the fisrt time terminal is setting up or not.
        // and addd a new line if it's reopening.
        terminal.writeln(`Connected to session ${sessionId}`);
        // if (terminalReset) {
        //   socket.emit("shell:input", { command: "\r", id: id, initialDirectory: folderName });
        // }
      });

      socket.on("reconnected", ({ sessionId }) => {
        if (!terminal) return;
        console.log("reconnected");
        terminal.reset();
        writeIcon(terminal);

        // NOTE: when running terminal first time, like when the init func. is called,
        // even if you don't emit \r in shell:input it'll create a new line ready to run cmd.
        // so, as the temrinalReset variable is set to true in init function,
        // use it to check whether it's the fisrt time terminal is setting up or not.
        // and addd a new line if it's reopening.
        terminal.write(`Connected to session ${sessionId}`);

        socket.emit("shell:input", {
          command: "\r",
          id: id,
          initialDirectory: folderName,
        });
      });

      socket.on("shell:data", (message) => {
        // console.log(message);
        // console.log('Shell data received on frontend:', message);
        if (!terminal) {
          console.log("NO TERMINAL..");
          return;
        }
        terminal.write(message.data);
      });

      socket.on("error", ({ message }) => {
        if (!terminal) return;
        terminal.write(`Error: ${message}\r\n`);
      });
    }

    return () => {
      if (socket) {
        socket.emit("cleanup", { sessionId: id });

        // socket.disconnect();
        socket.off("shell:data");
        socket.off("error");
        setSocket(null);
        setTerminal(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminal, socket]);

  function writeIcon(t) {
    t.writeln(
      "\x1b[1;38;5;28m__________              \x1b[0m\x1b[1;38;5;55m_________.__           .__  .__   \x1b[0m",
    );
    t.writeln(
      "\x1b[1;38;5;28m\\______   \\__ __  ____\x1b[0m\x1b[1;38;5;55m /   _____/|  |__   ____ |  | |  |  \x1b[0m",
    );
    t.writeln(
      "\x1b[1;38;5;28m |    |  _/  |  \\/ ___\\\x1b[0m\x1b[1;38;5;55m\\_____  \\ |  |  \\_/ __ \\|  | |  |  \x1b[0m",
    );
    t.writeln(
      "\x1b[1;38;5;28m |    |   \\  |  / /_/  >\x1b[0m\x1b[1;38;5;55m        \\|   Y  \\  ___/|  |_|  |__\x1b[0m",
    );
    t.writeln(
      "\x1b[1;38;5;28m |______  /____/\\___  \x1b[0m\x1b[1;38;5;55m/_______  /|___|  /\\___  >____/____/\x1b[0m",
    );
    t.writeln(
      "\x1b[1;38;5;28m        \\/     /_____/\x1b[0m\x1b[1;38;5;55m        \\/      \\/     \\/           \x1b[0m",
    );
    t.writeln("");
  }

  // useEffect(() => {
  //   socket.on("data", (socket) => {
  //     console.log(socket);
  //   })
  // })

  const handleLogoutClick = async () => {
    try {
      const { data } = await axios.get(`${server}/users/logout`, {
        withCredentials: true,
      });
      setIsAuth(false);
      toast.success(data.message);
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const addTab = () => {
    console.log("addtab");
  };

  if (loading) {
    // return <div>
    //   <p>Loading...</p>
    // </div>
    return <Loading />;
  }

  if (!folderName || !id) {
    return (
      <div>
        <p>Error...</p>
      </div>
    );
  }

  return (
    <div className="selected_shell">
      {
        /* <div style={{width: '100%', height: '100%'}} >
            <div ref={terminalRef} style={{width: '100%', height: '100%'}} />
          </div> */
      }

      <div className="header">
        <div className="user_info">
          <img className="user_logo" src={default_user_logo} alt="sjdklj" />
          <ModifiedP text={user ? user.username : gitUser} />
        </div>

        <div className="menu menu_logout">
          <ModifiedP
            span_text="$echo /"
            text="help"
            onclick={() => {
              console.log("Help clicked");
              setHelp((prev) => !prev);
            }}
          >
            <div
              className="quick_tips"
              style={{ display: help ? "block" : "none" }}
            >
              <p>Quick Tips:</p>
              <p>
                • Type{" "}
                <b>
                  <i>nvim</i>
                </b>{" "}
                to use neovim.
              </p>
              {aiHelp.map((item, index) => (
                <React.Fragment key={index}>
                  <p>
                    •{" "}
                    <b>
                      <i>{item.command}</i>
                    </b>{" "}
                    - {item.description}
                  </p>
                </React.Fragment>
              ))}
            </div>
          </ModifiedP>
          <ModifiedP
            span_text="$cd /"
            text="logout"
            onclick={handleLogoutClick}
          />
        </div>
      </div>

      <div className="main">
        <div className="tabs">
          <div className="tab 1">
            <button type="radio" id="1" value="1" aria-checked={true}></button>
            <label htmlFor="1">Terminal 1</label>
          </div>

          <div className="add_tab" onClick={addTab}>
            <MdAdd className="svg" />
          </div>
        </div>

        <div className="term_container">
          <Xterm
            className="terminal"
            onInit={onInit}
            onDispose={onDispose}
            onData={onData}
            socket={socket}
            id={id}
            folderName={folderName}
            // onResize={({ rows, cols }) => {
            //   console.log(rows, cols);
            //   socket.emit("shell:resize", { rows, cols });
            // }}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectedShell;

