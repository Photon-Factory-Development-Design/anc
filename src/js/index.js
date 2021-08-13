import getCookie from './helpers/getCookie'
import buildATC from './helpers/buildATC'
import buildCarousels from './helpers/buildCarousels'
import {isAmazon, isAmazonAdvertising} from './helpers/amazon'
// import '../scss/main.scss'

const init = () => {
	window.CB.sessionID = getCookie('session-id')

	const CAROUSELS = document.querySelectorAll('.carousel-wrap')
	buildCarousels(CAROUSELS)

	const LINKS = document.querySelectorAll('a')
	LINKS.forEach(async (link) => {
		await buildATC(link)
		// OBSERVER.observe(link)
	})

	// function handleIntersection(entries, OBSERVER) {
	// 	entries.forEach(async (entry) => {
	// 		if (
	// 			entry.intersectionRatio > 0 &&
	// 			!entry.target.classList.contains('loaded')
	// 		) {
	// 			let img = entry.target.querySelector('img')

	// 			if (img) {
	// 				if (img.getAttribute('src')) {
	// 					await buildATC(entry.target)
	// 				}
	// 			} else {
	// 				await buildATC(entry.target)
	// 			}
	// 		}
	// 	})
	// }

	// var OBSERVER_OPTIONS = {
	// 	root: null,
	// 	rootMargin: '0px',
	// 	threshold: [0, 0.25, 0.5, 0.75, 1],
	// }

	// var OBSERVER = new IntersectionObserver(
	// 	handleIntersection,
	// 	OBSERVER_OPTIONS
	// )

	// const HOT_SPOTS = document.querySelectorAll('div[class*="-lp-Hotspot"]');

	// HOT_SPOTS.map(hotspot => {
	//     hotspot.addEventListener('click', () => {
	//         setTimeout(() => {
	//             const MODALS = document.querySelectorAll('div[class*="-lp-Modal"]');

	//             MODALS.map(modal => {
	//                 const LINKS = modal.querySelectorAll('a');

	//                 buildElements(LINKS);
	//             })
	//         }, 500);
	//     })
	// });
}

var waitForGlobal = function(key, sub, callback) {
	if (window[key]) {
		if (sub) {
			if (window[key][sub]) {
                setTimeout(function() {
                    callback();
                }, 500);
				
			} else {
				setTimeout(function() {
					waitForGlobal(key, sub, callback)
				}, 100)
			}
		} else {
			setTimeout(function () {
				callback()
			}, 500)
		}
	} else {
		setTimeout(function() {
			waitForGlobal(key, sub, callback)
		}, 100)
	}
}

const watchForNewNodes = (mutations, observer) => {
	mutations.forEach((mutation) => {
		if (!mutation.addedNodes) return

		for (var i = 0; i < mutation.addedNodes.length; i++) {
			const NODE = mutation.addedNodes[i]

			if (
				NODE instanceof Node &&
				NODE.hasAttribute('id') &&
				NODE.getAttribute('id') === 'ad-landing-page-wrap'
			) {
				waitForGlobal('CB', 'offerings', init)
				observer.disconnect()
			}
		}
	})
}

;(() => {
	try {
		const TARGET_NODE = document.body
		const TABS = document.querySelectorAll('.lp-Tabs-Tab:not(.is-selected)')
		const CONFIG = {childList: true, subtree: true}
		const OBSERVER = new MutationObserver(watchForNewNodes)
	
		if (isAmazon()) {
			if (!document.getElementById('ad-landing-page-wrap')) {
				OBSERVER.observe(TARGET_NODE, CONFIG)
			} else {
				waitForGlobal('CB', 'offerings', init)
			}
		} else {
			if (!isAmazonAdvertising()) {
				waitForGlobal('CB', 'offerings', init)
			}
		}
	
		TABS.forEach((tab) => {
			tab.addEventListener('click', () => {
				waitForGlobal('CB', 'offerings', init)
			})
		})
	} catch(e) {
		alert(e.message)
	}
})()
