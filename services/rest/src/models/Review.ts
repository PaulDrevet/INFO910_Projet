import {model, Schema, Types} from 'mongoose';
import {IAnswer} from "./Answer";

export interface IReview {
    _id: Types.ObjectId,
    user: Types.ObjectId,
    movieId: number,
    rating: number,
    review?: string
    postedAt: Date,
    likes: number,
    answers: Types.DocumentArray<IAnswer>
}


const reviewSchema = new Schema<IReview>({
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        movieId: {type: "Number", required: true},
        rating: {type: "Number", required: true},
        review: {type: "String", required: false, default: '', trim: true},
        postedAt: {type: "Date", required: true, default: Date.now},
        likes: {type: "Number", required: true, default: 0},
        answers: {
            type: [{type: Schema.Types.ObjectId, ref: 'Answer'}],
            default: []
        },
    }, {
        versionKey: false,
    }
)

export default model<IReview>('Review', reviewSchema, 'reviews');