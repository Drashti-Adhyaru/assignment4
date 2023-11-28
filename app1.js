var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database1');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var path = require('path');
const exphbs = require('express-handlebars');
const urlencodedParser = bodyParser.urlencoded({extended:false})

var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.use(express.static(path.join(__dirname, 'public')));
app.engine('.hbs', exphbs.engine({ extname: '.hbs' ,
runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
helpers:{
    rating: function (options) {
    if(options==0){
      return false;
    }else{
      return true;
    }
  }
,
rating1: function (options) {
    if(options!=0){
      return false;
    }else{
      return true;
    }
  },
edit:function (rating) {
    return rating === 0;
  },convert:function(value) {
    if (value === 0) {
      return 'zero';
    } else {
      return value;
    }
  },
  im: function(options) {
    // Check if the value is an image URL
    if (typeof options === 'string' && options.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
        return "<img src="+options+" alt='Product Image' style='max-width: 100px; max-height: 100px;'>";
    } else {
        return options;
    }
}
},

}));
app.set('view engine', 'hbs');

mongoose.connect(database.url);

var Book = require('./models/book');
 
 
//get all employee data from db
app.get('/api/books',async function(req, res) {
	// use mongoose to get all todos in the database
    const employe = await Book.find({});
    try {
        const employe = await Book.find({});
        ///res.json(employe);
		res.render('viewData', { sales: employe });

    } catch (error) {
        console.log(error);
    }

});





// get a employee with ID of 1
app.get('/api/employees/:employee_id',async function(req, res) {
	let id = req.params.employee_id;
    // const employe = await Book.findById(id);
    try {
        const employe = await Book.findById(id);
        res.json(employe);
    } catch (error) {
        res.send(error)
    }
	// Book.findById(id, function(err, employee) {
	// 	if (err)
	// 		res.send(err)
 
	// 	res.json(employee);
	// });
 
});
app.get('/api/book_search',function(req,res){
	res.render('search_invoice_form', { });
  })
  
  app.post('/api/book_search',urlencodedParser,async function(req,res){
	username = req.body.username;
	console.log(username);
  
	try {
	  const book = await Book.findOne({ISBN:username});
	  // res.json(book);
	  res.render('invoice_data',{data1:book});
  
  } catch (error) {
	  res.status(500).send(error.message);
  }
	// data1 = {}
	// for(i=0;i<sample.carSales.length;i++){
	//     if(username.localeCompare(sample.carSales[i].InvoiceNo)){
	//         data1 = sample.carSales[i];
	//     }else{
	//     }
	// }
	// console.log(book);
   
  })
  app.get('/api/book_insert',function(req,res){
	res.render('insert_book_form', { });
  })
  
  
  // create employee and send back all employees after creation
  app.post('/api/book_insert',async function (req, res) {
	  // create mongose method to create a new record into collection
	  console.log(req.body);
	  // console.log(Book);
	  try {
		const book = await Book.create({
		  ISBN: req.body.isbn,
		  img: req.body.img_link,
		  title: req.body.title,
		  author: req.body.author,
		  inventory: req.body.inventory,
		  category: req.body.category
		  });
		  // res.json("Record Added Successfully");
		  res.render('all_invoice', { data: "Record Added Successfully" });
  
	  } catch (error) {
		  res.status(500).send(error.message);
  
	  }
	  // Book.create({
	  //     name: req.body.name,
	  //     salary: req.body.salary,
	  //     age: req.body.age
	  // }, function (err, employee) {
	  //     if (err)
	  //         res.send(err);
   
	  //     // get and return all the employees after newly created employe record
	  //     Book.find(function (err, employees) {
	  //         if (err)
	  //             res.send(err)
	  //         res.json(employees);
	  //     });
	  // });
  
  });
  app.get('/api/book_update',function(req,res){
	res.render('update_book_form', { });
  })
  
  // create employee and send back all employees after creation
  app.post('/api/book_update',async function (req, res) {
	  // create mongose method to update an existing record into collection
	  console.log(req.body);
  
	  let id = req.body.isbn;
	  var data = {
		ISBN: req.body.isbn,
		img: req.body.img_link,
		title: req.body.title,
		author: req.body.author,
		inventory: req.body.inventory,
		category: req.body.category
	  }
	  try {
		  const employe  = await Book.findOneAndUpdate({ISBN:id},data);
		  // res.send('Successfully! Book updated - ' + book.title);
		  res.render('all_invoice', { data: "Successfully! Book updated" });
  
	  } catch (error) {
		  console.log(error);
		}
  
  
	  // save the user
	  // Book.findByIdAndUpdate(id, data, function (err, employee) {
	  //     if (err) throw err;
  
	  // });
  });
  
  app.get('/api/book_delete',function(req,res){
	res.render('delete_book_form', { });
  })
  
  // delete a employee by id
  app.post('/api/book_delete',async function (req, res) {
	  // console.log(req.params.book_id);
	  // let id = req.params.book_id;
	 let username = req.body.username;
  
	 console.log(username);
	  try {
		  const employe = await Book.deleteOne({ISBN :username});
		  // res.send('Successfully! Book has been Deleted.');
		  res.render('all_invoice', { data: "Successfully! Book has been Deleted." });
  
	  } catch (error) {
		  res.send(error);
		  console.log(error); 
	  }
  
	  // Book.remove({
	  //     _id: id
	  // }, function (err) {
	  //     if (err)
	  //         res.send(err);
	  //     else
	  //         res.send('Successfully! Book has been Deleted.');
	  // });
  });
  
  

