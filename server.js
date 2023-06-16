const http = require('http');
const dotenv = require("dotenv");
const {array, number, object, string} = require("yup");
const {getData, createData} = require("./index.js");
dotenv.config();
const PORT = process.env.PORT;
const productSchema = object({
    title: string().required(),
    price: number().required().positive(),
    description: string().required(),
    categoryId: number().required().positive().integer(),
    images: array(string()).required(),
});

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
        req.on('data', (chunk) => {
            requestBody += chunk;
        });
        req.on('end', async ()=>{
            const body = productSchema.validateSync(JSON.parse(requestBody),{strict:true});
            console.log('Server: Request body received');
            res.writeHead(201, { "Content-Type": "application/json" });
            res.write(JSON.stringify(await createData(body)));
            res.end();
        });  
    }
}

const server = http.createServer(requestListener);
server.listen(PORT, ()=>{
    console.log(`Server: running on port ${PORT}`);
});
