import mongoose, {connect, Connection} from "mongoose";
import Main from "../Main";

export default class MongoManager {

    private mongo?: Connection;

    public async connect() {
        try {
            mongoose.set("strictQuery", true);
            console.log(process.env.MONGO_URI ?? "mongodb://root:example@localhost:27017/test?authSource=admin")
            this.mongo = (await connect(process.env.MONGO_URI ?? "mongodb://root:example@localhost:27017/test?authSource=admin")).connection
            this.mongo?.useDb("aegis")
            Main.getLogger().info("Successfully connected to MongoDB !");
        } catch (error) {
            throw new Error("Cannot connect to MongoDB: " + error);
        }
    }

    public getMongo() {
        return this.mongo;
    }

}