const net = require('net');
const fs = require('fs');
const path = require('path');
const stream_worker = require('./stream_worker');
const port = 8003;
let seed = 0;

const server = net.createServer((client) => {
    client.setEncoding('utf8');
    client.id = Date.now() +"_seed"+ ++seed;
    client.logger = fs.createWriteStream(`client${client.id}.txt`);

    client.on('data', (data)=>{
        if(data==='REMOTE'){
            send_response(client, 'ACK');
        }else{
            my_writer(client, 'Client: '+ data);
            client_method_chain(client, data);
        }
    });
    client.on('end', () => {
        my_writer(client, `Client №${client.id} disconnected`);
    });
});

function client_method_chain(client, data){
    data = data.split(" ");
    stream_worker.behavior[data[0]](data, function(){
        send_response(client, 'Wait next operation...');
    })
}

server.listen(port, () => {
    console.log(`Server listening on localhost:${port}`);
});

function send_response(client, message){
    my_writer(client, 'You: '+message);
    client.write( message);
}

function my_writer(client, message){
    client.logger.write(message+'\n');
    console.log(message);
}