import { FastifyRequest, FastifyReply } from 'fastify';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env['USERPOOL_ID']);
const USERPOOL_ID = process.env['USERPOOL_ID'] || '';
const cognitoJwtVerifier = CognitoJwtVerifier.create({
	userPoolId: USERPOOL_ID,
});

type queryobj = {
	authorization: string;
};

type headersobj = {
	authorization: string;
};

export const jwtVerifier = async (request: FastifyRequest, reply: FastifyReply) => {
	const query = request.query as queryobj;
	const headers = request.headers as headersobj;
	const auth = query.authorization || headers.authorization;

	if (!auth) {
		return reply.status(401).send();
	}

	const match = auth?.match(/^Bearer (.+)$/);
	if (!match) {
		return reply.status(401).send();
	}

	const accessToken = match[1];
	try {
		const payload = await cognitoJwtVerifier.verify(accessToken, { clientId: null, tokenUse: 'access' });
		if (!payload) {
			return reply.status(401).send();
		}

		return;
	} catch (err) {
		return reply.status(401).send();
	}
};
