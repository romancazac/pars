const fs = require('fs');
const puppeteer = require('puppeteer');

let link = 'https://catollux.md/ru/aromatizatory/aromatizatory-dlya-doma-i-ofisa/page-5/?features_hash=1-390';

const parseNewsWebView = async click =>{
	try{
		
		let browser = await puppeteer.launch({
			headless: true, 
			slowMo: 100, 
			devtools: true
		});
		let page = await browser.newPage();
		
		await page.setViewport({width: 1920, height: 900});

		await page.goto(link, {waitUntil: 'domcontentloaded'});

		// const selector = await page.$('div.ty-pagination__items');
		// await selector.click();

		// await page.waitForSelector('div.Chronology-wrapper');

		// for(let i = 0; i < click; i++){
		// 	const button = await page.$('.cm-history.ty-pagination__item.cm-ajax');
		// 	await button.click();
		// }

		let html = await page.evaluate(async () =>{
			let res = []
			let container = await document.querySelectorAll('.cm-disable-empty-files');

			container.forEach(item => {
				let title = item.querySelector('.ut2-gl__name').innerText
				// let code = item.querySelector('span.ty-control-group__item').innerText

				let code;
				try{
					code = item.querySelector('span.ty-control-group__item').innerHTML
				}catch(e){
					code = null;
				}

				let link = item.querySelector('a.product-title').href
                // let price = item.querySelector('span.ty-price-num').innerText
				
				let price;
				try{
					price = item.querySelector('span.ty-price-num').innerHTML
				}catch(e){
					price = null;
				}

				let img;
				try{
					img = item.querySelector('.ty-pict').getAttribute('data-src')
				}catch(e){
					img = null;
				}
				
				res.push({
					title,
					 code,
					 link,
                     price,
					img
				});
                console.log(res);
                
			});
            console.log(container);

			return res;
		}); 

		for(let i=0; i < html.length; i++){
			await page.goto(html[i].link, {waitUntil: 'domcontentloaded'});
			await page.waitForSelector('div.content-features').catch(e => console.log(e));
			console.log(i);

			let article = await page.evaluate(async () => {
                
				let article = null
                
				try{
					article = document.querySelector('div.content-features').innerText
                    
				}catch(e){
					article = null;
				}
				return article;
			});
			
			html[i]['caracteristic'] = article;
		}

		console.log('news length - ' ,html.length);
		await browser.close();

        fs.writeFile("list.json", JSON.stringify(html), function(err){
            if(err) throw err
            console.log('saved news.json file');	
       });
	 }
     catch(e){
		await browser.close();
		console.log(e);
	}
}

parseNewsWebView(0)