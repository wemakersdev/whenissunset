import App from './App.svelte'
import './index.css';
import 'virtual:windi.css'
import './common/dayjs'


//@ts-ignore
const app = new App({
	target: document.body,
})

export default app
