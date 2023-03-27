import config from '../config/config.js';
import { handleError } from './responseHandler.js';

// Create middleware.
const accessIPMiddleware = (req, res, next) => {
	let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || null;
	ip = ip ? ip.split(':').pop() : ip;
	const allowIps = config.ips.split(',');
	if (allowIps.includes(ip)) {
		return next();
	}
	return handleError({ res, statusCode: 401, errMsg: 'Unauthorized access' });
};
export { accessIPMiddleware };
