# Aruba AWS Product Selector App

This project was built by Node and deployed to AWS Ads pages. 

## How to deploy this app? 
1. Run npm run in currenet package. 
```
npm run build
```
2. Please push code changes including /build directory to github and create branch/tag to represents version of your code change.
![image](https://user-images.githubusercontent.com/49565243/144799406-223ca9f7-2925-466c-b187-0fdb009a3657.png)
![image](https://user-images.githubusercontent.com/49565243/144799477-e1972d82-7574-4d35-b8be-1c5e89f7272d.png)
3. In AWS Ads admin page, please create Free Form to import your code that you've built.
![image](https://user-images.githubusercontent.com/49565243/144799614-baec5710-1aa7-4bdf-95af-b72a824b7c83.png)
- At the very top free form, please add this code. 
```
<script>
(function(w) {
        if (w.CB && w.CB.offerings.length && w.CB.action) {return;}
        var CB = {}
        w.CB = CB;
        w.CB.offerings = [
        {
                "url": "https://www.amazon.com/gp/product/B07W7CBKZG?th=1",
                "asin": "B07W7CBKZG",
                "sellerId": null,
                "offeringID": "pyhwhqsnquqnuVhEGA38Z%2F%2F5Ny95f5G0gGMswVCEMp62uUOu%2BQ77QL5EbnGpLrHrlengHp6%2FHrMAmspQWM49xTfo%2B29GbVOA6kaZ1xnstqKDLO5%2B4Eo%2BHjfGTLKaDMYQ5X6sDapOcMti59rYSbVt%2BPkZqSJLNiOYUIPMChdxGbgV22OlVrOTbvfRJ39h%2FLCH"
        }, ... ]
</script>
```
- Add CSS styles  
e.g.
```
<link href="https://cdn.jsdelivr.net/gh/Photon-Factory-Development-Design/anc@1.3.7/dist/main.css" rel="stylesheet" />
```
>Note: In the above example, `https://cdn.jsdelivr.net/gh/` is a Github CDN server URL. `Photon-Factory-Development-Design` is a Organization/Owner name. `anc@1.3.7` is a repository name and version name that you added. `/dist/main.css` is the path to css file.
- Add JS code
e.g.
```
<script src="https://cdn.jsdelivr.net/gh/Photon-Factory-Development-Design/anc@1.3.7/dist/main.js"></script>
```
>Note: In the above example, `https://cdn.jsdelivr.net/gh/` is a Github CDN server URL. `Photon-Factory-Development-Design` is a Organization/Owner name. `anc@1.3.7` is a repository name and version name that you added. `/dist/main.js` is the path to js file.
This is essential to match styles to AWS texts, rating stars, buttons etc. 

## How does `Add to cart` feature works automatically inside app? 
1. We're fetching offeringIds which represents unique id for each product to add to product in AWS. Although those have same product ASIN id, the offeringIds will be different for different sellers in AWS. So fetching this offeringID is essential. 
Sample offering Item structure: 
```
{
        url: 'https://www.amazon.com/gp/product/B015HRFXKM?th=1&psc=1',
        asin: 'B015HRFXKM',
        offeringID:            'cN3PBtPvpk4d8gZOYQ0M343i5Feru8LI0Xx31TBMxEgJoK75EV78fvHiyDSbwNrhdcw9jXsniNfAZoHK%2B3EqGoxO8Bdx9diZtLe8Pf4hQ7RNjLh2kNzqjbNCGvXpwJ02mDB5JF8zjrKILedHsGfZfQ%3D%3D'
}
```
2. Once you fetched all offering Ids, then you can add it to top Free Form. 

### Notes that you should consider to build your own app. 
1. You can use assets of the projects directly like we're doing for other projects. Because once JS code is bundled and deployed, only JS/CSS code are bundled and deployed. So they can't referr any assets like in the project. So you should upload assets first and referr those asses using CDN url of github like mentioned in above section. 
2. we're using firebase to get updated stock result. We're running cron jobs to get updated stock status from AWS page on cloud server. But what you added to offerings.js is default stock option and that status will be updated about every hour/3 hours etc. 


### How does Seller priorities feature work? 
1. We should fetch all offering IDs for each seller and default seller product. 
2. Then, we should sort it when we add offeringID to add to cart button. And select offerningId which has no error in highest priority order.
3. To fetch offering id of seller, you can add `?smid={{sellerId}}` at the end of product URL. 
