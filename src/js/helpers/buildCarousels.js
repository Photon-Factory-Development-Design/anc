'use strict'

import {isEmpty} from './object'
import buildLink from './buildLink'
import attachEvents from './attachEvents'

export default (carousels) => {
	carousels.forEach((carousel) => {
		const ITEMS = carousel.querySelectorAll('.carousel-product-list-item')

		ITEMS.forEach(async (item) => {
			const ASIN = item
				.querySelector('div[data-asin]')
				.getAttribute('data-asin')

			if (
				!item.querySelector(
					'a[data-component-type="CarouselAddToCart"]'
				)
			) {
				// There's no ATC button, let's build one.
				const ENTRY_POINT = item.querySelector('.lp-product-info-wrap')
					.nextSibling
				const PDP_LINK = item.querySelector(
					'a[data-component-type="Carousel"]'
				).href
				const ATC_WRAPPER = document.createElement('div')
				const ATC_BTN = document.createElement('a')

				ATC_BTN.href = PDP_LINK
				ATC_BTN.classList.add('dacx-a-reset')
				ATC_BTN.setAttribute('data-component-type', 'CarouselAddToCart')
				ATC_BTN.setAttribute('data-component-id', `${ASIN}_ATC`)
				ATC_BTN.innerHTML = `
					<span class="lp-button-wrap ">
						<span class="a-button a-button-beside-text a-button-primary">
							<span class="a-button-inner">
								<input type="submit" class="a-button-input">
								<span class="a-button-text a-text-center" aria-hidden="true">Add to Cart</span>
							</span>
						</span>
					</span>
				`

				ATC_WRAPPER.append(ATC_BTN)
				ENTRY_POINT.append(ATC_WRAPPER)

				const NEW_LINK = await buildLink(
					ATC_BTN,
					CB.sessionID || getCookie('session-id'),
					CB.offerings || []
				)

				if (NEW_LINK !== ATC_BTN.href) {
					ATC_BTN.href = NEW_LINK
					attachEvents(ATC_BTN)
				}

				if (CB.offerings.length) {
					CB.offerings.map((offering) => {
						if (
							!isEmpty(offering) &&
							offering.asin === ASIN &&
							offering.regPrice
						) {
							const INFO_WRAP = item.querySelector(
								'.lp-product-info-wrap'
							)

							if (!INFO_WRAP.querySelector('.a-text-strike')) {
								const ENTRY_POINT = INFO_WRAP.querySelector(
									'.a-price'
								).nextSibling
								const REG_PRICE = offering.regPrice

								const REG_PRICE_WRAP = `<span class="a-letter-space"></span><span class="a-text-strike a-price" data-a-color="tertiary" data-a-size="mini"><span class="a-price-symbol">$</span><span class="a-price-whole">${
									REG_PRICE.split('.')[0]
								}</span><span class="a-price-decimal">.</span><span class="a-price-fraction">${
									REG_PRICE.split('.')[1]
								}</span></span>`

								ENTRY_POINT.outerHTML = REG_PRICE_WRAP.trim()
							}
						}
					})
				}
			}
		})
	})
}
