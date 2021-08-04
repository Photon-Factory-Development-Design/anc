import 'url-polyfill'
import {isEmpty} from './object'

/**
 *
 */
export default async (a, sessionID, offerings = false) => {
	try {
		let url = new URL(a.href)

		// Add offeringID.1 parameter to only the Buy Box links.
		if (offerings.length) {
			if (
				a.hasAttribute('data-component-id') &&
				a.getAttribute('data-component-type') !== 'LinkedImage'
			) {
				const COMPONENT_ID = a.getAttribute('data-component-id')
				const ASIN = COMPONENT_ID.split('_')[0]

				let promoCodes = []

				// Loop through the offerings object and find matching ASIN.
				offerings.map((offer) => {
					if (!isEmpty(offer) && offer.asin === ASIN) {
						// If the offer has a promo, let's add the necessary attributes
						// for clipCoupon.js to work.
						if (offer.promo) {
							promoCodes.push(
								Object.assign(
									{},
									{
										asin: offer.asin,
										code: offer.promo.code,
										status: offer.promo.status,
									}
								)
							)
						}

						url.href = 'https://www.amazon.com/gp/item-dispatch/'
						url.searchParams.set('submit.addToCart', 'addToCart')
						url.searchParams.set('offeringID.1', offer.offeringID)

						if (promoCodes.length)
							a.setAttribute(
								'data-product-promo',
								JSON.stringify(promoCodes)
							)
					}
				})
			}

			// Let's work some voodoo magic on the LinkedImage components.
			else if (
				a.getAttribute('data-component-type') === 'LinkedImage' &&
				!url.searchParams.has('offeringID.1') &&
				!url.searchParams.has('submit.addToCart')
			) {
                console.log('LinkedImage', offerings);
				/**
				If the link does not already have the addToCart param or an offeringID pararm,
				then Creative should build the URL's for the Linked Image components like so:
            
                For Bundles (multiple products):
                https://amazon.com/?bundle=1&asin=B234VEVE34&asin=B23BRTBJ45
            
                For single products:
                https://amazon.com/?asin=B234VEVE34
                */

				// Get all the ASIN's from the link
				const ASIN_LIST = url.searchParams.getAll('asin')

				let promoCodes = []

				if (ASIN_LIST.length) {
					url.href = 'https://www.amazon.com/gp/item-dispatch/'
					url.searchParams.set('submit.addToCart', 'addToCart')
				}

				// Let's loop over the list of ASINs and get
				// the corresponding offer object from CB.offerings.
				ASIN_LIST.forEach((asin, index) => {
					// Loop through the offerings object and find matching ASIN.
					offerings.forEach((offer) => {
						if (!isEmpty(offer) && offer.asin === asin) {
							// If the offer has a promo, let's add the necessary attributes
							// for our clipCoupon.js function to work.
							if (offer.promo) {
								promoCodes.push(
									Object.assign(
										{},
										{
											asin: offer.asin,
											code: offer.promo.code,
											status: offer.promo.status,
										}
									)
								)
							}

							url.searchParams.set(
								`offeringID.${index + 1}`,
								offer.offeringID
							)
						}
					})
				})

				if (promoCodes.length)
					a.setAttribute(
						'data-product-promo',
						JSON.stringify(promoCodes)
					)
			}
		}

		// Now that we've added an offeringID parameter to everything
		// we care about, let's add a session-id parameter to any link with that parameter.
		// (P.S. this is what automatically adds the item to your cart).
		if (sessionID !== undefined) {
			if (url.searchParams.has('offeringID.1')) {
				url.searchParams.set('session-id', sessionID)
			} else {
				return a.href
			}
		}

		return url.href
	} catch (_) {
		return a.href
	}
}
