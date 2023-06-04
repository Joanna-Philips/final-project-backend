import express from "express";
import userDb from "./userDb";

const router = express.Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
  
      try {
        const user = await userDb.findOne({ username: username });
        if (user && bcrypt.compareSync(password, user.password)) {
          res.status(200).json({
            success: true,
            response: {
              username: user.username,
              id: user._id,
              accessToken: user.accessToken,
            },
          });
        } else {
          res.status(400).json({
            success: false,
            response: "Credentials do not match",
          });
        }
      } catch (e) {
        res.status(500).json({
          success: false,
          response: e,
        });
      }
    }
  );

  export default router;