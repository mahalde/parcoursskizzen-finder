export function mapAsync(arr, asyncCallback) {
	const promises = arr.map(asyncCallback);
	return Promise.all(promises);
}
