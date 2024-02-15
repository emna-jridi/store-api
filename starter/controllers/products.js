const Product = require("../models/product");

const getAllProductsStatic = async (req, res) => {
  const products = await Product.find({ price: { $gt: 30 } })
    .sort('price')
    .select('name price');
  res.status(200).json({ products, nbHits: products.length });
};

//search much any reaserch
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {}; //n7otou fih selon chneya el recherche 9a3ed yessir

  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    queryObject.name = { $regex: name, $options: "i" }; // a verifier
  }

if(numericFilters){
  const operatorMap = {
    '>':'$gt',
    '>=':'$gte',
    '=':'$eq',
    '<':'$lt',
    '<=':'$lte',
  }//permet de chercher les operateurs de comparaison dans une chaine de caractere 
  const regEx = /\b(<|>|<=|>=|=)\b/g
  let filters= numericFilters.replace(regEx, (match)=>
    `-${operatorMap[match]}-`
  )//?
  console.log(filters);
}


  //console.log(queryObject);

  let result = Product.find(queryObject); //params in url

  //sort
  if (sort) {
    const sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  //fields 
  if (fields) {
    const fieldsList = fields.split(",").join(" ");
    result = result.select(fieldsList);
  }

  //limit & skip 
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit)

  const products = await result;
  res.status(200).json({ products, nbHits: products.length });
};


module.exports = {
  getAllProducts,
  getAllProductsStatic,
}
