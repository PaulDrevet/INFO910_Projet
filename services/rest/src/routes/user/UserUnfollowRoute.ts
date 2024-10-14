import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import User, {IUser} from "../../models/User";
import {HydratedDocument} from "mongoose";

export default class UserUnfollowRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username, unfollowedUsername} = <{ username: string, unfollowedUsername: string }>req.params;

        const user = await User.findByUsername(username, reply);
        if(!user){
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "User not found",
                data: []
            });
        }

        const followedUser = await User.findByUsername(unfollowedUsername, reply);
        if(!followedUser){
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "Followed user not found",
                data: []
            });
        }

        if(!user.following.includes(followedUser._id)){
            return reply.code(400).send({
                error: true,
                statusCode: 400,
                message: "User doesnt follow this user",
                data: []
            });
        }


        user.following = user.following.filter((id: string) => id !== followedUser._id);
        followedUser.followers = followedUser.followers.filter((id: string) => id !== user._id);

        user.markModified("following");
        followedUser.markModified("followers");

        await user.save();
        await followedUser.save();


        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "User successfully followed !",
            data: user
        });


    }
}