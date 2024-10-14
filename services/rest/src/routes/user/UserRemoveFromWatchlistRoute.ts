import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import User from "../../models/User";
import {TmdbService} from "../../utils/TmdbService";
import {IMovie} from "../../models/Movie";

export default class UserRemoveFromWatchlistRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username, movieId} = <{ username: string, movieId: number }>req.params;

        const user = await User.findByUsername(username, reply);

        if (!user) {
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "User not found",
                data: []
            });
        }

        user.watchlist = user.watchlist.filter((movie: number) => movie !== movieId);
        user.markModified("watchlist");
        await user.save();

        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "User successfully retrieved !",
            data: user.watchlist
        });
    }
}