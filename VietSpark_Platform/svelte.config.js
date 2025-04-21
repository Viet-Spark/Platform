import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';

const config = {
	kit: {
		adapter: adapter(),
		prerender: {
			handleHttpError: ({ message }) => {
				// Ignore 404 errors during prerender
				if (message.includes('Not found') || message.includes('404')) {
					console.warn(`Warning: ${message}`);
					return;
				}

				// If the error isn't a 404, throw it
				throw new Error(message);
			}
		}
	},
	preprocess: [mdsvex()],
	extensions: ['.svelte', '.svx']
};

export default config;
