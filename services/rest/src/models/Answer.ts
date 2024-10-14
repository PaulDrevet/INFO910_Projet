import {model, Schema, Types} from "mongoose";

export interface IAnswer {
    _id: Types.ObjectId,
    user: Types.ObjectId,
    content: string,
    postedAt: Date,
    likes: number,
    answers: Types.DocumentArray<IAnswer>
}

const answerSchema = new Schema<IAnswer>({
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: "String", required: true},
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

export default model<IAnswer>('Answer', answerSchema, 'answers');
