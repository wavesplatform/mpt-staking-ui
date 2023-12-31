import { ChildStore } from '../ChildStore.ts';
import { FetchTracker } from '../utils/FetchTracker.ts';
import { IState } from '../../utils/search';
import { AppStore } from '../AppStore.ts';
import { search } from '../../utils/search/searchRequest.ts';
import { BLOCKS_PER_YEAR, filterObjectCommonContract, moneyFactory } from './utils.ts';
import { ICommonContractData, IUserAssets, IUserContractData, ITotalAssetsContractData } from './interface';
import { computed, makeObservable, reaction } from 'mobx';
import { evaluate } from '../../utils/evaluate/evaluate.ts';
import { IEvaluateResponse } from '../../utils/evaluate';
import { ITuple, parseOrderedTupleValue, parseTupleData } from '../../utils/evaluate/utils.ts';
import { Money } from '@waves/data-entities';
import { INode } from '../utils/fetchNodeList.ts';

const COMMON_DATA_POLLING_TIME = 60_000;
const USER_DATA_POLLING_TIME = 20_000;

export class ContractStore extends ChildStore {

    public commonContractData: FetchTracker<ICommonContractData, IState>;
    public totalAssetsContractData: FetchTracker<ITotalAssetsContractData, IState>;
    public userContractData: FetchTracker<IUserContractData, IEvaluateResponse> = new FetchTracker();

    constructor(rs: AppStore) {
        super(rs);
        const searchUrl = this.rs.configStore.config.apiUrl.stateSearch;
        const evaluateUrl = this.rs.configStore.config.apiUrl.evaluate;
        const contractAddress = this.rs.configStore.config.contracts.factory;

        makeObservable(this, {
            availableForClaim: computed,
            nodes: computed,
            userNode: computed,
        });

        this.totalAssetsContractData = new FetchTracker<any, any>({
            fetchUrl: evaluateUrl,
            fetcher: (evaluateUrl) =>
                evaluate(
                    evaluateUrl,
                    { address: contractAddress, expr: 'getTotalAssetsREADONLY()' }
                ),
            parser: this.totalAssetsDataParser,
            autoFetch: true,
            refreshInterval: COMMON_DATA_POLLING_TIME,
        });

        this.commonContractData = new FetchTracker<any, any>({
            fetchUrl: searchUrl,
            fetcher: (fetchUrl) =>
                search(
                    fetchUrl,
                    filterObjectCommonContract({ contractAddress }),
                    true
                ),
            refreshInterval: COMMON_DATA_POLLING_TIME,
            parser: this.contractDataParser,
            autoFetch: true,
        });

        reaction(
            () => this.rs.authStore.isAuthorized,
            () => {
                if (this.rs.authStore.isAuthorized) {
                    this.userContractData.setOptions({
                        fetchUrl: evaluateUrl,
                        fetcher: (evaluateUrl) =>
                            evaluate(
                                evaluateUrl,
                                { address: contractAddress, expr: `getUserAssetsREADONLY("${this.rs.authStore.user.address}")` }
                            ),
                        parser: this.userDataParser,
                        autoFetch: true,
                        refreshInterval: USER_DATA_POLLING_TIME
                    });
                } else {
                    this.userContractData.off();
                }
            },
        );
    }

    public get annual(): string {
        // (((totalAssetAmount + emissionForYear) - totalAssetAmount) / totalAssetAmount) * 100%

        const { totalAssetAmount, emissionPerBlock } = this.commonContractData.data;

        if (!emissionPerBlock || !totalAssetAmount) {
            return '0';
        }
        return (emissionPerBlock.getTokens().mul(BLOCKS_PER_YEAR).div(totalAssetAmount.getTokens()))
            .mul(100)
            .toFixed(2);
    }

    public get availableForClaim(): Money {
        return this.userContractData.data?.userLockedTokenAmount || new Money(0, this.rs.assetsStore.LPToken);
    }

    public get totalStaked(): Money {
        const zeroMoney = new Money(0, this.rs.assetsStore.LPToken);
        return zeroMoney.cloneWithTokens(
            this.availableForClaim.getTokens()
                .add(this.userContractData.data.availableToWithdraw?.getTokens() || 0)
        );
    }

