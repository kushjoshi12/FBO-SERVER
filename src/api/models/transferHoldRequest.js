const mongoose = require('mongoose');
const transferHoldRequestSchema = new mongoose.Schema(
	{
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'users',
		},
		transferId: {
			type: String,
			default: null,
		},
		destinationVault: {
			type: String,
			default: null,
		},
		holdData: {
			currentAssetType: String,
			assetType: String,
			amount: String,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		isCompleted: {
			type: Boolean,
			default: false,
		},
	},
	{
		collection: 'transferHoldRequest',
		timestamps: true,
	},
);
const transferHoldRequest = mongoose.model(
	'transferHoldRequest',
	transferHoldRequestSchema,
);
module.exports.transferHoldRequest = transferHoldRequest;
