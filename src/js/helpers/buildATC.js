'use strict'

import buildLink from './buildLink'
import isBuyBox from './isBuyBoxATC'
import isLinkedImage from './isLinkedImage'
import isCustomLink from './isCustomLink'
import buildBuyBox from './buildBuyBox'
import attachEvents from './attachEvents'

export default async (link) => {
	if (!isLinkedImage(link) && !isBuyBox(link) && !isCustomLink(link)) {
		return
	}

	if (isBuyBox(link)) {
		link = await buildBuyBox(link)
	}

	let newLink = await buildLink(
		link,
		CB.sessionID || getCookie('session-id'),
		CB.offerings || []
	)

	if (newLink !== link.href) {
		link.href = newLink
		attachEvents(link)
	}
}
