import { drizzle, users } from '@workspace/db';

export interface Env {
	DB: D1Database;
	STORAGE: R2Bucket;
}

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

function getCorsHeaders(request: Request) {
	const origin = request.headers.get('Origin') || '';
	const allowedOrigins = ['http://localhost:3000', 'http://localhost:4321'];
	if (allowedOrigins.includes(origin)) {
		return {
			...corsHeaders,
			'Access-Control-Allow-Origin': origin,
		};
	}
	return corsHeaders;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return new Response(null, { headers: getCorsHeaders(request) });
		}

		try {
			const url = new URL(request.url);
			const db = drizzle(env.DB);

			if (url.pathname === '/api/users' && request.method === 'GET') {
				const allUsers = await db.select().from(users).all();
				return Response.json(allUsers, { headers: getCorsHeaders(request) });
			}

			if (url.pathname === '/api/upload' && request.method === 'POST') {
				const objectName = `test-${Date.now()}.txt`;
				await env.STORAGE.put(objectName, 'Hello from Cloudflare R2!');
				return Response.json({ success: true, objectName }, { headers: getCorsHeaders(request) });
			}

			return new Response('Cloudflare API is running', { headers: getCorsHeaders(request) });
		} catch (error: any) {
			return new Response(error.message, { status: 500, headers: getCorsHeaders(request) });
		}
	},
};
