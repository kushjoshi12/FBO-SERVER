const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const userSchema = new mongoose.Schema(
	{
		superUser: {
			type: mongoose.Schema.ObjectId,
			ref: 'users',
			default: null,
		},
		mobileNumber: {
			countryCode: {
				type: String,
				default: '+1',
			},
			phoneNumber: {
				type: Number,
				default: 0,
			},
		},
		fullname: {
			type: String,
			default: null,
		},
		firstName: { type: String, default: null },
		lastName: { type: String, default: null },
		address: {
			houseNumber: { type: String, default: null },
			streetName: { type: String, default: null },
			areaName: { type: String, default: null },
			landmark: { type: String, default: null },
			city: { type: String, default: null },
			state: { type: String, default: null },
			country: { type: String, default: null },
			zipCode: { type: String, default: null },
		},
		contactName: String,
		userRole: {
			type: String,
			default: null,
		},
		userName: {
			type: String,
			default: null,
		},
		email: {
			type: String,
			default: '',
		},
		userToken: [
			{
				token: String,
				generatedTime: Date,
			},
		],
		password: {
			type: String,
			default: '',
		},
		anchorage: {
			publicKey: {
				type: String,
			},
			registration: {
				type: Boolean,
				default: false,
			},
			secretKey: {
				type: String,
			},
			APIKey: {
				type: String,
			},
			vaultId: {
				type: Array,
				default: [],
			},
		},
		silvergate: {
			fiatAccountId: {
				type: String,
				default: null,
			},
			fiatSubKey: {
				type: String,
				default: null,
			},
			fiatSecretKey: {
				type: String,
				default: null,
			},
			fiatApproved: {
				type: Boolean,
				default: false,
			},
		},
		initialMarginRequirement: [
			{
				tokenLevel: {
					type: Schema.Types.ObjectId,
					ref: 'cryptocurrency',
					default: null,
				},
				percentage: {
					type: Schema.Types.Mixed,
					default: 0.0,
					required: false,
				},
			},
		],
		initialCollatoralRequirement: [
			{
				tokenLevel: {
					type: Schema.Types.ObjectId,
					ref: 'tokenetTokens',
					default: null,
				},
				percentage: {
					type: Schema.Types.Mixed,
					default: 0.0,
					required: false,
				},
			},
		],
		longMarginRequirement: [
			{
				tokenLevel: {
					type: Schema.Types.ObjectId,
					ref: 'cryptocurrency',
					default: null,
				},
				percentage: {
					type: Schema.Types.Mixed,
					default: 0.0,
					required: false,
				},
			},
		],
		inventoryRateRequirement: [
			{
				tokenLevel: {
					type: Schema.Types.ObjectId,
					ref: 'cryptocurrency',
					default: null,
				},
				percentage: {
					type: Schema.Types.Mixed,
					default: 0.0,
					required: false,
				},
			},
		],
		marginMaintenanceRequirement: [
			{
				tokenLevel: {
					type: Schema.Types.ObjectId,
					ref: 'cryptocurrency',
					default: null,
				},
				percentage: {
					type: Schema.Types.Mixed,
					default: 0.0,
					required: false,
				},
			},
		],
		lengthMarginClock: {
			time: {
				type: Number,
				default: null,
			},
		},
		lengthOpenOrderExpiryClock: {
			time: {
				type: Number,
				default: null,
			},
		},
		liquidateBufferPercentage: {
			percentage: {
				type: Schema.Types.Mixed,
				default: 0.0,
				required: false,
			},
		},
		invtoryProviderPercentage: {
			percentage: {
				type: Schema.Types.Mixed,
				default: 0.0,
				required: false,
			},
		},
		seedApprove: {
			type: Boolean,
			default: true,
		},
		seedUserCode: {
			type: String,
			default: null,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		isLongMarginDisabled: {
			type: Boolean,
			default: false,
		},
		isPrivateChatFlag: {
			type: Boolean,
			default: false,
		},
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		updatedAt: {
			type: Date,
			default: Date.now(),
		},
		lastInVoicePaidDate: {
			type: Date,
			default: null,
		},
		userPublicAPis: [
			{
				apiKey: String,
				generatedTime: Date,
			},
		],
		legalName: { type: String },
		phoneVerifyToken: { type: String },
		emailVerifyToken: { type: String },
		phoneVerify: { type: Boolean, default: null },
		emailVerify: { type: Boolean, default: null },
		confirmOtp: { type: String },
		forgotOtp: { type: String },
		expireTime: { type: Date, default: null },
		twoStepAuthToken: { type: String, default: null },
		temporaryPasswordExpireDate: {
			type: Date,
			default: null,
		},
		randomPasswordFlag: {
			type: Boolean,
			default: false,
		},
		passwordExpireTime: {
			type: Date,
			default: null,
		},
		disabledChatNotification: {
			type: Boolean,
			default: false,
		},
	},
	{
		collection: 'users',
	},
);
userSchema.plugin(mongoosePaginate);
userSchema.pre('save', async function (cb) {
	try {
		const user = this;
		user.password = bcrypt.hashSync(this.password, 10);
		cb();
	} catch (error) {
		cb(error);
	}
});

const users = mongoose.model('users', userSchema);
module.exports.users = users;
