
import { createServer } from "http";

import app from "./app";

const server = createServer(app);

const PORT = process.env.PORT || 8080;

server.listen(PORT, error => {

    if (error) {
        return console.log(error);
    }

    console.log("🚀 Server started on port " + PORT);

});
