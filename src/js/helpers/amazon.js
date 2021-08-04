const isAmazon = (url = false) => {
	try {
		const newUrl = new URL(url ? url : window.location.href)
		return (
			newUrl.host.includes('amazon') &&
			!newUrl.host.includes('advertising')
		)
	} catch (error) {
		return false
	}
}

const isAmazonAdvertising = (url = false) => {
	try {
		const newUrl = new URL(url ? url : window.location.href)
		return (
			newUrl.host.includes('amazon') &&
			newUrl.host.includes('advertising')
		)
	} catch (error) {
		return false
	}
}

export {isAmazon, isAmazonAdvertising}
