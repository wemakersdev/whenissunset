import { overlayModal } from '@common/basicStores';
import type { IDisposable } from '@common/commonTypes';


export const openModal = async (
	component: () => Promise<any>,
	props: {
		[key: string]: any;
	} = {}): Promise<IDisposable> => {

	const promise = component();
	overlayModal.open(promise, props);
	return {
		dispose: () => overlayModal.close(),
	}
}


