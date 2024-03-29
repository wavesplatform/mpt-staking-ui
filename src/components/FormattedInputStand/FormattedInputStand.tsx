import { FC } from 'react';
import { Flex, Text } from '@waves.exchange/wx-react-uikit';
import { FormattedInput } from 'uikit';
import { InputErrors } from 'uikit';
import logo from '/src/img/mpt-logo.svg';

export const FormattedInputStand: FC = () => {
    return (
        <Flex flexDirection="column" p="20px">
            <FormattedInput
                iconUrl={logo}
                formatSeparator=","
                decimals={8}
                tag="WAVES"
                value="100"
                maxWidth="300px"
                width="100%"
                mb="20px"
            />
            <FormattedInput
                iconUrl={logo}
                formatSeparator=","
                decimals={8}
                tag="WAVES"
                aria-invalid="true"
                maxWidth="300px"
                width="100%"
                mb="20px"
            />
            <Flex flexDirection="column" maxWidth="300px" color="wdtextsec">
                <Flex justifyContent="space-between" mb="6px">
                    <Text variant="caption">I send</Text>{' '}
                </Flex>
                <FormattedInput
                    iconUrl={logo}
                    formatSeparator=","
                    decimals={8}
                    tag="WAVES"
                    aria-invalid="true"
                    onPresetClick={(preset) => console.log('setMaxAmount: ', preset)}
                    placeholder='000000000000'
                />
                <InputErrors error="required" />
            </Flex>
        </Flex>
    );
};

FormattedInputStand.displayName = 'FormattedInputStand';
