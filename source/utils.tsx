import { Author, FilteredQuote } from './types/interfaces.js';

export function filterQuotesByKeyword(data: Author[], keyword: string): FilteredQuote[] {
    const filteredQuotes: FilteredQuote[] = [];
    const key = new RegExp(`\\b${keyword}\\b`, "i"); //Gets keyword to match

    data.forEach(author => {
        author.quotes.forEach(quote => {
            if (key.test(quote)) { //If keyword is found
                filteredQuotes.push({ author: author.name, quote, nickname: author.slug });
            }
        });
    });

    return filteredQuotes;
}

//Fisher-yates shuffle algorithm used to shuffle array to random order
export function shuffleArray(array: any) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        if (array[i] !== undefined && array[j] !== undefined) {
            [array[i], array[j]] = [array[j], array[i]]
        }
    }
    return array;
}