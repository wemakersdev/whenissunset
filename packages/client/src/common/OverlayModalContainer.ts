import SyncLoaderModalSvelte from "@components/Modals/SyncLoaderModal.svelte";
import { ReactiveObject } from "./ReactiveObject";


export interface IOverlayModalControllerOptions{
	isOpen: boolean;
	component: any;
	props?: {}
}

export class OverlayModalController extends ReactiveObject<IOverlayModalControllerOptions>{
	constructor(options: IOverlayModalControllerOptions) {
		super({
			...options,
		});
	}
	
	open(component:any, props?: any){
		if(component instanceof Promise){
			this.set({
				isOpen: true,
				component: SyncLoaderModalSvelte,
				props: {}
			})
			component.then(({default: component}) => {
				this.set({
					isOpen: true,
					component,
					props,
				})
			})
		}else{
			this.set({
				isOpen: true,
				component,
				props,
			})
		}
	}

	close(){
		this.set({
			isOpen: false,
			component: null,
			props: undefined,
		})
	}
}