import type {IContext, IState} from 'overmind'
import type {IOvermind} from './../index'

export type ParametersExceptFirst<F> =
   F extends (arg0: any, ...rest: infer R) => any ? R : never;

export type AnyFunction = (...args: any) => any

export type IAction<P, O> = (context: IContext<IOvermind>, payload: P) => O
export type IEffect<P, O> = (context: IContext<IOvermind>, payload: P) => Promise<O>
export type exposedAction<T extends AnyFunction> = (...args: ParametersExceptFirst<T>) =>  ReturnType<T>

export type IOvermindAction<T> = {
	[K in keyof T]: T[K] extends AnyFunction ? exposedAction<T[K]> : IOvermindAction<T[K]>
};




