import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../main';
import '../css/ContextMenu.css'
import { HomeContext } from './Home';
import ModifiedP from './ui/ModifiedP';

const ContextMenu = ({ x, y, visible, onItemClick }) => {
  const { setHomeLoading, contextMenu, setContextMenu } = useContext(Context)
  
  const { contextMenuItems, rightClickOnFolder, setRightClickOnFolder,
    cmWidth, cmHeight } = useContext(HomeContext)

  if (!visible) {
    return null;
  }

  const style = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    width: `${cmWidth}px`,
    height: `${cmHeight}px`,
    padding: '2px',
    // backgroundColor: 'white',
    // border: '1px solid purple',
    borderRadius: '4px',
    // boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
    boxShadow: '0 0 9px 2px rgba(0, 0, 0, 0.1)',
    zIndex: 2,
  };

  return (
    <div 
      style={style} 
      className="context-menu" >
      {contextMenuItems.map((item, index) => {
        const { title, span_title } = item;

        return (
          <div
            key={index}
            onClick={(e) => {
              // setHomeLoading(true)
              e.stopPropagation();
              setContextMenu({
                visible: false,
                x: 0, y: 0,
              });
              onItemClick(item.title)
            }} >
            <ModifiedP text={title} span_text={span_title} />
          </div>
        )})}
    </div>
  );
};

export default ContextMenu;