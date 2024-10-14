import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import User from "../../models/User";
import {TmdbService} from "../../utils/TmdbService";
import {IMovie} from "../../models/Movie";
import Review, {IReview} from "../../models/Review";
import {HydratedDocument} from "mongoose";

export default class UserReviewRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username, movieId} = <{ username: string, movieId: number }>req.params;
        const {rating, review} = <{ rating: number, review: string }>req.body;

        const user = await User.findByUsername(username, reply);

        if (!user) {
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "User not found",
                data: []
            });
        }

        const r: HydratedDocument<IReview> = await Review.create({rating, review});

        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "Review successfully added !",
            data: r
        });

    }
}