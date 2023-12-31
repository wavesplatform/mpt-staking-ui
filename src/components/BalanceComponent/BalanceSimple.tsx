import * as React from 'react';
import { Flex } from '@waves.exchange/wx-react-uikit';
import { WithSkeleton } from '../../components/WithSkeleton';
import { SkeletonProps } from '../../components/Skeleton/types';
import { TBalanceContentSize } from './BalanceContent';
import { BalanceIcon } from './BalanceIcon';
import { getColor, getSize } from './helpers';
import { TColor, TTextVariant, Text } from '../../uikit';

export type BalanceSimpleProps = {
    variant?: Array<TBalanceContentSize>;
    balance?: string | React.ReactNode;
    ticker?: string;
    iconUrl?: string;
    skeleton?: { pending: boolean } & SkeletonProps;
};

export const BalanceSimple: React.FC<BalanceSimpleProps> = ({
    iconUrl,
    variant: variantsArray,
    skeleton,
    balance,
    ticker,
}) => {
    return (
        <Flex alignItems="center">
            <BalanceIcon iconUrl={iconUrl} variantsArray={variantsArray} />
            <WithSkeleton width="70px" {...skeleton}>
                <Flex
                    data-testid="balance-content-component"
                    alignItems="center"
                >
                    <Text
                        as="div"
                        variant={getSize(variantsArray, 'balance') as TTextVariant}
                        color={Number(balance) === 0 ? 'textsec' : getColor(variantsArray, 'balance') as TColor}
                    >
                        {balance}
                    </Text>
                    {ticker ? (
                        <Text
                            as="div"
                            variant={getSize(variantsArray, 'ticker') as TTextVariant}
                            color={getColor(variantsArray, 'ticker') as TColor}
                            alignSelf="flex-end"
                            ml="8px"
                            pb={variantsArray.includes('large') ? '10px' : '0'}
                        >
                            {ticker}
                        </Text>
                    ) : null}
                </Flex>
            </WithSkeleton>
        </Flex>
    );
};

BalanceSimple.displayName = 'BalanceSimple';
