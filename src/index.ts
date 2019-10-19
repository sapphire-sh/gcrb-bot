import {
	App,
} from './App';

(async () => {
	try {
		const app = new App();
		await app.initialize();
		await app.start();
	}
	catch (err) {
		console.log(err);
	}
})();
