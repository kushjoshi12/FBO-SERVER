import dotenv from 'dotenv-safe';

dotenv.config();
export default {
	apiVersionUrl: '/api/v1',

	// Base URL for silvergate
	silvergateBaseUrl:
		process.env.NODE_ENV === 'development'
			? process.env.Silvergate_Sandbox_Url
			: process.env.Silvergate_Production_Url,

	// keys for crypto
	initVector: process.env.initVector, // 16 bytes of random data
	Securitykey: process.env.Securitykey, // 32 bytes of random data

	// List of ips for whitelisting
	ips: process.env.IPWhitelistallow,
};
