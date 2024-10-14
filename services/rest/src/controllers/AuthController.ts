import {Controller, POST} from "fastify-decorators";
import {FastifyReply, FastifyRequest} from "fastify";
import S from "fluent-json-schema";
import LoginRoute from "../routes/auth/LoginRoute";
import RegisterRoute from "../routes/auth/RegisterRoute";


@Controller("/auth")
export default class UserController {

    @POST("/register", {
        schema: {
            body: S.object()
                .prop('firstname', S.string().description('User firstname').required())
                .prop('lastname', S.string().description('User lastname').required())
                .prop('username', S.string().description('User username'))
                .prop('email', S.string().format(S.FORMATS.EMAIL).description('User email').required())
                .prop('password', S.string().minLength(8).description('Admin password').required())
                .prop("passwordConfirmation", S.string().minLength(8).description("User password confirmation").required())
        }
    })
    public handlerRegister = async (req: FastifyRequest, reply: FastifyReply) => await new RegisterRoute().run(req, reply);


    @POST("/login", {
        schema: {
            body: S.object()
                .prop('emailOrUsername', S.string().description('User email or username').required())
                .prop('password', S.string().minLength(8).description('User password').required())
        }
    })
    public handlerLogin = async (req: FastifyRequest, reply: FastifyReply) => new LoginRoute().run(req, reply);

}
