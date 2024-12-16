import React, { useRef, useEffect } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import 'xterm/css/xterm.css'
import '../../CSS/xterm.css'

function useBind(termRef, handler, eventName) {
  useEffect(() => {
    if (!termRef.current || typeof handler !== "function") return;
    const term = termRef.current;
    const eventBinding = term[eventName](handler);

    return () => {
      if (!eventBinding) return;
      eventBinding.dispose();
    };
  }, [handler]);
}

export const Xterm = ({
  socket,
  className,
  options,
  addons,
  onBell,
  onBinary,
  onCursorMove,
  onData,
  onKey,
  onLineFeed,
  onRender,
  onResize,
  onScroll,
  onSelectionChange,
  onTitleChange,
  onWriteParsed,
  customKeyEventHandler,
  onInit,
  onDispose,
  id,
  folderName,
}) => {
  const divRef = useRef(null);
  const xtermRef = useRef(null);

  useEffect(() => {
    // console.log("OPTIONS");
    
    if (!divRef.current) return;

    const xterm = new Terminal({ 
        rows: 40,
        cols: 200, 
        cursorBlink: true,
    });

    xterm.options = {
      fontSize: 16,
      // fontWeight: "bold",
      fontFamily: 'Ubuntu Mono, monospace, sans-serif',     
       
    }
  
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    // fitAddon.fit();

    // Load addons if the prop exists.
    if (addons) {
      addons.forEach((addon) => {
        xterm.loadAddon(addon);
      });
    }

    // Add Custom Key Event Handler if provided
    if (customKeyEventHandler) {
      xterm.attachCustomKeyEventHandler(customKeyEventHandler);
    }

    xtermRef.current = xterm;
    xterm.open(divRef.current);
    fitAddon.fit();
    // xterm.reset();
    
    
    xterm.onResize((size) => {
      socket?.emit("shell:resize", { cols: size.cols, rows: size.rows, initialDirectory:folderName, id:id });
      fitAddon.fit();
      console.log(size);
      // console.log('djfklsj');
    });
    
    
    // -------------------- Resize -----------------------------
    // Add ResizeObserver to handle container resizing
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit(); // Resize terminal when container size changes
    });
    resizeObserver.observe(divRef.current); // Start observing the container

    // Handle initial socket resize event after fit
    socket?.emit("shell:resize", {
      cols: xterm.cols,
      rows: xterm.rows,
      initialDirectory: folderName,
      id: id,
    });
    
    fitAddon.fit();
    // lastly set focus to terminal
    xterm.focus();


    return () => {
    //   // Cleanup observer and terminal instance on unmount
    //   // -------------------- Resize -----------------------------
    //   resizeObserver.unobserve(divRef.current); // Stop observing
      if (typeof onDispose === "function") onDispose(xterm);
      try {
        console.log('disposeEEEEE');
        resizeObserver.disconnect(); 
        xterm?.dispose();
        
      } catch (e) {
        console.log(e);
      }
      xtermRef.current = null;
    };
  }, [options]);

  useBind(xtermRef, onBell, "onBell");
  useBind(xtermRef, onBinary, "onBinary");
  useBind(xtermRef, onCursorMove, "onCursorMove");
  // useBind(xtermRef, onDispose, "onDispose");
  useBind(xtermRef, onData, "onData");
  useBind(xtermRef, onKey, "onKey");
  useBind(xtermRef, onLineFeed, "onLineFeed");
  useBind(xtermRef, onRender, "onRender");
  useBind(xtermRef, onResize, "onResize");
  useBind(xtermRef, onScroll, "onScroll");
  useBind(xtermRef, onSelectionChange, "onSelectionChange");
  useBind(xtermRef, onTitleChange, "onTitleChange");
  useBind(xtermRef, onWriteParsed, "onWriteParsed");

  useEffect(() => { 
    if (!xtermRef.current) return;
    if (typeof onInit !== "function") return;
    onInit(xtermRef.current);

  }, [xtermRef.current]);

  useEffect(() => {
    console.log(divRef?.current?.getBoundingClientRect());
  }, [divRef?.current?.getBoundingClientRect()])

  return <div style={{width: '100%', height:'100%'}} id={id} className={className} ref={divRef} />;
};

// export default Xterm;