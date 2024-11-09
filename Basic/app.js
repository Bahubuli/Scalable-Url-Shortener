const express = require("express")
const app = express();
const port = 3000;
const fs = require("fs");
const bodyParser = require('body-parser');

// Use body parser to handle JSON bodies
app.use(bodyParser.json());
// const urlFile = fs.readFileSync("urls.json",'utf8');
// const urls = JSON.parse(urlFile);

const urls = {};
app.get("/",(req,res)=>{
res.send(urls)
})


app.post("/shorten",(req,res)=>{

    const url = req.body.url;
    console.log("url is url",url)
    const exists = Object.values(urls).includes(url);
    if(exists){
        res.send({data:"url already exists"})
        return;
    }
    let counter = Object.keys(urls).length + 1;
    urls[counter] = url;
    res.send({data:"created successfully"});

})

app.get("/redirect",(req,res)=>{
    const shortUrl = req.query.url;
    const url = urls[shortUrl];
    if(!url){
        res.send({msg:"url not found"});
        return;
    }
    res.send({data:url});
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('an error occurred');
});

app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})
