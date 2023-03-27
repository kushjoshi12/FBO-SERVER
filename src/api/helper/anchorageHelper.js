const nacl = require('tweetnacl');
nacl.util = require('tweetnacl-util');
const axios = require('axios');
const crypto = require('crypto');
const {
	initVector,
	Securitykey,
	anchorageBaseUrl,
	ENVIRONMENT,
} = require('../config');
const logger = require('../helper/loggerHelper');

const sign = (secretKeyHex, body, path, method) => {
	const secretKey = module.exports.hexStringToByteArray(secretKeyHex);
	const timestamp = Math.floor(new Date().getTime() / 1000);
	const httpPath = path;
	const requestBody = body;
	const msgStr =
		method === 'DELETE'
			? timestamp + method + httpPath
			: timestamp + method + httpPath + JSON.stringify(requestBody);
	const msgDecoded = nacl.util.decodeUTF8(msgStr);
	const signature = nacl.sign.detached(msgDecoded, secretKey);
	const signatureHex = Buffer.from(signature, 'base64').toString('hex');
	return { signature, signatureHex, timestamp };
};
module.exports = {
	encryptAPIKeyHelper: async APIKey => {
		const encrypter = crypto.createCipheriv(
			'aes-256-cbc',
			Securitykey,
			initVector,
		);
		let encryptedMessage = encrypter.update(APIKey, 'utf8', 'hex');
		encryptedMessage += encrypter.final('hex');
		return encryptedMessage;
	},
	decryptAPIKeyHelper: encryptedAPIKey => {
		const decipher = crypto.createDecipheriv(
			'aes-256-cbc',
			Securitykey,
			initVector,
		);
		let decryptedData = decipher.update(encryptedAPIKey, 'hex', 'utf-8');
		decryptedData += decipher.final('utf8');
		return decryptedData;
	},
	fetchBalanceHelper: async data => {
		try {
			let { APIKey, vaultId, tokenSymbol } = data;
			// tokenSymbol = 'BTC_T'
			let APIURL = anchorageBaseUrl + `/vaults/${vaultId}`;
			let vaultResponse = await axios.get(APIURL, {
				headers: { 'Api-Access-Key': APIKey },
			});
			let result = [];
			// tokenSymbol = ENVIRONMENT === 'development' && tokenSymbol ? tokenSymbol + '_TG' : tokenSymbol
			if (tokenSymbol) {
				for (let ele of vaultResponse.data?.data?.assets) {
					if (ele.assetType.split('_')[0] === tokenSymbol) {
						result.push(ele);
					}
				}
				return result[0];
			} else {
				result = vaultResponse.data.data.assets;
				return result;
			}
		} catch (err) {
			logger.error({
				message: `Error from anchorage balance fetch api : ${err?.response?.data?.message}`,
			});
			throw err;
		}
	},
	holdFunds: async (apiKey, sourceVaultId, data) => {
		console.log('apiKey, sourceVaultId, data', apiKey, sourceVaultId, data);
		try {
			data.assetType =
				(ENVIRONMENT === 'development' && data.assetType === 'ETH') ||
				(ENVIRONMENT === 'development' && data.assetType === 'USDC')
					? data.assetType + '_TG'
					: ENVIRONMENT === 'development' && data.assetType === 'BTC'
					? data.assetType + '_T'
					: data.assetType;
			// API ENDPOINtT: https://api.anchorage.com/v2/holds
			const APIURL = anchorageBaseUrl + `/holds`;
			const body = {
				amount: data.amount,
				assetType: data.assetType,
				vaultId: sourceVaultId,
				idempotentId: data.orderId.toString(),
				// "expiresIn": 604800,
				memo: data.memo,
				// gasFeeSpecification: {
				// 	holdId: '654654849654165489494',
				// 	quantity: '0.0001'
				// }
			};
			const { signatureHex, timestamp } = sign(
				data.secretKeyHex,
				body,
				`/v2/holds`,
				'POST',
			);
			const result = await axios.post(APIURL, body, {
				headers: {
					'Api-Access-Key': apiKey,
					'Api-Signature': signatureHex,
					'Api-Timestamp': timestamp.toString(),
				},
			});
			console.log('result::::::::', result);
			if (result) {
				return result;
			} else {
				return false;
			}
		} catch (error) {
			logger.error({
				message: `Error from anchorage create hold api : ${error?.response?.data?.message}`,
			});
			return error;
		}
	},
	executeHoldFund: async (apiKey, holdId, destinationVaultId, data) => {
		try {
			// API ENDPOINtT: https://api.anchorage.com/v2/holds/{holdId}/execute
			const APIURL = anchorageBaseUrl + `/holds/${holdId}/execute`;
			const body = {
				amount: data.amount.toFixed(8),
				destinationVaultId: destinationVaultId,
				releaseHold: false,
				idempotentId: data.transactionId.toString(),
				transferMemo: data.memo.toString(),
			};
			const { signatureHex, timestamp } = sign(
				apiKey,
				body,
				`/v2/holds/${holdId}/execute`,
				'POST',
			);
			const result = await axios.post(APIURL, body, {
				headers: {
					'Api-Access-Key': data.APIKey,
					'Api-Signature': signatureHex,
					'Api-Timestamp': timestamp,
				},
			});
			if (result) {
				return result;
			} else {
				return false;
			}
		} catch (error) {
			logger.error({
				message: `Error from anchorage execute hold api : ${error?.response?.data?.message}`,
			});
			return error;
		}
	},
};
