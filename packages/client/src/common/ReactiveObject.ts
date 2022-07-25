import { ExtendedWritable} from "./ExtendedWritable";
import cloneDeep from 'lodash-es/cloneDeep'
import { getProxy } from "./proxyDeep";
import get from 'lodash-es/get'
import set from 'lodash-es/set'




class ReactiveObject<T extends object> extends ExtendedWritable<T>{

	public onDestroy: () => void = () => {};

	public proxy = getProxy<T>({
		get: (keyPath) => {
			const val = get(this.get(), keyPath, null);
			return val
		},

		set: (keyPath, value ) => {
			this.update(state => {
				set(state, keyPath, value);
				return state;
			});
			return true
		}
	})


	constructor(initialState: T){
		super(initialState);
	}

	getState(): T{
		return this.get();
	}

	setState(newState: T){
		this.set(newState);
	}

	setItem(key: keyof T, value: T[keyof T]){
		this.update((state) => {
			state[key] = value;
			return state;
		});
	}

	getItem<U extends keyof T>(key: keyof T): T[U]{
		return this.get()[key] as any;
	}


	clone(): ReactiveObject<T>{
		return new ReactiveObject<T>(cloneDeep(this.get()));
	}

	destroy(){
		this.onDestroy();
	}
}



export { ReactiveObject };