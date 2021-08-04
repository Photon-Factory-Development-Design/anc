'use strict'

export default async (promo) => {
	const CLIP_COUPON_URL =
		promo.status === 'private'
			? 'https://www.amazon.com/gp/mpc/'
			: 'https://www.amazon.com/gp/promotions/vpc?promoId='
	const clipCoupon = await fetch(CLIP_COUPON_URL + promo.code)

	await clipCoupon.text()
}