    public get nodes(): Array<INode> {
        return this.userNode ?
            [
                this.userNode,
                ...this.rs.configStore.nodeList.filter((node) => node.address !== this.userNode.address)
            ] :
            [...this.rs.configStore.nodeList];
    }

    public get userNode(): INode {
        const userNodeAddress = this.userContractData?.data?.userStakingNodes && this.userContractData?.data?.userStakingNodes[0];
        if (!userNodeAddress) {
            return;
        }
        return (
            this.rs.configStore.nodeList.find(({ address }) => address === userNodeAddress) ||
            ({
                address: userNodeAddress,
                name: 'Unknown node',
                img: ''
            })
        );
    }

    private userDataParser = (data: IEvaluateResponse): IUserContractData => {
        const USER_ASSETS_VALUES = [
            'availableInternalLp',
            'availableToWithdraw',
            'currentInternalLPPrice',
            'userTotalStaked',
            'userTotalWithdrawn',
            'userLockedInternalLpAmount',
            'userLockedTokenAmount',
            'userStakingNodes',
            'userStakingNodesShares',
            'remainingBlocks'
        ];
        const parsedTuple = parseTupleData<IUserAssets>(
            data as ITuple,
            USER_ASSETS_VALUES,
            parseOrderedTupleValue
        );
        const getLpAmount = moneyFactory(new Money(0, this.rs.assetsStore.LPToken));
        const getPrice = moneyFactory(new Money(0, this.rs.assetsStore.WAVES));
        return Object.keys(parsedTuple).reduce((acc, key) => {
            if (key === 'currentInternalLPPrice' || key === 'userLockedTokenAmount') {
                acc[key] = getPrice(parsedTuple[key]);
                return acc;
            }

            if (key === 'userStakingNodes' || key === 'userStakingNodesShares' || key === 'remainingBlocks') {
                acc[key] = parsedTuple[key];
                return acc;
            }
            acc[key] = getLpAmount(parsedTuple[key]);
            return acc;
        }, {} as IUserContractData);
    };

    private totalAssetsDataParser = (data: IEvaluateResponse): ITotalAssetsContractData => {
        const TOTAL_ASSETS_VALUES = [
            'totalAvailableInternalLp',
            'totalAvailableToWithdraw',
            'currentInternalLPPrice',
            'totalLockedInternalLpAmount',
            'totalLockedTokenAmount',
            'remainingBlocks'
        ];
        const parsedTuple = parseTupleData<IUserAssets>(data as ITuple, TOTAL_ASSETS_VALUES, parseOrderedTupleValue);
        const getLpAmount = moneyFactory(new Money(0, this.rs.assetsStore.LPToken));
        const getPrice = moneyFactory(new Money(0, this.rs.assetsStore.WAVES));
        return Object.keys(parsedTuple).reduce((acc, key) => {
            if (key === 'currentInternalLPPrice') {
                acc[key] = getPrice(parsedTuple[key]);
                return acc;
            }

            if (key === 'remainingBlocks') {
                acc[key] = parsedTuple[key];
                return acc;
            }
            acc[key] = getLpAmount(parsedTuple[key]);
            return acc;
        }, {} as ITotalAssetsContractData);
    };

    private contractDataParser = (data: IState): ICommonContractData => {
        const parseEntries = (key: string, value: string | number): Partial<ICommonContractData> => {
            switch (true) {
                case key.includes('totalAssetAmount'):
                    return { totalAssetAmount: new Money(0, this.rs.assetsStore.LPToken).cloneWithTokens(value) };
                case key.includes('emissionPerBlock'):
                    return { emissionPerBlock: new Money(0, this.rs.assetsStore.LPToken).cloneWithTokens(value) };
                default:
                    return {};
            }
        };
        return data.entries.reduce(
            (acc, entry) => {
                const parsed = parseEntries(entry.key, entry.value);
                return { ...acc, ...parsed };
            },
            {
                totalAssetAmount: undefined,
                emissionPerBlock: undefined,
            }
        );
    };
}
