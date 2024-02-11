import React, { useState } from 'react';
import { Box, Text, Newline } from 'ink';
import axios from 'axios'
import {UncontrolledTextInput} from 'ink-text-input';
import Help from './components/help.js';
import Header from './components/header.js';
import Error from './components/error.js';
import NoResults from './components/noResults.js';
import Loading from './components/loading.js';
import { Quote, Output } from './types/interfaces.js';
import { filterQuotesByKeyword, shuffleArray } from './utils.js'

export default function App() {
	const [output, setOutput] = useState<Output[]>([{ cat: 'start', command: '', quotes: [] }]); //Stores data used for output
	const [loading, setLoading] = useState<boolean>(false) //Loading flag
	const [charArray, setCharArray] = useState<string[]>([]) //Stores characters shown in help 

	let lastQuery = ""

	//Run if command is 'lq'
	async function setLQ() {
		let quotes = await axios.get(
			`https://api.oss117quotes.xyz/v1/random/1`
		);
		await setOutput(prevOutput => [
			...prevOutput,
			{
				cat: "quotes",
				command: lastQuery,
				quotes: [
					{
						sentence: quotes.data.sentence,
						name: quotes.data.character.name
					}
				]
			}
		]);
		setLoading(false)
	}

	//Run if command is 'lq --help'
	async function setHelp() {
		try {
			const characters = await axios.get<any[]>(`https://api.oss117quotes.xyz/v1/characters`);
			const charArray = characters.data.map(c => c.slug);
			
			setCharArray(charArray);
			setOutput(prevOutput => [...prevOutput, { cat: "help", command: lastQuery, quotes: [] }]);
			setLoading(false);
		} catch (error) {
			setLoading(false);
		}
	}
	
	//Run if command contains 'keyword' argument
	async function setKeyword(apiObject: { [key: string]: string }) {
		try {
			const quotesResponse = await axios.get<any[]>(`https://api.oss117quotes.xyz/v1/characters`); //Gets all available quotes from api so we can filter the keyword
			let filteredQuotes = filterQuotesByKeyword(quotesResponse.data, apiObject['keyword']!);
	
			if (filteredQuotes.length === 0) {
				setLoading(false);
				setOutput(prevOutput => [...prevOutput, { cat: "noResults", command: lastQuery, quotes: [] }]); //If no keywords are matched
				return;
			}
	
			if (apiObject['character']) {
				filteredQuotes = filteredQuotes.filter(q => q.nickname === apiObject['character']); //If 'character' argument is in command
			}
	
			if (apiObject['number'] && Number(apiObject['number']) < filteredQuotes.length) { //If 'number' argument is in command
				filteredQuotes = shuffleArray(filteredQuotes).slice(0, Number(apiObject['number']));
			}
	
			if (filteredQuotes.length === 0) { //If 'keywords' are found, but no matching 'character'
				setLoading(false);
				setOutput(prevOutput => [...prevOutput, { cat: "noResults", command: lastQuery, quotes: [] }]);
				return;
			}
	
			const newQuotes: Quote[] = filteredQuotes.map(q => ({ sentence: q.quote, name: q.author }));
			setOutput(prevOutput => [...prevOutput, { cat: "quotes", command: lastQuery, quotes: newQuotes }]); //Add quotes for display
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setOutput(prevOutput => [...prevOutput, { cat: "noResults", command: lastQuery, quotes: [] }]); //API returns no results
		}
	}
	
	//Run if command has 'character' argument, not not 'keyword'
	async function setCharacter(apiObject: { [key: string]: string }) {
		const number = apiObject['number'] ? '/' + apiObject['number'] : '/1';
		try {
			const response = await axios.get(`https://api.oss117quotes.xyz/v1/author/${apiObject['character']}${number}`); //Get number of character quotes from api
			const quotesData = Array.isArray(response.data) ? response.data : [response.data];
			const newQuotes = quotesData.map(q => ({ sentence: q.sentence, name: q.character.name }));
			setOutput(prevOutput => [...prevOutput, { cat: "quotes", command: lastQuery, quotes: newQuotes }]); //Add quotes for display
		} catch (error) {
			setLoading(false);
			setOutput(prevOutput => [...prevOutput, { cat: "noResults", command: lastQuery, quotes: [] }]); //API returns no results
		}
		setLoading(false);
	}

	//Run is command only contains 'number' argument
	async function setNumber(apiObject: { [key: string]: string }) {
		try {
			const number = Number(apiObject['number']);
			const response = await axios.get(`https://api.oss117quotes.xyz/v1/random/${number > 1 ? number : 1}`); //Get number of random quotes from api
			const quotesData = Array.isArray(response.data) ? response.data : [response.data];
			const newQuotes = quotesData.map(q => ({ sentence: q.sentence, name: q.character.name }));
			setOutput(prevOutput => [...prevOutput, { cat: "quotes", command: lastQuery, quotes: newQuotes }]); //Add quotes for display
		} catch (error) {
			setLoading(false);
			setOutput(prevOutput => [...prevOutput, { cat: "noResults", command: lastQuery, quotes: [] }]); //API returns no results
		}
		setLoading(false);
	}

	//Run when user presses enter in terminal
	async function setSubmit(query: string) {
		setLoading(true);
	
		lastQuery = query;
	
		const commandTester = /^lq(?:\s+--(character|number|keyword)=(\w+))*$/; //Tests if command is a valid search command
		const lqTester = /^lq(?! ) *$/i; //Tests if command is 'lq' with no arguments
		const helpTester = /^lq\s+--help$/; //Tests if command is valid help command
	
		if (lqTester.test(query.replace(/\s/g, ""))) { //If command is a vaild 'lq' command, with no arguments
			await setLQ();
			return;
		}
	
		if (helpTester.test(query)) { //If command is a valid help command
			await setHelp();
			return;
		}
	
		if (commandTester.test(query)) { //If command passes valid command test
			const argumentGetter = /--(\w+)=([\w\s]+)/g; //Gets all of the arguments from the command
			const matches = Array.from(query.matchAll(argumentGetter));
			const apiObject: { [key: string]: string } = {};
	
			matches.forEach((a: (string | undefined)[]) => {
				if (a && a.length >= 3) {
					const key = a[1];
					const value = a[2];
					if (key && value) {
						apiObject[key] = value.replace(/\s/g, "");
					}
				}
			});
	
			if (apiObject['keyword']) { //If command contains 'keyword' argument
				await setKeyword(apiObject);
				return;
			}
	
			if (apiObject['character']) { //If command contains 'character' argument, but no 'keyword' argument
				await setCharacter(apiObject);
				return;
			}
	
			if (apiObject['number']) { //If command contains only 'number argument
				await setNumber(apiObject);
				return;
			}
		}
	
		setOutput(prevOutput => [...prevOutput, { cat: "error", command: lastQuery, quotes: [] }]); //If command fails all validation tests
		setLoading(false);
	}
	

	return (
		<Box flexDirection="column">
			<Header />
			{output.map((entry: Output, index) => (
				<React.Fragment key={index}>
					{entry.cat !== 'start' && <Box><Text>READY: </Text><Text>{entry.command}</Text></Box>}
					{entry.cat === 'quotes' && entry.quotes.map((quote: Quote, index) => (
						<Box flexDirection='column' key={index}>
							<Text color="green" bold>{quote.name}: </Text>
							<Box marginLeft={1}>
								<Text> "{quote.sentence}"</Text>
							</Box>
							<Newline />
						</Box>
					))}
					{entry.cat === 'error' && <Error />}
					{entry.cat === 'noResults' && <NoResults />}
					{entry.cat === 'help' && <Help charArray={charArray} />}
					{output.length - 1 === index && <Box>
						<Box marginRight={1}>
							<Text>READY:</Text>
						</Box>

						<UncontrolledTextInput onSubmit={setSubmit} />
					</Box>}
				</React.Fragment>
			))}
			{loading && <Loading />}
		</Box>
	);
}
