'use strict'

import buildLink from './buildLink'
import isBuyBox from './isBuyBoxATC'
import isLinkedImage from './isLinkedImage'
import isCustomLink from './isCustomLink'
import buildBuyBox from './buildBuyBox'
import attachEvents from './attachEvents'

const sellerPriorities = {
	null: 4,
	A3KNQ2P1WTTKPU: 1,
	AIHFP4MVXMM7V: 2,
	A2STO040EWVPIF: 3,
}

function sortOfferingIdsBySeller(offerings) {
	return offerings.sort(
		(a, b) => sellerPriorities[a.sellerId] - sellerPriorities[b.sellerId]
	)
}

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

	// sort offering IDs
	let offeringIds = sortOfferingIdsBySeller(CB.offerings)

	let newLink = await buildLink(
		link,
		CB.sessionID || getCookie('session-id'),
		offeringIds
	)

	console.log('newLink', link, newLink)

	if (newLink !== link.href) {
		link.href = newLink
		attachEvents(link)
	}
}
