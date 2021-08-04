'use strict'

export default (link) =>
	link.getAttribute('data-component-type') === 'BuyBoxAddToCart' ||
	(link.closest('div[class*="-lp-Buybox"]') !== null &&
		link.hasAttribute('href') &&
		link.getAttribute('data-component-type') !== 'BuyBoxProduct' &&
		link.getAttribute('data-component-type') !== 'BuyBox')
