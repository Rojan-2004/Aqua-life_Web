import app from "./src/app";
import { PORT } from "./src/configs/constant";
import { connectToMongoDB } from "./src/database/mongodb";

connectToMongoDB();

app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(`Server: http://localhost:${PORT}`);
        console.log(`Network: http://192.168.100.76:${PORT}`);
    }
);