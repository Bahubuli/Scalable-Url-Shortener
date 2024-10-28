const express = require("express")
const app = express();
const port = 3000;
const fs = require("fs");
const bodyParser = require('body-parser');

// Use body parser to handle JSON bodies
app.use(bodyParser.json());
const urlFile = fs.readFileSync("urls.json",'utf8');
const urls = JSON.parse(urlFile);

app.get("/",(req,res)=>{
res.send(urls)
})


app.post("/shorten",(req,res)=>{

    const url = req.body.url;
    console.log("url is url",url)
    // better methods will be use set
    // or maintain and reverse list of urls to get key
    const exists = Object.values(urls).includes(url);
    if(exists){
        res.send("url already exists")
        return;
    }
    let counter = Object.keys(urls).length + 1; // get the next available key value
    urls[counter] = url; // add new key-value pair to urls object
    fs.writeFileSync("urls.json",JSON.stringify(urls)); // write the updated urls object to file
    res.send(urls);

})

app.get("/redirect",(req,res)=>{
    const shortUrl = req.query.url;
    const url = urls[shortUrl];
    if(!url){
        res.send("url not found");
        return;
    }
    res.send(url);
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('an error occurred');
});

app.listen(port,()=>{
    console.log(`app is running on port ${port}`)
})
