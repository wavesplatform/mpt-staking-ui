import { Money } from '@waves/data-entities';

export const filterObjectCommonContract =  ({ contractAddress }) => {
    return {
        filter: {
            and: [
                {
                    address: {
                        operation: 'eq',
                        value: contractAddress,
                    },
                },
                {
                    or: [
                        {
                            key: {
                                operation: 'eq',
                                value: `%s__totalAssetAmount`,
                            },
                        },
                        {
                            key: {
                                operation: 'eq',
                                value: `%s__emissionPerBlock`,
                            },
                        },
                    ],
                },
            ]
        }

    }
}


export const moneyFactory = (zeroMoney: Money) => (amount: number):  Money => {
    return zeroMoney.cloneWithTokens(amount);
}
