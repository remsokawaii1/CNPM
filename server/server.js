var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var dbConn = require('./dbConn')

var allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
}

app.use(allowCrossDomain);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Customer Query
app.get('/customer/get/products', (req, res) => {
    dbConn.query('SELECT * FROM RProduct', (error, results, fields) => res.send({ results: results }));
});

// app.post('/customer/post/order', (req, res) => {
//         const items = req.body.items;
//         dbConn.query(`INSERT INTO rorder 
//                     SET TableNo = (SELECT TableNo FROM rtable WHERE TableNo = ${items.TableNo}),
//                         OrderStatus = 1,
//                         TotalCost = ${items.totalCost};`);
//         for (product of items.cartItems) {
//             dbConn.query(`INSERT INTO cart  
//                         SET ProductID = (SELECT ProductID FROM rproduct WHERE ProductID = ${product.ProductID}),
//                             OrderID = LAST_INSERT_ID(),
//                             Price = ${product.Price},
//                             Quantity = ${product.quantity};`);
//         }
//         dbConn.query(`SELECT LAST_INSERT_ID() as OrderID;`, (error, results, fields) => res.send({ results: results[0].OrderID }));
//     });

app.post('/customer/post/payment', async (req, res) => {
    const items = req.body.items;
        // console.log(items);
    try{
        await dbConn.promise().query(`INSERT INTO rorder 
                        SET TableNo = (SELECT TableNo FROM rtable WHERE TableNo = ${items.TableNo}),
                            OrderStatus = 1,
                            TotalCost = ${items.totalCost};`);
    }
    catch(error){
        return res.send('Invalid Table');
    }
    for (product of items.cartItems){
        dbConn.query(`INSERT INTO cart  
                        SET ProductID = (SELECT ProductID FROM rproduct WHERE ProductID = ${product.ProductID}),
                            OrderID = LAST_INSERT_ID(),
                            Price = ${product.Price},
                            Quantity = ${product.quantity};`);
        }
    dbConn.query(`INSERT INTO rpayment 
                    SET OrderID = (SELECT OrderID FROM rorder WHERE OrderID = LAST_INSERT_ID()),
                        TotalCost = ${items.totalCost},
                        PaymentStatus = 1,
                        PaymentType = ${items.PaymentMethod},
                        PaymentDate = '${items.PaymentDate}';`);
});

// Receptionist Query
app.get("/api/get", (req,res) => {
    const sqlSelect = "SELECT * FROM rtable ORDER BY TableNo";
    dbConn.query(sqlSelect, (err, result) => {
        if(err) console.log(err);
        else res.send(result);
    })
  });
  
app.put("/api/update", (req,res) => {
    const tableNo = req.body.TableNo;
    const tableStatus = req.body.TableStatus;
    const sqlUpdate = "UPDATE rtable SET TableStatus = ? WHERE TableNo = ?";
    dbConn.query(sqlUpdate, [tableStatus, tableNo], (err, result) => {
        if(err) console.log(err);
    })
});

app.listen(3001, () => {
        console.log('Node app is running on port 3001');
});
module.exports = app;