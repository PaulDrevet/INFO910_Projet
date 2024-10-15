import { IUser } from './user.model';

export interface IList {
    id: number;
    name: string;
    description: string;
    user: IUser | any;
    isPublic: boolean;
    likes: number;
    comments: number;
    movies: number[];
}
