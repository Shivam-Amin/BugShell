import bcrypt from'bcrypt';
import { sendCookie } from "../utils/features.js";
import { ErrorHandler } from "../middleware/err.js";

import db from '../models/index.js';
import { generateUUID } from '../utils/idGenrator.js';
import { where } from 'sequelize';
import { exec } from 'child_process'
import { sessionManager } from '../utils/sessionManager.js';
import { log } from 'console';

export const CreateSession = async (req, res, next) => {
  try {
    let name = req.body.name.trim();
    const { username } = req.user;

    if (name == "") {
      return next(new ErrorHandler("Shell-Name already exist...", 404));
    }
    
    // check for a user exists with same email
    let folder = await db.shellFolders.findOne({ 
      where: { 
        folder_name: name, 
        username: username
      }});

  
    if (folder) {
      return next(new ErrorHandler("Shell-Name already exist...", 404));
    }
  
    const uuid = await generateUUID(db.shellFolders);

    // ADD NEW FOLDER TO DB
    await db.shellFolders.create({ 
      _id: uuid, 
      folder_name: name, 
      username: username, 
      github_id: null,
      github_username: null,
      auth_provider: 'local' 
    });

    exec(`bash ./scripts/create_shellsFolder.sh ${name}`, (error, stdout, stderr) => {
      console.log( stdout, stderr)
      if (error) {
        console.log("error", error);
        return
      }
      return
    })
  
    // sendCookie(user, res, "Registered Successfully!", 201);
    return res.status(201).json({
        success: true,
        message: 'Shell Created Successfully!'
    })
  } catch (error) {
    console.log(error);
    
    next(error);
  }
}
export const DeleteSession = async (req, res, next) => {
  try {
    const { id, name }  = req.body;
    const { username } = req.user;

    if (!id || name == "") {
      return next(new ErrorHandler("Shell doesn't exist...", 404));
    }
    
    // check for a user exists with same email
    let folder = await db.shellFolders.findOne({ 
      where: { 
        _id: id, 
        folder_name: name,
        username: username
      }
    });

  
    if (!folder) {
      return next(new ErrorHandler("Shell doesn't exist...", 404));
    }

    exec(`bash ./scripts/delete_folder.sh ${folder.folder_name}`, (error, stdout, stderr) => {
      console.log(stdout, stderr)
      if (error) {
        console.log("error", error);
        return
      }
      return
    })

    await db.shellFolders.destroy({ 
      where: { 
        _id: id, 
        folder_name: name,
        username: username
      }
    });
  
    // sendCookie(user, res, "Registered Successfully!", 201);
    return res.status(201).json({
        success: true,
        message: 'Shell deleted Successfully!'
    })
  } catch (error) {
    console.log(error);
    next(error);
  }
}


export const  OpenShellSession = async (req, res, next) => {
  try {
    const { name, id } = req.params;
    const { username } = req.user;
    console.log(name, id);
    
    // change directory to folder if it exists
    // else error
    let folder = await db.shellFolders.findOne({ 
      where: { 
        _id: id,  
        folder_name: name, 
        username: username
      }}
    );

  
    if (!folder) {
      return next(new ErrorHandler("Shell not found!", 404));
    }

    const sessionPath = path.join(`$HOME/shells`, name);
    let session = sessionManager.getSession(id);

    if (!session) {
      session = sessionManager.createSession(id, sessionPath);
    } else {
      session.changeDirectory(sessionPath);
    }
  
    return res.status(201).json({
        success: true,
        message: 'Shell Created Successfully!'
    })
  } catch (error) {
    next(error);
  }
}

export const getShells = async (req, res, next) => {
  try {
    let { username } = req.user;
    
    // const { token } = req.cookies;

    // Check whether a folder exist with the Updated Name.
    let shells = await db.shellFolders.findAll({
      where: {
        username,
        auth_provider: 'local'
      },
      order: [
        ['createdAt', 'DESC']
      ]
    });
    
    res.status(201).json({
      success: true,
      shells: shells,
    })
  } catch (error) {
    next(error)
  }
}

export const CheckTools = async (req, res, next) => {
  try {
    // let name = req.body.name.trim();
    const { username } = req.user;

    log("in tools...")
    if (username) {
      // var successMessage, error
      new Promise((resolve, reject) => {
        exec(`bash ./scripts/setup_tools.sh`, (error, stdout, stderr) => {
          console.log('stdout: ', stdout)
          // console.log('error: ', error)
          // console.log('stderr: ', stderr)

          // // successMessage = stdout
          // if (error) {
          //   console.log("error", error);
          //   // error = error
          //   return
          // }

          if (error) {
            return next(new ErrorHandler(`Execution error: ${error.message}`, 500));
          }

          if (stderr) {
            // return res.status(400).json({
            //   success: false,
            //   message: `Execution error (stderr): ${stderr}`
            // });
            return next(new ErrorHandler(`Execution error (stderr): ${stderr}`, 400));

          }
          
          return res.status(201).json({
            success: true,
            message: 'Tools setup successfully!',
            // output: stdout,  // Include the command's output if needed
          });
        })
      });
    
      // // sendCookie(user, res, "Registered Successfully!", 201);
      // return res.status(201).json({
      //     success: true,
      //     message: 'tools setup finished!'
      // })
    } else {
      return next(new ErrorHandler("Not authenticated!", 404));
    }
  } catch (error) {
    console.log(error);
    
    next(error);
  }
}