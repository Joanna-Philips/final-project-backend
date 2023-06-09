import mongooseConnection from "../../database/mongoose";

const AvatarSchema = new mongooseConnection.Schema({
    style: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    img_src: {
      type: String,
      required: true
    }
  });
  
  const Avatar = mongooseConnection.model("Avatar", AvatarSchema);
  
  export default Avatar;