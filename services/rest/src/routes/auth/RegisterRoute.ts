import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import {HydratedDocument} from "mongoose";
import User, {IUser} from "../../models/User";

export default class RegisterRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username, firstname, lastname, email, password, passwordConfirmation} = <{ username: string, firstname: string, lastname: string, email: string, password: string, passwordConfirmation: string }>req.body;

        const user: HydratedDocument<IUser> | null = await User.findByUsername(username) ?? await User.findByEmail(email);
        if(user){
            return reply.code(409).send({
                error: true,
                statusCode: 409,
                message: "User already exists",
                data: []
            });
        }

        if(password !== passwordConfirmation){
            return reply.code(400).send({
                error: true,
                statusCode: 400,
                message: "Passwords don't match",
                data: []
            });
        }

        const u: HydratedDocument<IUser> = await User.create({username, firstname, lastname, email, password});
        return reply.code(201).send({
            error: false,
            statusCode: 201,
            message: "User successfully created !",
            data: u
        });

    }
}