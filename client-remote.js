const net = require('net');
const fs = require('fs');
const path = require('path');
const port = 8003;
let methods = ["COPY", "ENCODE", "DECODE"];
const file = "E:/CWP/cwp-04/test_file";

const client = new net.Socket();
client.setEncoding('utf8');
client.connect(port, ()=> {
    send_request('REMOTE');
});
client.file_id = 1;

client.on('data', (data)=>{
    console.log('Server: ' + data);
    if(data === 'DEC') {
        client.destroy();
    }else{
        send_commands();
    }
});

function send_commands(){
    if(methods.length>0){
        send_request(`${methods.shift()} ${file}${client.file_id}.txt ${file}${client.file_id+1}.txt 111`);
        client.file_id++;
    }else{
        client.destroy();
    }
}

function send_request(message){
    client.write(message);
    console.log('You: ' + message);
}

client.on('close', function() {
    console.log('Connection closed');
});