import { createHmac } from 'crypto';
import { v4 as uuidV4 } from 'uuid';

const generateSignature = (key, str) => {
	var hmac = createHmac('sha512', key);
	var signed = hmac.update(new Buffer.from(str, 'utf-8')).digest('base64');
	return signed;
};

const getSilvergateHeaders = (
	url,
	subscription_key,
	subscription_secret,
	body = undefined,
) => {
	const nonce = uuidV4({}, Buffer.alloc(16)).toString('hex'); // Unique key
	const timestamp = new Date().toISOString(); // in UTC format
	const version = 'v1';
	const pre_encrypted_signature =
		body === undefined
			? `Silvergate ${subscription_key}${url}${nonce}${timestamp}${version}`
			: `Silvergate ${subscription_key}${url}${nonce}${timestamp}${version}${JSON.stringify(
					body,
			  )}`;
	const signature = generateSignature(
		subscription_secret,
		pre_encrypted_signature,
	);
	return {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'Ocp-Apim-Subscription-Key': subscription_key,
		'X-Auth-Nonce': nonce,
		'X-Auth-Timestamp': timestamp,
		'X-Auth-Version': version,
		'X-Auth-Signature': signature,
	};
};

export { getSilvergateHeaders };
