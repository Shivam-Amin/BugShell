import { v4 as uuidv4 } from 'uuid';

export const generateUUID = async (Model) => {
    let uuid = uuidv4();
    // console.log(Model);
    let ModelExist = await Model.findOne({ 
        where: { _id: uuid } 
    });

    while (ModelExist) {
        uuid = uuidv4();
        ModelExist = await Model.findOne({ where: { _id: uuid } });
    }

    return uuid;
};