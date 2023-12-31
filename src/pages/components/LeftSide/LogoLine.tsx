import { Box, Flex } from '@waves.exchange/wx-react-uikit';
import * as React from 'react';
import logo from '/src/img/mpt-logo.svg';

export const LogoLine: React.FC = () => {
    return (
        <Flex flexDirection="column" alignItems="center" display={['none', 'flex']}>
            <Box width="1px" backgroundColor="#C6DAE6" height="35px" />
            <Box
                width="85px"
                height="85px"
                minHeight="85px"
                backgroundImage={`url(${logo})`}
                sx={{
                    my: '20px'
                }}
            />
            <Box width="1px" backgroundColor="#C6DAE6" height="100%" />
        </Flex>
    );
};

LogoLine.displayName = 'LogoLine';
