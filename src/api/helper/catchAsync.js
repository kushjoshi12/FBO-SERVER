import message from '../config/message.js';
import { handleError } from './responseHandler.js';

const catchAsync = fn => (req, res) => {
	fn(req, res).catch(error => {
		if (process.env.env === 'production') {
			return handleError({
				res,
				err: message.SOMETHING_WENT_WRONG,
				data: error,
				status: 'error',
			});
		}
		return handleError({ res, err: error, data: error, status: 'error' });
	});
};
export { catchAsync };
