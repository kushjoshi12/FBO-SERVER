const { transferHoldRequest } = require('../../models/transferHoldRequest');

const updateRequest = async (condition, updatedData, populateArray = []) => {
	return await transferHoldRequest
		.findOneAndUpdate(condition, updatedData)
		.populate(populateArray)
		.lean();
};
const addRequest = async data => {
	return await transferHoldRequest.create(data);
};

const listRequest = async (condition, populateArray = []) => {
	const requestList = await transferHoldRequest
		.find(condition)
		.sort({ createdAt: -1 })
		.populate(populateArray)
		.lean();
	return { list: requestList };
};

exports.updateRequest = updateRequest;
exports.listRequest = listRequest;
exports.addRequest = addRequest;
