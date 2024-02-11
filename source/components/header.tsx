import React from 'react';
import { Box, Text } from 'ink';
import BigText from 'ink-big-text';

const Header = () => (
  <Box flexDirection="column" borderStyle="round" borderColor="#eda732" marginBottom={1}>
    <Box marginTop={1} marginLeft={1}>
      <Text color='#eda732' italic>Welcome to the</Text>
    </Box>
    <BigText text="Random quote cli" align='left' font='simple' colors={['#eda732']} />
    <Box marginLeft={1}>
      <Text color='#eda732'>(C) Copyright 2024</Text>
    </Box>
  </Box>
);

export default Header