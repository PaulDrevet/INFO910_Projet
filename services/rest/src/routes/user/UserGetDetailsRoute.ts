import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import User from "../../models/User";
import {TmdbService} from "../../utils/TmdbService";

export default class UserGetDetailsRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username} = <{ username: string }>req.params;

        const user = await User.findByUsername(username, reply);
        const tmdb: TmdbService = new TmdbService();

        user.following = await User.find({_id: {$in: user.following}});
        user.followers = await User.find({_id: {$in: user.followers}});

        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "User successfully retrieved !",
            data: user
        });
    }
}