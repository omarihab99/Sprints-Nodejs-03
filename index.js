const dotenv = require("dotenv");
const axios = require("axios");
const _ = require('underscore');
dotenv.config();
const APP_ID = process.env.APP_ID;
const CURRENCY_API = `https://openexchangerates.org/api/latest.json?app_id=${APP_ID}`;
const PRODUCTS_API = `https://api.escuelajs.co/api/v1/products/`;

const transformData = (data, rate=1) => {
  const categories = {};
  for (const product of data) {
    product.price=parseFloat((product.price * rate).toFixed(2));
    if (categories[product.category.id]) {
      categories[product.category.id].products.push(product);
    } else {
      categories[product.category.id] = {
        category: { id: product.category.id, name: product.category.name },
        products: [product],
      };
    }
  }
  return Object.values(categories);
};

const getData = async (currency) => {
  const products = await axios.get(PRODUCTS_API).then((response) => {
    return response.data;
  });
  let categories;
  if(currency){
    const data = await axios.get(CURRENCY_API).then((response)=>{
      return response.data;
    });
    categories = transformData(products, data.rates[currency]);
  }
  else{
    categories = transformData(products, 1);
  }
  return categories;
};

const createData = async (body) => {
  const response = await axios.post(PRODUCTS_API, body).then((response)=>{
    return response.data;
  })
  return response;
}
module.exports ={ getData, createData };