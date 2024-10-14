import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import User from "../../models/User";
import {TmdbService} from "../../utils/TmdbService";
import {IMovie} from "../../models/Movie";

export default class UserGetWatchlistRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username} = <{ username: string }>req.params;

        const user = await User.findByUsername(username, reply);

        if (!user) {
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "User not found",
                data: []
            });
        }

        const tmdb: TmdbService = new TmdbService();
        const watchlist: IMovie[] = await Promise.all(user.watchlist.map((movieId: number) => tmdb.getMovieDetails(movieId)));

        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "Watchlist successfully retrieved !",
            data: watchlist
        });
    }
}