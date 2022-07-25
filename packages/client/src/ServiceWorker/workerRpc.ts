import {RpcProvider} from 'worker-rpc'

export const getRPCProvider = ({postMessage, rpcTimeout = 10000}: {
	postMessage: (message: any, transfer: any) => void,
	rpcTimeout: number
}) => {
	const rpc = new RpcProvider(postMessage, rpcTimeout)
	return rpc
}
	

export class WorkerRpc<T = void>{
	public rpcProvider: RpcProvider
	constructor(rpcProvider: RpcProvider){
		this.rpcProvider = rpcProvider
	}

	async trigger(functionName: string, ...args: any[]):Promise<any>{
		return await this.rpcProvider.rpc(functionName, ...args)
	}

	register(functionName: string, callback: (...args: any[]) => T){
		this.rpcProvider.registerRpcHandler(functionName, callback)
	}


	unregister(functionName: string, callback: (...args: any[]) => T){
		try{
			this.rpcProvider.deregisterRpcHandler(functionName, callback);
		}catch(err){
			console.error(err)
		}
	}


	static createUsingBroadcastChannel<T = void>(channelName: string, rpcTimeout: number = 30000): WorkerRpc<T>{
		const channel = new BroadcastChannel(channelName)
		const rpc = new WorkerRpc<T>(getRPCProvider({postMessage: (message) => channel.postMessage(message), rpcTimeout}))

		channel.onmessage = (event) => {
			const message = event.data
			rpc.rpcProvider.dispatch(message);
		}
		return rpc
	}
}

