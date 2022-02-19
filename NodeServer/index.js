let express = require('express')
var cors = require('cors')


let mongoClient = require('mongodb').MongoClient
const {
    url
} = require('./password');
const {
    response
} = require('express');

let database, books, bookflow, users
mongoClient.connect(url, function (err, client) {
    database = client.db("libraryFromNode")
    books = database.collection("books")
    bookflow = database.collection("bookflow")
    users = database.collection("users")
    console.log('mongo connected')
})




const app = express()
app.use(cors())
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json())


// app.post('/sendBook', function (request, response) {
//     let books = database.collection("books")
//     // console.log(books)
//     // console.log(request.body)

//     books.insertOne({
//         id: request.body.id,
//         name: request.body.name,
//         author: request.body.author
//     })

//     // books.find().toArray(function (err, documents) {
//     //     response.send(JSON.stringify(documents));
//     //     console.log(JSON.stringify(documents))
//     // });
// })
// listen to get all books
app.get('/api/books/get-all', function (request, response) {

    // send all books
    books.find({}).toArray(function (err, documents) {
        response.send(JSON.stringify(documents));
    });
})

app.get('/api/books', function (request, response) {

    const bookId = request.query.id;

    books.find({
        id: bookId
    }).toArray(function (err, documents) {
        response.send(JSON.stringify(documents));

    })
})

app.post('/api/books/create', function (request, response) {

    let book = request.body;

    try {
        books.insertOne(book)
        response.send('OK')
    } catch (err) {
        console.error(err)
    }
})

app.put('/api/books/update', function (request, response) {

    let obj = request.body

    try {
        books.updateOne(obj.query, {
            $set: obj.event
        }, {
            upsert: false
        })

    } catch (err) {
        console.error(err)
    }
})

app.get('/api/books/clear', function (request, response) {

    try {
        books.deleteMany({})
        books.find().toArray(function (err, documents) {
            response.send(JSON.stringify(documents));

        });
    } catch (err) {
        console.error(err)
    }
})


app.get('/api/bookflow/get-all', function (request, response) {

    bookflow.find().toArray(function (err, documents) {
        response.send(JSON.stringify(documents));

    });
})

app.post('/api/bookflow/create', function (request, response) {

    try {
        bookflow.insertOne(request.body)
        response.send('OK')
    } catch (err) {
        console.error(err)
    }
})

app.get('/api/bookflow/clear', function (request, response) {

    try {
        bookflow.deleteMany({})
        bookflow.find().toArray(function (err, documents) {
            response.send(JSON.stringify(documents));

        });
    } catch (err) {
        console.error(err)
    }
})

app.get('/api/users/get-all', function (request, response) {

    users.find().toArray(function (err, documents) {
        response.send(JSON.stringify(documents));

    });
})

app.post('/api/users/create', function (request, response) {

    try {
        users.insertOne(request.body)
        response.send('OK')
    } catch (err) {
        console.error(err)
    }
})

app.get('/api/users/clear', function (request, response) {

    try {
        users.deleteMany({})
        users.find().toArray(function (err, documents) {
            response.send(JSON.stringify(documents));

        });
    } catch (err) {
        console.error(err)
    }
})

app.put('/api/users/update', function (request, response) {

    let user = request.body;
    let Email = user.Contacts.Email;
    let options = request.body.options;

    /**
     * Добавить проверку наличия пользователя
     */
    try {
        users.updateOne({
            "Contacts.Email": {
                $eq: Email
            }
        }, options, {
            upsert: false
        })

    } catch (err) {
        console.error(err)
    }
})

app.post('/api/users/get-by-email', function (req, res) {

    let Email = req.body.email;

    users.findOne({
        "Contacts.Email": {
            $eq: Email
        }
    }).then(function (user) {
        console.log("send user to client: ", user)
        res.send(user)
    }).catch(function (err) {
        console.error(err)
    });

})

app.listen(3000)