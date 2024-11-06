import { FastifyReply, FastifyRequest } from "fastify";
import { AbstractRoute } from "../AbstractRoute";
import User from "../../models/User";
import Main from "../../Main";

export default class UserLoginRoute extends AbstractRoute {
    run = async (req: FastifyRequest, reply: FastifyReply): Promise<any> => {

        const {email, password} = <{ email: string, password: string }>req.body;

        const user = await User.findByEmail(email);
        if (!user) {
            return reply.code(404).send({error: "Cet utilisateur n'existe pas"});
        }

        const passwordMatch: boolean = await Main.getWebServer().getServer().bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return reply.code(401).send({error: "Mot de passe incorrect"});
        }

        const token: string = Main.getWebServer().getServer().jwt.sign({ email });

        return reply.code(200).send({message: "Connexion réussie", token});

    }
}