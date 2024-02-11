import React from 'react';
import { Box, Text, Newline } from 'ink';

interface HelpProps {
    charArray: string[];
}


const Help = ({ charArray }: HelpProps) => (
    <Box flexDirection="column">
        <Newline />
        <Box>
            <Box minWidth={45}>
                <Text color="green" bold>lq</Text>
            </Box>
            <Text>Shows a random quote</Text>
        </Box>
        <Newline />
        <Box>
            <Box minWidth={45}>
                <Text color="green" bold>lq --character=x</Text>
            </Box>
            <Text>Shows a random quote from character x. ie: <Text inverse color="yellow">lq --character=hubert</Text></Text>
        </Box>
        <Newline />
        <Box>
            <Box minWidth={45}>
                <Text color="green" bold>lq --number=x</Text>
            </Box>
            <Text>Shows number x random quotes. ie: <Text inverse color="yellow">lq --number=7</Text></Text>
        </Box>
        <Newline />
        <Box>
            <Box minWidth={45}>
                <Text color="green" bold>lq --keyword=x</Text>
            </Box>
            <Text>Shows a random quote containing the keyword x. ie: <Text inverse color="yellow">lq --keyword=bon</Text></Text>
        </Box>
        <Newline />
        <Box>
            <Box minWidth={45}>
                <Text color="green" bold>lq --character=x --number=x --keyword=x</Text>
            </Box>
            <Text>Arguments can be cumilative. ie: <Text inverse color="yellow">lq --character=hubert --nunmber=7 --keyword=bon</Text> will show 7 random quotes from hubert containing the word bon.</Text>
        </Box>
        <Newline />
        <Box>
            <Box minWidth={45}>
                <Text bold>List of available characters: </Text>
            </Box>
            <Text>{charArray.join(", ")}</Text>
        </Box>
        <Newline />
    </Box>
);

export default Help