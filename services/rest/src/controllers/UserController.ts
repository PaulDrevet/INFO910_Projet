import UserLoginRoute from "../routes/user/UserLoginRoute";
import { Controller, POST } from "fastify-decorators";
import { FastifyReply, FastifyRequest } from "fastify";
import S from "fluent-json-schema";
import UserRegisterRoute from "../routes/user/UserRegisterRoute";

@Controller("/user")
export default class UserController {


    @POST("/register", {
        schema: {
            body: S.object()
                .prop("email", S.string().required())
                .prop("password", S.string().required())
        }
    })
    public handlerRegister = async (req: FastifyRequest, reply: FastifyReply) => await new UserRegisterRoute().run(req, reply);


    @POST("/login", {
        schema: {
            body: S.object()
                .prop("email", S.string().required())
                .prop("password", S.string().required())
        }
    })
    public handlerLogin = async (req: FastifyRequest, reply: FastifyReply) => await new UserLoginRoute().run(req, reply);

}