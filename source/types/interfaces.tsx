export interface Quote {
	name: string;
	sentence: string
}

export interface Output {
	cat: string;
	command: string;
	quotes: { sentence: string, name: string }[];
}

export interface Author {
	name: string;
	slug: string;
	quotes: string[];
}

export interface FilteredQuote {
	author: string;
	nickname: string;
	quote: string;
}