import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import {HydratedDocument} from "mongoose";
import User, {IUser} from "../../models/User";

export default class LoginRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {emailOrUsername, password} = <{ emailOrUsername: string, password: string }>req.body;

        // Find the user with the email or username
        const user: HydratedDocument<IUser> | null = await User.findByUsername(emailOrUsername) ?? await User.findByEmail(emailOrUsername);
        if (!user) {
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "Couldn't find user with email or username: " + emailOrUsername,
                data: []
            });
        }

        //@ts-ignore
        if (!await user.comparePassword(password)) {
            return reply.code(401).send({
                error: true,
                statusCode: 401,
                message: "The password doesn't match !",
                data: []
            });
        }

        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "Successfully logged in user",
            data: {
                //@ts-ignore
                user: user.withoutPassword(),
                //@ts-ignore
                token: await user.generateToken()
            }
        });

    }
}