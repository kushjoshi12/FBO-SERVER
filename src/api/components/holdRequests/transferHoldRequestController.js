import { handleResponse } from '../../helper/responseHandler.js';
import { catchAsync } from '../../helper/catchAsync.js';
import message from '../../config/message.js';
import logger from '../../config/logger.js';
import { addRequest } from './transferHoldRequestService';

const createRequest = catchAsync(async (req, res) => {
	logger.info('Inside createRequest controller');
	const { userId, destinationVault, holdData, transferId } = req.body;
	const response = await addRequest({
		userId,
		destinationVault,
		holdData,
		transferId,
	});
	return handleResponse({
		res,
		msg: message.HOLD_REQUEST_CREATED,
		data: response,
	});
});
export default createRequest;
