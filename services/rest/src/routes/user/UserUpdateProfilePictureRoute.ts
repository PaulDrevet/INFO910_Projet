import {FastifyReply, FastifyRequest} from "fastify";
import AbstractRoute from "../AbstractRoute";
import User, {IUser} from "../../models/User";
import {HydratedDocument} from "mongoose";
import {saveFile} from "../../utils/utils";
import {MultipartFile} from "@fastify/multipart";

export default class UserUpdateProfilePictureRoute extends AbstractRoute {

    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {username} = <{ username: string }>req.params;
        const file: MultipartFile | undefined = await req.file();

        const user = await User.findByUsername(username, reply);
        if(!user){
            return reply.code(404).send({
                error: true,
                statusCode: 404,
                message: "User not found",
                data: []
            });
        }

        if(!file){
            return reply.code(400).send({
                error: true,
                statusCode: 400,
                message: "No file provided",
                data: []
            });
        }

        await saveFile(file.file, "./public/"+user._id.toString()+".png");

        return reply.code(200).send({
            error: false,
            statusCode: 200,
            message: "Profile picture successfully updated !",
            data: user
        });


    }
}