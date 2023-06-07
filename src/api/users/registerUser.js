import express from "express";
import userDb from "./userDb";
import bcrypt from "bcrypt";
import equipmentDb from "../equipments/equipmentDb";

const router = express.Router();

router.post("/", async (req, res) => {
    const { username, password } = req.body;
  
    const usernameRegex = /^[a-zA-Z0-9.\-_]+$/;
    
    if (!usernameRegex.test(username)) {
      res.status(401).json({
        success: false,
        response: "Username cannot contain special characters or spaces"
      });
      return;
    }
    
  try {
      const salt = bcrypt.genSaltSync();
      const newUser = await new userDb({
        username: username,
        password: bcrypt.hashSync(password, salt)
      }).save();
      const unarmed = await equipmentDb.findOne({ name: 'Unarmed' });
      newUser.userWeapons.push(unarmed._id);
      await newUser.save();

      res.status(201).json({
        success: true,
        response: {
          username: newUser.username,
          id: newUser._id,
          accessToken: newUser.accessToken
        }
      })
    }
   
   catch (e) {
      res.status(400).json({
        success: false,
        response: "Username taken, try another one",
      })
    }
})

export default router;