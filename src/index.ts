import {
	App,
} from './app';

(async () => {
	try {
		const app = new App();

		await app.initialize();
		app.start();
	}
	catch (err) {
		console.log(err);
	}
})();
