var Express = require("express");
var cors = require('cors')
var app = Express();
const server =require("http").createServer(app)
var Routes1= require("./api/api")

app.use(Express.json())
app.use(cors())
app.use('/api/v1/', Routes1)


server.listen(8001, () => {
    console.log("Server started on port 5000");
});