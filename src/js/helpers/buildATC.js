'use strict'

import buildLink from './buildLink'
import isBuyBox from './isBuyBoxATC'
import isLinkedImage from './isLinkedImage'
import isCustomLink from './isCustomLink'
import buildBuyBox from './buildBuyBox'
import attachEvents from './attachEvents'

export default async (link) => {
	// console.log('link', link)
	if (!isLinkedImage(link) && !isBuyBox(link) && !isCustomLink(link)) {
		return
	}

	// console.log(
	// 	'if check passed --->',
	// 	isLinkedImage(link),
	// 	isBuyBox(link),
	// 	isCustomLink(link)
	// )

	if (isBuyBox(link)) {
		link = await buildBuyBox(link)
	}

	let newLink = await buildLink(
		link,
		CB.sessionID || getCookie('session-id'),
		CB.offerings || []
	)

    console.log('newLink', newLink);

	if (newLink !== link.href) {
		link.href = newLink
		attachEvents(link)
	}
}
