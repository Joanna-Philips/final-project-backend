import userDb from "./userDb";

const authenticateUser = async (req, res, next) => {
    const accessToken = req.header("Authorization");
    try {
      const user = await userDb.findOne({ accessToken: accessToken });
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({
          success: false,
          response: "Please log in",
        });
      }
    } catch (e) {
      res.status(500).json({
        success: false,
        response: e,
      });
    }
  };

export default authenticateUser;