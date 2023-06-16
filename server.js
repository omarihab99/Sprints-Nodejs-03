const http = require('http');
const dotenv = require("dotenv");
const {getData, createData} = require("./index.js");
dotenv.config();
const PORT = process.env.PORT;


const requestListener = async (req, res) => {
    if(req.method === 'GET') {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const currency = url.searchParams.get('currency');
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(await getData(currency)));
        res.end();
    }
    if(req.method === 'POST'){
        let requestBody = '';
        req.on('data', async (chunk) => {
            requestBody += chunk;
        });
        req.on('end', async ()=>{
            console.log('Server: Request body received');
            res.writeHead(201, { "Content-Type": "application/json" });
            res.write(JSON.stringify(await createData(requestBody)));
            res.end();
        });  
    }
}

const server = http.createServer(requestListener);
server.listen(PORT, ()=>{
    console.log(`Server: running on port ${PORT}`);
});
