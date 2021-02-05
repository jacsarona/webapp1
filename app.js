const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    console.log(req.url.toString());

    
    res.setHeader('Content-Type', 'text/html');
    let req_url = './views/';

    if(req.url == '/')
    {
        req_url += 'index.html';
        res.statusCode = 200;
    }
    else if(req.url == '/about')
    {
        req_url += 'about.html';
        res.statusCode = 200;
    }
    else if(req.url == '/contact')
    {
        req_url += 'contact.html';
        res.statusCode = 200;
    }
    else
    {
        req_url += '404.html';
        res.statusCode = 404;
    }
    
    fs.readFile(req_url, (err, data) => {
        if(err)
        {
            console.log(err);
            res.end();
        }
        else
        {
            res.end(data);
        }
    });
});

server.listen(3001, 'localhost', () =>{
    console.log('listening');
});