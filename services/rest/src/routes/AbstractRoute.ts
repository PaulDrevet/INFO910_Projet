import { FastifyReply, FastifyRequest } from "fastify";

export abstract class AbstractRoute {
    public abstract run(req: FastifyRequest, reply: FastifyReply): Promise<any>;
}