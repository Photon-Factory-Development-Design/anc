export const isEmpty = obj => Object.keys(obj).length === 0;

export const serialize = obj => {
	let str = [];
	for (let p in obj) {
		if (obj.hasOwnProperty(p)) {
			str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
		}
	}
	return str.join('&');
};
