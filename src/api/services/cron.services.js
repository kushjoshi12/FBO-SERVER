import { handleResponse } from '../../helper/responseHandler.js';
import { catchAsync } from '../../helper/catchAsync.js';
import message from '../../config/message.js';
import logger from '../../config/logger.js';
import { listRequest } from '../components/holdRequests/transferHoldRequestService.js';
const ETHtransferCheckService = catchAsync(async (req, res) => {
	try {
		const data = await listRequest({ 'holdData.assetType': 'ETH' });
	} catch (err) {
		logger.error({
			message:
				'error from ETHtransferCheckService' + err.message
					? err.message
					: 'some thing went wrong',
		});
	}
});
const BTCTransferService = catchAsync(async (req, res) => {
	try {
	} catch (err) {
		logger.error({
			message:
				'error from ETHtransferCheckServices' + err.message
					? err.message
					: 'some thing went wrong',
		});
	}
});

export { ETHtransferCheckService, BTCTransferService };
