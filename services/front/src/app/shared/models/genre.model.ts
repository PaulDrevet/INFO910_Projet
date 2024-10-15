import { genres } from '../../configs/genres.config';
import { slugify } from '../../core/utils/utilities.utils';

export class Genre {
    /**
     * Slugify the genre name
     * @returns {string}
     */
    public static slug(genre: IGenre): string {
        return slugify(genre.name);
    }

    /**
     * Get the genre from its id
     * @param id {number} - The genre id
     * @returns {Genre | undefined}
     */
    public static fromId(id: number): IGenre | undefined {
        return genres.find((genre) => genre.id === id);
    }

    /**
     * Get the genre from its slug
     * @param slug {string} - The genre slug
     * @returns {Genre | undefined}
     */
    public static fromSlug(slug: string): IGenre | undefined {
        return genres.find((genre) => Genre.slug(genre) === slug);
    }

    public static fromIds(ids: number[]): IGenre[] {
        return ids.map((id) => Genre.fromId(id) as IGenre);
    }
}

export interface IGenre {
    id: number;
    name: string;
    text: string;
    icon: string;
}
