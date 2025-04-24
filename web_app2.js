//Interacting with page 
var http = require('http'); 
var url = require('url'); 
var fs = require('fs');
const {MongoClient} = require('mongodb');
var port = process.env.PORT || 3000;


//Create Server
http.createServer(function(req, res) { 
    //Tell server the content of the file
    urlObj = url.parse(req.url, true)
    path = urlObj.pathname;
    var query = urlObj.query; //Will get json looking query string

    if (path == "/") { 
        file = __dirname + "/home.html"; 
        fs.readFile(file, function(err, home) { 
            res.writeHead(200, {'Content-Type': 'text/html'}); 
            res.write(home); 
            res.end(); 
        })
        
    } else if (path == "/process") {

        res.writeHead(200, {'Content-Type': 'text/html'}); 
        res.write(`<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Process</title>
                <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
                Processing... </br>
            </body>
            </html>`);
        
        //Access GET parameters 

        var word = query.word; 
        var stk_or_comp = query.stk_or_comp; 
            
        console.log(word, stk_or_comp);
        if (stk_or_comp == "comp_name") { 
            query = {"companyName" : word}; 
        } else if (stk_or_comp == "stk_sym") { 
            query = {"stkTkr" : word};
        }


        //Connect to Mongodb 
        const connStr= "mongodb+srv://Osinachi:mongopswd@cluster0.enps8.mongodb.net/"
        const client = new MongoClient(connStr);
     
        async function run(){ 
            try { 
                await client.connect();
                var dbo = client.db("Stock");
                var collection = dbo.collection('PublicCompanies');           
                // var results = await collection.find(query).toArray(); 
                // if (results.length == 0) { 
                //     console.log("Sorry, your input does not match any of our records."); 
                //     res.write("Sorry, your input does not match any of our records."); 

                // } else { 
                //     res.write("<p id = 'doc'>");
                //     console.log("Here are the records that match your input: "); 
                //     res.write("<span>Here are the records that match your input:</span> <br> <br>"); 

                //     results.forEach(function(doc) { 
                       
                //         for (field in doc){  
                //             if (field != "_id") { 
                //                 console.log( field, ": ", doc[field]);
                //                 res.write(`${field}: ${doc[field]}<br>`);
                //             }
                //         }
                        
                //     })
                //     res.write("</p>");
                //     console.log("\n");
                    
                // }
               
                res.end("We are in processing");

            } catch (dbErr){ 
                console.log("Database error: " + dbErr);
                res.end("Database error: " + dbErr);
            }
        }
        run();

    } else if (path == "/style.css") { 
        file =  __dirname +  "/style.css";
        fs.readFile(file, function (err,  style) { 
            if (err) { 
                res.writeHead(404); 
                res.end("CSS file could not be found"); 
                return; 
            }
            res.writeHead(200, {'Content-Type': 'text/css'} )
            res.end(style);
        })
    }

}).listen(port)
