import { MessageType } from "./commonWorkerUtils";
import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'
import {registerRoute} from 'workbox-routing';
import {NetworkFirst} from 'workbox-strategies';
import {CacheableResponsePlugin} from 'workbox-cacheable-response'

declare const self: ServiceWorkerGlobalScope;

self.skipWaiting()
clientsClaim()

precacheAndRoute(self.__WB_MANIFEST || [])


registerRoute(
	({ url }) => url.origin === self.origin && url.pathname.startsWith('/api/geo'),
	new NetworkFirst({
		cacheName: 'geo-loc',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0,200],
			}),
		]
	})
)


const global: ServiceWorkerGlobalScope = self as any;


global.addEventListener('message', function (event) {
	if (event.data && event.data.type === MessageType.SKIP_WAITING) {
		global.skipWaiting();
	}
});

export {}