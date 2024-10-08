export interface INode {
	address: string;
    name: string;
}

export function fetchNodes(url: string): Promise<Array<INode>> {
    return fetch(url)
        .then((res) => res.json())
        .then((data) => data.map((nodeConfig) => ({ address: nodeConfig.address, name: nodeConfig?.name || 'unknown' })));
}
