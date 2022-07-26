
import { ExtendedWritable } from "./ExtendedWritable";
import type { BeforeInstallPromptEvent } from '@ServiceWorker/commonWorkerUtils';
import { SW_BROADCAST_CHANNEL_KEY } from "../constants";
import { UiThemes } from "./styles";
import { OverlayModalController } from "./OverlayModalContainer";


export const deferredInstallPrompt = new ExtendedWritable<BeforeInstallPromptEvent>();
export const swRegistration = new ExtendedWritable<ServiceWorkerRegistration | undefined>();
export const rootElement = new ExtendedWritable<HTMLElement | undefined>();
export const theme = new ExtendedWritable<UiThemes>(UiThemes.business);



export interface IDisplayLocation {
	latitude: number;
	longitude: number;
	label?: string;
}
export const networkLocation = new ExtendedWritable<IDisplayLocation | undefined>();


export const overlayModal = new OverlayModalController({
	isOpen: false,
	component: null,
	props: undefined,
})