'use strict'

import clipCoupon from './clipCoupon'
// import getCookie from './getCookie';

export const addToCartInBackground = (event, link) => {
	event.preventDefault()

	const TARGET = event.target.closest('a')
	const IS_BUY_BOX =
		TARGET.getAttribute('data-component-type') === 'BuyBoxAddToCart' ||
		TARGET.getAttribute('data-component-type') === 'CarouselAddToCart'

	const LOADER_ICON =
		'<img src="https://cdn.jsdelivr.net/gh/rdimascio/atc@1.6.3/assets/img/loading.svg" />'
	const LOADED_ICON =
		'<img src="https://cdn.jsdelivr.net/gh/rdimascio/atc@1.6.3/assets/img/loaded.svg" />'

	if (!IS_BUY_BOX) {
		let loaderWrap = document.createElement('div'),
			loaderContent = document.createElement('div'),
			loader = document.createElement('div')

		loaderWrap.classList.add('loading-wrapper')
		loaderWrap.classList.add('is-loading')
		loaderContent.classList.add('loading-content')
		loader.classList.add('loading')
		loader.innerHTML = LOADER_ICON

		loaderContent.appendChild(loader)
		loaderWrap.appendChild(loaderContent)
		document.body.appendChild(loaderWrap)
	} else {
		let loader = document.createElement('div')
		loader.classList.add('buy-box-loading')
		loader.innerHTML = LOADER_ICON

		TARGET.innerHTML = ''
		TARGET.appendChild(loader)
	}

	// We should use this endpoint someday 👇 because it returns the count for items in cart,
	// but we'll need to refactor the code a bit, specifically change the argument of this function
	// to include all properties of the offer, or read the ASIN from the data attribute on TARGET
	// and loop through all CB.offerings until we find the match.

	// const ATC_DATA = {
	//     verificationSessionID: CB.sessionID || getCookie('session-id'),
	//     offerListingID: '',
	//     quantity: '',
	//     ASIN: '',
	//     promoID: ''
	// };

	// const addToCart = await fetch('https://www.amazon.com/gp/add-to-cart/json',
	//     {
	//         method: 'POST',
	//         headers: {
	//             'Content-Type': 'application/x-www-form-urlencoded'
	//         },
	//         body: serialize(ATC_DATA)
	//     }
	// );

	// const ATC = await addToCart.json();

	// if (ATC.isOK) {
	//     document.getElementById('nav-cart-count').innerHTML = ATC.cartQuantity;

	//     if (!IS_BUY_BOX) {
	//         const LOADER_WRAP = document.querySelector('.loading-wrapper');
	//         const LOADER = document.querySelector('.loading');

	//         LOADER_WRAP.classList.remove('is-loading');
	//         LOADER_WRAP.classList.add('is-loaded');

	//         LOADER.innerHTML = LOADED_ICON;
	//         LOADER.innerHTML += '<h4>Added to Cart</h4>';

	//         setTimeout(() => {
	//             LOADER_WRAP.outerHTML = '';
	//         }, 1000);
	//     } else {
	//         let loaded = document.createElement('div');
	//         loaded.classList.add('buy-box-loaded');
	//         loaded.innerHTML = LOADED_ICON;
	//         loaded.innerHTML += '<h4>Added to Cart</h4>';
	//         TARGET.closest('div').appendChild(loaded);
	//         TARGET.outerHTML = '';
	//     }
	// }

	fetch(link).then((response) => {
		response.text().then(() => {
			if (!IS_BUY_BOX) {
				const LOADER_WRAP = document.querySelector('.loading-wrapper')
				const LOADER = document.querySelector('.loading')

				LOADER_WRAP.classList.remove('is-loading')
				LOADER_WRAP.classList.add('is-loaded')

				LOADER.innerHTML = LOADED_ICON
				LOADER.innerHTML += '<h4>Added to Cart</h4>'

				if (window.CB && !window.CB.bundle) {
					const cartCountElement = document.getElementById('nav-cart-count');
					const cartCount = cartCountElement.innerHTML;
					cartCountElement.innerHTML = Number(cartCount) + 1;

					setTimeout(() => {
						LOADER_WRAP.outerHTML = ''
					}, 1000)
				} else {
					LOADER.innerHTML +=
						`<p>${window.CB.bundleDisclaimer}</p>` ||
						'<p>Your discount has been been applied to your cart, but will not display in the total until the last step of checkout.</p>'

					document
						.getElementById('cb_cta-close')
						.addEventListener('click', () => {
							LOADER_WRAP.outerHTML = ''
						})
				}
			} else {
				let loaded = document.createElement('div')
				loaded.classList.add('buy-box-loaded')
				loaded.innerHTML = LOADED_ICON
				loaded.innerHTML += '<h4>Added to Cart</h4>'
				TARGET.closest('div').appendChild(loaded)
				TARGET.outerHTML = ''
			}

			return false
		})
	})
}

export const addToCartInNewWindow = (link) => {
	event.preventDefault()

	if (window.innerWidth <= 640) {
		// if width is smaller then 640px, create a temporary a element that will open the link in new tab
		var a = document.createElement('a')
		a.setAttribute('href', link)
		a.setAttribute('target', '_blank')

		var dispatch = document.createEvent('HTMLEvents')
		dispatch.initEvent('click', true, true)

		a.dispatchEvent(dispatch)
	} else {
		var width = window.innerWidth * 0.66
		// define the height in
		var height = (width * window.innerHeight) / window.innerWidth
		// Ratio the hight to the width as the user screen ratio
		window.open(
			link,
			'newwindow',
			'width=' +
				width +
				', height=' +
				height +
				', top=' +
				(window.innerHeight - height) / 2 +
				', left=' +
				(window.innerWidth - width) / 2
		)
	}

	return false
}
