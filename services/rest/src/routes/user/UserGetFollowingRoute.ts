import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import User, {IUser} from "../../models/User";
import {HydratedDocument} from "mongoose";

export default class UserGetFollowingRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username} = <{ username: string }>req.params;

        const user = await User.findByUsername(username, reply);
        if(!user){
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "User not found",
                data: []
            });
        }

        const following = await User.find({_id: {$in: user.following}});
        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "User following successfully retrieved !",
            data: user.populate("following")
        });




    }
}