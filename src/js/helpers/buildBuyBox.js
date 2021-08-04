/**
 * This is for products like Norton that don't generate ATC links on Buy Boxes
 */
export default async (link) => {
	if (!link.hasAttribute('data-component-type')) {
		// Add the attributes
		const ASIN = link.closest('div[data-asin]').getAttribute('data-asin')

		link.setAttribute('data-component-id', `${ASIN}_ATC`)
		link.setAttribute('data-component-type', 'BuyBoxAddToCart')

		// Add the cart icon
		const BUTTON = link.querySelector('.a-button')
		const ICON_WRAPPER = link.querySelector('.a-button-inner')

		if (BUTTON) {
			BUTTON.classList.add('a-button-icon')
		}

		const ICON = document.createElement('i')
		ICON.classList.add('a-icon')
		ICON.classList.add('a-icon-cart')

		if (ICON_WRAPPER) {
			ICON_WRAPPER.prepend(ICON)
		}

		// Change the button text
		link.querySelector('.a-button-text').innerHTML = 'Add to Cart'
	}

	return link
}