// // create employee and send back all employees after creation
// app.post('/api/books',async function (req, res) {
//     try {
// 		const employees =  await Book.create({
//             ISBN: req.body.ISBN,
//             img: req.body.img,
//             title: req.body.title,
//             author: req.body.author,
//             inventory: req.body.inventory,
//             category: req.body.category,

//         });

//         res.json(employees);
//     } catch (error) {
//         res.status(500).send(error.message);

//     }
//     // Book.create({
//     //     name: req.body.name,
//     //     salary: req.body.salary,
//     //     age: req.body.age
//     // }, function (err, employee) {
//     //     if (err)
//     //         res.send(err);
 
//     //     // get and return all the employees after newly created employe record
//     //     Book.find(function (err, employees) {
//     //         if (err)
//     //             res.send(err)
//     //         res.json(employees);
//     //     });
//     // });

// });


// // create employee and send back all employees after creation
// app.put('/api/employees/:employee_id',async function(req, res) {
// 	// create mongose method to update an existing record into collection
//     console.log(req.body);

// 	let id = req.params.employee_id;
// 	var data = {
// 		name : req.body.name,
// 		salary : req.body.salary,
// 		age : req.body.age
// 	}

//     try {
//         const employe =await Book.findByIdAndUpdate(id, data);
//         res.send('Successfully! Book updated - '+employe.name);
//     } catch (error) {
//         res.send(error);
//     }
// 	// // save the user
// 	// Book.findByIdAndUpdate(id, data, function(err, employee) {
// 	// if (err) throw err;

// 	// res.send('Successfully! Book updated - '+employee.name);
// 	// });
// });

// // delete a employee by id
// app.delete('/api/employees/:employee_id',async function(req, res) {
// 	console.log(req.params.employee_id);
// 	let id = req.params.employee_id;
//     try {
//         const employe = await Book.deleteOne({_id : id});
//         res.send('Successfully! Book has been Deleted.');	
//     } catch (error) {
//         res.send(error);
//   }
// 	// Book.remove({
// 	// 	_id : id
// 	// }, function(err) {
// 	// 	if (err)
// 	// 		res.send(err);
// 	// 	else
// 	// 		res.send('Successfully! Book has been Deleted.');	
// 	// });
// });


// // create employee and send back all employees after creation


app.listen(port);
console.log("App listening on port : " + port);