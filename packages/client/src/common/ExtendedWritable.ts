import { writable, type Writable, get } from 'svelte/store'

export class ExtendedWritable<T> implements Writable<T>{

	public set: Writable<T>['set']
	public update: Writable<T>['update']
	public subscribe: Writable<T>['subscribe']

	constructor(...args: Parameters<typeof writable>) {
		const store:any = writable(...args);
		this.set = (...args) => store.set(...args)
		this.update = (...args) => store.update(...args)
		this.subscribe = (...args) => store.subscribe(...args)
	}

	get(): T {

		return get(this)
	}
}