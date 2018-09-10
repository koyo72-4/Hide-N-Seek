var fs = require('fs');
var http = require('http');
var mime = require('mime-types');
let cursor;
// let documents;
let globalDocuments;

var port = process.env.PORT || 5001;

let i = 0;
let j = 1;
let newArray = []

http.createServer(function (request, response) {
    let contentType = 'text/plain'
    let data;
    let path = request.url;
    let sortedDocuments;

    //   console.log("here is the request.url: " + path)
    //   myUrl = require('url').parse(request.url)
    //   console.log('here is the url.pathname: ' + myUrl.pathname)

    // if (request.method === 'GET' && path === '/scoreboard') {
    //         console.log("I did a GET")
    //             MongoClient.connect(url, function(err, client) {
    //             assert.equal(null, err);
    //             console.log("Connected successfully to server");

    //             const db = client.db(dbName);

    //             getDocuments(db, function(documents) {
    //                 console.log('Log from line 27: ' + JSON.stringify(documents))

    //                 client.close();
    //             });
    //           });
    //     }
    if (path === '/') {
        console.log('slash path')
        file = 'index.html';
        MongoClient.connect(url, function (err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");

            const db = client.db(dbName);

            getDocuments(db, function (documents) {
                // sortDocuments(documents,i,j);
                console.log(documents)
                function sortDocuments() {
                    console.log('sorting documents')
                    if (documents.length !== 0) {
                        if (documents[i].playerScore == j) {
                            newArray.push(documents[i])
                            documents.splice(i, 1);
                            if (i <= documents.length - 1) {
                                sortDocuments();
                            } else {
                                i = 0
                                sortDocuments();
                            }
                        } else {
                            if (i + 1 < documents.length) {
                                i = i + 1
                                sortDocuments();
                            } else {
                                i = 0
                                j = j + 1
                                sortDocuments()
                            }
                        }
                    }
                    console.log('done sorting') 
                }
                
                sortDocuments()

                backwardsArray = newArray.reverse()
                let scoreString = JSON.stringify(backwardsArray)
                console.log(scoreString)
                fs.writeFileSync('scores.json', scoreString)
                client.close();
            });
        });

    }
    if (request.method === 'POST' && path === '/scores') {
        file = 'index.html';
        console.log('did a post')
        let theBody = '';
        request.on('data', chunk => {
            theBody += '{"' + chunk + '"}'
            theNewerBody = theBody.replace(/&/g, '","')
            theNewestBody = theNewerBody.replace(/%2F/g, '/')
            theNewestestBody = theNewestBody.replace(/=/g, '":"')
            parsedBody = JSON.parse(theNewestestBody)

            MongoClient.connect(url, function (err, client) {
                assert.equal(null, err);
                console.log("Connected successfully to server");

                const db = client.db(dbName);

                insertDocuments(db, function () {
                    client.close();
                });
            });
        });
        request.on('end', () => {
            console.log(parsedBody);
            response.end('ok');
        });
    }

    else if (path.indexOf('.') === -1) {
        file = 'index.html';
    }

    else {
        file = '.' + decodeURIComponent(request.url);
    }

    try {
        if (file) {
            console.log('Serving ' + file);
            data = fs.readFileSync(file);
            contentType = mime.lookup(file);
        }
    } catch (error) {
        console.log(error);

        data = "Error: " + error.toString();
        response.statusCode = 404;
    }

    response.setHeader('Content-Type', contentType + '; charset=utf-8');
    response.write(data);
    response.end();

}).listen(port);

console.log("Listening on port " + port);

//MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO MONGO

const insertDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('scoreboard');
    // Insert some documents
    collection.insertMany([

        parsedBody

    ], function (err, result) {
        console.log("Inserted documents into the collection");
        callback(result);
    });
}

function getDocuments(db, callback) {
    cursor = db.collection("scoreboard").find({}).toArray((error, documents) => {
        if (error) {
            console.log(error)
        }
        // console.log("log from line 128: ")
        // console.log(documents)
        //Response is not defined here.
        callback(documents)
    })
}

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://everyman:everyman1@ds255308.mlab.com:55308/hidenseek';

// Database Name
const dbName = 'hidenseek';


// function sortDocuments() {
//     if (documents.length !== 0) {
//         if (documents[i].playerScore == j) {
//             newArray.push(documents[i])
//             documents.splice(i, 1);
//             if (i <= documents.length - 1) {
//                 sortDocuments();
//             } else {
//                 i = 0
//                 sortDocuments();
//             }
//         } else {
//             if (i + 1 < documents.length) {
//                 i = i + 1
//                 sortDocuments();
//             } else {
//                 i = 0
//                 j = j + 1
//                 sortDocuments()
//             }
//         }
//     } 
// }