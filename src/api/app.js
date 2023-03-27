import express from 'express';
import dotenv from 'dotenv-safe';
import { accessIPMiddleware } from './helper/whitelistingHelper.js';
import morgan from 'morgan';
// import path from 'path';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import { handleError } from './helper/responseHandler.js';
import globalErrorHandler from './helper/globalErrorHandler.js';
import indexRouter from './components/indexRouter.js';
import config from './config/config.js';

dotenv.config();
// const __dirname = path.resolve();

const app = express();

// restrict to only white list ips
// app.use(accessIPMiddleware);

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Limit the number of api request from one ip address
const limiter = rateLimit({
	max: 1000,
	windowMs: 60 * 60 * 1000,
	message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(config.apiVersionUrl, indexRouter);
app.use(mongoSanitize());
app.use(xss());
app.use(compression());
mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => {
		//   const seedCxSocket = require('./helper/SeedCxSocketHelper');
		console.log(
			`Successfully Connected to the Mongodb Database at URL : mongodb://localhost:27017/dlccV4`,
		);
	})
	.catch(() => {
		console.log(
			`Error Connecting to the Mongodb Database at URL : mongodb://localhost:27017/dlcc`,
		);
	});
// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, '../../public')));

// Return 404 if if url is not available on server
app.all('*', (req, res, next) => {
	next(
		handleError({
			res,
			statusCode: 404,
			err: `Can't find ${req.originalUrl} on this server!`,
		}),
	);
});
//cron schedule for send ETH transfer and create hold

const ETHtransferCheck = schedule.scheduleJob('* * * * */5', async function () {
	await ETHtransferCheckService();
});
const BTCTransfer = schedule.scheduleJob('* * * * */30', async function () {
	await BTCTransferService();
});

app.use(globalErrorHandler);
export default app;
