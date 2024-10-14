import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import User from "../../models/User";
import Review, {IReview} from "../../models/Review";
import {HydratedDocument} from "mongoose";
import Answer, {IAnswer} from "../../models/Answer";

export default class UserAnswerRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username, reviewId} = <{ username: string, reviewId: number }>req.params;
        const {answer} = <{ answer: string }>req.body;

        const user = await User.findByUsername(username, reply);
        let review: HydratedDocument<IReview> | HydratedDocument<IAnswer> | null = await Review.findById(reviewId) ?? await Answer.findById(reviewId);

        if (!user) {
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "User not found",
                data: []
            });
        }

        if(!review){
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "Review/Answer not found",
                data: []
            });
        }

        const r: HydratedDocument<IAnswer> = await Answer.create({content:answer, });

        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "Review successfully added !",
            data: r
        });

    }
}