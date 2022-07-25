
import { get } from 'svelte/store';
import { deferredInstallPrompt } from './../common/basicStores';
import { MessageType, type Message, type BeforeInstallPromptEvent } from "./commonWorkerUtils";
import { registerSW } from 'virtual:pwa-register'


function listenForWaitingServiceWorker(reg: ServiceWorkerRegistration, callback: (reg: any) => void) {
	function awaitStateChange() {
		reg.installing?.addEventListener?.('statechange', function () {
			if (this.state === 'installed') callback(reg)
		})
	}
	if (!reg) return
	if (reg.waiting) return callback(reg)
	if (reg.installing) awaitStateChange()
	reg?.addEventListener?.('updatefound', awaitStateChange)
}

// reload once when the new Service Worker starts activating
let refreshing: boolean


navigator?.serviceWorker?.addEventListener?.('controllerchange', function () {
	if (refreshing) return
	refreshing = true
	window.location.reload()
})


export const preventBeforeInstallPrompt = async () => {
	const preventInstall = (e: BeforeInstallPromptEvent) => {
		e.preventDefault();
		deferredInstallPrompt.set(e);
	}

	window?.addEventListener?.('beforeinstallprompt' as any, preventInstall);

	return () => {
		window.removeEventListener('beforeinstallprompt' as any, preventInstall);
	}
}


export const handlePwaInstall = () => {
	const prompt = get(deferredInstallPrompt);
	prompt?.prompt();
}
export const sendFirebaseNotification = async ({ title, body, userId }: {
	title: string,
	body: string,
	userId: string
}) => {
	try {
		const url = new URL(`https://notify.xn--lkv.com/notify`);
		url.searchParams.append('title', title);
		url.searchParams.append('body', body);
		url.searchParams.append('user_id', `web__${userId}`);

		const resWeb = await fetch(url.href).then(res => res.json())
		url.searchParams.set('user_id', `mobile__${userId}`);
		const resMobile = await fetch(url.href).then(res => res.json())
		console.log({ resWeb, resMobile })
	} catch (e) {
		console.error(e)
	}
}

const initServiceWorker = (): Promise<ServiceWorkerRegistration> => {
	return new Promise(async (res, rej) => {
		if ('serviceWorker' in navigator) {
			const updateSw = await registerSW({
				onRegistered: (reg) => {
					if (reg) {
						listenForWaitingServiceWorker(reg, function (reg: any) {
							reg.waiting.postMessage({ type: MessageType.SKIP_WAITING })
						})
						res(reg)
					}else{
						console.error("Service worker not registered")
					}
				},

				onNeedRefresh: () => {
					updateSw(true)
				}
			})

		} else {
			throw new Error('Service worker not available')
		}
	})
}


export { initServiceWorker }