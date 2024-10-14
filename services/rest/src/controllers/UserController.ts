import {Controller, DELETE, GET, POST} from "fastify-decorators";
import {FastifyReply, FastifyRequest} from "fastify";
import S from "fluent-json-schema";
import UserFollowRoute from "../routes/user/UserFollowRoute";
import UserGetRoute from "../routes/user/UserGetRoute";
import UserGetFollowersRoute from "../routes/user/UserGetFollowersRoute";
import UserGetFollowingRoute from "../routes/user/UserGetFollowingRoute";
import UserGetDetailsRoute from "../routes/user/UserGetDetailsRoute";
import UserGetWatchlistRoute from "../routes/user/UserGetWatchlistRoute";
import UserAddToWatchlistRoute from "../routes/user/UserAddToWatchlistRoute";
import UserRemoveFromWatchlistRoute from "../routes/user/UserRemoveFromWatchlistRoute";
import UserUnfollowRoute from "../routes/user/UserUnfollowRoute";
import UserReviewRoute from "../routes/reviews/UserReviewRoute";
import UserUpdateProfilePictureRoute from "../routes/user/UserUpdateProfilePictureRoute";
import UserGetProfilePictureRoute from "../routes/user/UserGetProfilePictureRoute";
import UserAnswerRoute from "../routes/answers/UserAnswerRoute";


@Controller("/user")
export default class UserController {

    @GET("/:username", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
        }
    })
    public handlerGetUser = async (req: FastifyRequest, reply: FastifyReply) => new UserGetRoute().run(req, reply)

    @GET("/:username/followers", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
        }
    })
    public handlerGetFollowers = async (req: FastifyRequest, reply: FastifyReply) => await new UserGetFollowersRoute().run(req, reply)

    @GET("/:username/following", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
        }
    })
    public handlerGetFollowing = async (req: FastifyRequest, reply: FastifyReply) => await new UserGetFollowingRoute().run(req, reply)

    @GET("/:username/details", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
        }
    })
    public handlerGetUserDetails = async (req: FastifyRequest, reply: FastifyReply) => await new UserGetDetailsRoute().run(req, reply)


    @POST("/:username/follows/:followedUsername", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
                .prop("followedUsername", S.string().description("Followed user username").required())
        }
    })
    public handlerFollowUser = async (req: FastifyRequest, reply: FastifyReply) => await new UserFollowRoute().run(req, reply)

    @DELETE("/:username/unfollows/:unfollowedUsername", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
                .prop("unfollowedUsername", S.string().description("Followed user username").required())
        }
    })
    public handlerUnfollowUser = async (req: FastifyRequest, reply: FastifyReply) => await new UserUnfollowRoute().run(req, reply)

    @GET("/:username/watchlist", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
        }
    })
    public handlerGetWatchlist = async (req: FastifyRequest, reply: FastifyReply) => await new UserGetWatchlistRoute().run(req, reply)

    @POST("/:username/watchlist/:movieId", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
                .prop("movieId", S.string().description("Movie id").required())
        }
    })
    public handlerAddToWatchlist = async (req: FastifyRequest, reply: FastifyReply) => await new UserAddToWatchlistRoute().run(req, reply)

    @DELETE("/:username/watchlist/:movieId", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
                .prop("movieId", S.string().description("Movie id").required())
        }
    })
    public handlerRemoveFromWatchlist = async (req: FastifyRequest, reply: FastifyReply) => await new UserRemoveFromWatchlistRoute().run(req, reply)

    @POST("/:username/reviews/:movieId", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
                .prop("movieId", S.string().description("Movie id").required()),
            body: S.object()
                .prop("rating", S.number().minimum(0).maximum(5).description("Rating").required())
                .prop("review", S.string().description("Comment").required())
        }
    })
    public handlerAddReview = async (req: FastifyRequest, reply: FastifyReply) => await new UserReviewRoute().run(req, reply)

    @POST("/:username/profilePicture", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required()),

        }
    })
    public handlerUpdateProfilePicture = async (req: FastifyRequest, reply: FastifyReply) => await new UserUpdateProfilePictureRoute().run(req, reply)

    @GET("/:username/profilePicture", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
        }
    })
    public handlerGetProfilePicture = async (req: FastifyRequest, reply: FastifyReply) => await new UserGetProfilePictureRoute().run(req, reply)

    @POST("/:username/answers/:reviewId", {
        schema: {
            params: S.object()
                .prop("username", S.string().description("User username").required())
                .prop("reviewId", S.string().description("Review id").required()),
            body: S.object()
                .prop("answer", S.string().description("Answer").required())
        }
    })
    public handlerAnswerReview = async (req: FastifyRequest, reply: FastifyReply) => await new UserAnswerRoute().run(req, reply)

}