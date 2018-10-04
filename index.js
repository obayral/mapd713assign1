var SERVER_NAME = 'user-api'
var PORT = process.env.PORT || 8000;
var HOST = '127.0.0.1';
var getRequestCounter = 0;
var postRequestCounter = 0;
var putRequestCounter = 0;
var deleteRequestCounter = 0;
var productArray = [];

var restify = require('restify')

  // Get a persistence engine for the users
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /products')
  console.log(' /products/:id')  
})

//test the git repository, if this comment occurs with the git commit. Then git repository is successfully set.
server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all products in the system
server.get('/products', function (req, res, next) {
  getRequestCounter++;
  console.log('received GET request.');
  console.log("Processed Request Counter --> GET: " +  getRequestCounter + ", POST: " + postRequestCounter + ", PUT: " + putRequestCounter +", DELETE: " +deleteRequestCounter);

  // Find every entity within the given collection
  productsSave.find({}, function (error, products) {

    // Return all of the products in the system
    res.send(products)
    console.log('Sending response to GET request.');
  })
})

// Get a single product by its product id
server.get('/products/:id', function (req, res, next) {
  getRequestCounter++;
  console.log('received GET request.');
  console.log("Processed Request Counter --> GET: " +  getRequestCounter + ", POST: " + postRequestCounter + ", PUT: " + putRequestCounter +", DELETE: " +deleteRequestCounter);
  // Find a single product by their id within save
  productsSave.findOne({ _id: req.params.id }, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    if (products) {
      // Send the product if no issues
      res.send(product)
      console.log('Sending response to GET request.');
    } else {
      // Send 404 header if the product doesn't exist
      res.send(404)
      console.log("Error occurred in sending Response.");
    }
  })
})

// Create a new product
server.post('/products', function (req, res, next) {
  postRequestCounter++;
  console.log('received POST request.');
  console.log("Processed Request Counter --> GET: " +  getRequestCounter + ", POST: " + postRequestCounter + ", PUT: " + putRequestCounter +", DELETE: " +deleteRequestCounter);
  
  // Make sure name is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('product must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  var newProduct = {
		product: req.params.product, 
		price: req.params.price
	}
  
  // Create the product using the persistence engine
  productsSave.create( newProduct, function (error, product) {
    
    // If there are any errors, pass them to next in the correct format
    if (error) {
      console.log('Error on creating product.');
      return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
    }
    
    // Send the product if no issues
    res.send(201, product)
    productArray.push(product);
    console.log('Product Array: ' + productArray);
    
  })
  console.log('Sending response to POST request.');
})

// Update a product by their id
server.put('/products/:id', function (req, res, next) {
  putRequestCounter++;
  console.log('received PUT request.');
  console.log("Processed Request Counter --> GET: " +  getRequestCounter + ", POST: " + postRequestCounter + ", PUT: " + putRequestCounter +", DELETE: " +deleteRequestCounter);
  // Make sure product is defined
  if (req.params.product === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('product must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  
  var newProduct = {
		_id: req.params.id,
		product: req.params.product, 
		price: req.params.price
	}
  
  // Update the product with the persistence engine
  productsSave.update(newProduct, function (error, product) {
    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    console.log('Sending response to PUT request.');
    // Send a 200 OK response
    res.send(200)
  })
})

// Delete user with the given id
server.del('/products/:id', function (req, res, next) {
  
  deleteRequestCounter++;
  console.log('received DELETE request.');
  console.log("Processed Request Counter --> GET: " +  getRequestCounter + ", POST: " + postRequestCounter + ", PUT: " + putRequestCounter +", DELETE: " +deleteRequestCounter);
  
  // Delete the user with the persistence engine
  productsSave.delete(req.params.id, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send a 200 OK response
    res.send()
    console.log('Sending response to DELETE request.');
  })
})

// Delete all products in the system
server.del('/products', function (req, res) {
  
  deleteRequestCounter++;
  console.log('received DELETE request.');
  console.log("Processed Request Counter --> GET: " +  getRequestCounter + ", POST: " + postRequestCounter + ", PUT: " + putRequestCounter +", DELETE: " +deleteRequestCounter);
  
  // Find every entity within the given collection
  productsSave.deleteMany({}, function (error) {

    // Return all of the products in the system
    res.send()
    console.log('Sending response to DELETE request.');
  })
})
