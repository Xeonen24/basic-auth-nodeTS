import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGOURL!, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as any)
        .then(() => console.log("MongoDB Connected"))
        .catch((error) => {
            console.log("Error in DB connection");
            console.error(error);
        });
};

export default connect;