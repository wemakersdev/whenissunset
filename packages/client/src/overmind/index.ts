import { createOvermind } from 'overmind'
import { createMixin } from 'overmind-svelte'
import type {IState} from './state'
import type {IActions} from './actions';
import { overmindState} from './state'
import { overmindActions} from './actions'
import type {Writable} from 'svelte/store'
import type { IOvermindAction } from './common';
import { overmindEffects } from './effects/index';
import type { IEffects } from './effects/index';

export interface IOvermind{
	state: IState;
	actions: IActions;
	effects: IEffects;
}


const overmind: IOvermind = {
  state: overmindState,
  actions: overmindActions,
  effects: overmindEffects
}

const store = createMixin(createOvermind(overmind))

export const state = store.state as Writable<IState>
export const actions = store.actions as IOvermindAction<IActions>
export const effects = store.effects as IOvermindAction<IEffects>
export const reaction = store.reaction
