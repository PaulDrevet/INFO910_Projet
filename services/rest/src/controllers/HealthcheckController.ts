import { FastifyReply, FastifyRequest } from "fastify";
import { Controller, GET } from "fastify-decorators";

@Controller("/healthcheck")
export default class UserController {


    @GET("/")
    public handlerHealthcheck = async (req: FastifyRequest, reply: FastifyReply) => {
        return reply.code(200).send("ok")
    }

}