export function setTitle(title: string): void {
    document.title = `Pelliculum • ${title}`;
}

/**
 * Slugify a string
 * @param text {string} - The string to slugify
 * @returns {string} - The slugified string
 */
export function slugify(text: string): string {
    return String(text)
        .normalize('NFKD') // split accented characters into their base characters and diacritical marks
        .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
        .trim() // trim leading or trailing whitespace
        .toLowerCase() // convert to lowercase
        .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
        .replace(/\s+/g, '-') // replace spaces with hyphens
        .replace(/-+/g, '-'); // remove consecutive hyphens
}
