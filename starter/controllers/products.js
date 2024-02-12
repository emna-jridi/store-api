const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
   
  const products = await Product.find({}).sort('name');
  res.status(200).json({ products, nbHits: products.length });
};

//search much any reaserch
const getAllProducts = async (req, res) => {
  const { featured, company, search ,name,sort } = req.query
  const queryObject = {}
    
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if(company){
    queryObject.company =  company
  }
  if(name){
    queryObject.name = {$regex:name, $options: 'i'} // a verifier 
  }
  console.log(queryObject);

 let products = await Product.find(queryObject) //params in url
 if(sort){
    products = products.sort()
 }
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProducts,
  getAllProductsStatic,
};
