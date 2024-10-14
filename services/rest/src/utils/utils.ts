import {createWriteStream, WriteStream} from "node:fs";

export function generateRidiculousName(): string {

    const names: string[] = ['Griffon', 'Panda', 'Licorne', 'Dragon', 'Hibou', 'Troll', 'Elfe', 'Sorcier', 'Nain', 'Vampire', 'Zombie', 'Fantôme', 'Loup', 'Gobelin', 'Sirène', 'Centaur', 'Minotaure', 'Cyclope', 'Phénix', 'Fée', 'Farfadet', 'Mr.'];
    const adjectives: string[] = ['Volant', 'Dansant', 'Rieur', 'Étourdi', 'Majestueux', 'Invisible', 'Flamboyant', 'Géant', 'Miniature', 'Ancien', 'Mystique', 'Éclatant', 'Terrifiant', 'Glorieux', 'Furtif', 'Ailé', 'Aquatique', 'Cristallin', 'Lumineux', 'Sombre', 'Ping', 'Malicieux'];

    const randomName: string = names[Math.floor(Math.random() * names.length)];
    const randomAdjective: string = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNumber: number = Math.floor(Math.random() * 100); // Nombre entre 0 et 99

    return `${randomName}${randomAdjective}${randomNumber}`;
}

export async function saveFile(stream: NodeJS.ReadableStream, path: string) {
    const fileStream: WriteStream = createWriteStream(path);
    await new Promise((resolve, reject) => {
        stream.pipe(fileStream);
        stream.on('error', reject);
        fileStream.on('finish', resolve);
    });
}