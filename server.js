//Dependencies
const https = require("https");
const express = require('express');
const exphbs  = require('express-handlebars');

//intialize express
const app = express();

//set port
const PORT = 3000;

//set engine to handle express-handlebars templating
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//serve static content for the app from the "public" directory
app.use(express.static("public"));

//lowes url - provided
const url = "https://m.lowes.com/CatalogServices/product/nvalue/v1_0?nValue=4294857975&maxResults=6&showURL=1&rollUpVariants=1&showUrl=true&storeNumber=0595&priceFlag=rangeBalance&showMarketingBullets=1";

let productList;

//.get method to consume data from url
https.get(url, (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('Request Failed.\n' +
                      `Status Code: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('Invalid content-type.\n' +
                      `Expected application/json but received ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // consume response data to free up memory
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      productList = parsedData.productList;

    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
}); //end get method


/*
    Get Routes To Render Data from URL
*/

//main will render home view
app.get('/', (req, res) => {
    res.render("home", { productList: productList });
});

// filter the product list for specific product and return the product if found.
app.get('/product/:id', (req, res) => {

  const product = productList.filter((product) => {
    return product.productId === req.params.id;
 })[0];

 res.send("home", product)

});


//express listener
app.listen(PORT, () => {
  console.log("App running on PORT " + PORT);
});
