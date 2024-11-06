import {CallbackWithoutResultAndOptionalError, HydratedDocument, Model, model, Schema, Types} from 'mongoose';
import {generateRidiculousName} from "../utils/utils";
import {FastifyReply} from "fastify";
import Main from "../Main";

export interface IUser {
    _id: Types.ObjectId,
    email: string,
    password: string,
}

interface UserModel extends Model<IUser> {
    findByUsername(username: string, reply?: FastifyReply): Promise<any>;
    findByEmail(email: string): Promise<any>;
    updateByUsername(username: string, user: IUser): Promise<any>;
    deleteByUsername(username: string): Promise<any>;
}

const userSchema = new Schema<IUser, UserModel>({
        email: {
            type: "String", required: true, unique: true,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v: string) {
                    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: "Please enter a valid email"
            },
            index: true,
        },
        password: {
            type: "String",
            required: true,
        },
    }, {
        versionKey: false,
        statics: {
            async findByUsername(username: string): Promise<any> {
                return this.findOne({username});
            },
            async findByEmail(email: string): Promise<any> {
                return this.findOne({email});
            },
            updateByUsername(username: string, user: IUser): Promise<any> {
                return this.findOneAndUpdate({username}, user, {new: true});
            },
            deleteByUsername(username: string): Promise<any> {
                return this.findOneAndDelete({username});
            },
        },
        methods: {
            withoutPassword(): Omit<IUser, "password"> {
                const {password, ...user} = this.toJSON();
                return user;
            }
        }
    }
)

/**
 * Hash the password before saving the user
 * @param next {CallbackWithoutResultAndOptionalError} Callback to call next middleware
 */
userSchema.pre("save", async function (next: CallbackWithoutResultAndOptionalError) {
    if (this.isModified('password')) {
        this.password = await Main.getWebServer().getServer().bcrypt.hash(this.password);
    }
    next();
})

const capitalizeName = (name: string) => {
    return name.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

export default model<IUser, UserModel>('User', userSchema, 'users');