import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { threlteStudio } from '@threlte/studio/vite'
import devtoolsJson from "vite-plugin-devtools-json";
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [threlteStudio(), tailwindcss(), sveltekit(), devtoolsJson()],
	ssr: { noExternal: ['postprocessing' ]}
});
