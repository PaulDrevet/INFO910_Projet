import { FastifyReply, FastifyRequest } from "fastify";
import { AbstractRoute } from "../AbstractRoute";
import { HydratedDocument } from "mongoose";
import User, { IUser } from "../../models/User";
import Main from "../../Main";

export default class UserRegisterRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {email, password} = <{ email: string, password: string }>req.body;

        const user: HydratedDocument<IUser> | null = await User.findOne({email});
        if (user) {
            return reply.code(409).send({error: "Cette adresse email est déjà utilisée"});
        }

        const newUser = new User({email, password});
        await newUser.save();

        const token: string = Main.getWebServer().getServer().jwt.sign({ email });

        return reply.code(201).send({message: "Utilisateur créé avec succès", token});



    }

}