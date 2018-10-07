const stream = require('fs');
const crypto = require('crypto');
const streamer = {};
let methods = {
    COPY: "COPY",
    ENCODE: "ENCODE",
    DECODE: "DECODE"
};

streamer.behavior = {};

streamer.behavior[methods.COPY] =  (data,callback) => {
    streamer.create_streams(data, function(my_streams){
        my_streams[0].pipe(my_streams[1]).on('close', () => { callback();})
    });
    
};

streamer.behavior[methods.ENCODE] =  (data,callback) =>{
    streamer.create_streams(data, function (my_streams){
        my_streams[0].pipe(crypto.createCipher('aes192', data[3])).pipe(my_streams[1]).on('close', ()=>{callback();});
    });
};

streamer.behavior[methods.DECODE] =  (data,callback)=>{
    streamer.create_streams(data, function(my_streams){
        my_streams[0].pipe(crypto.createDecipher('aes192', data[3])).pipe(my_streams[1]).on('close', ()=>{callback();});
    });
};

streamer.create_streams = function(data,collback){
    collback( [stream.createReadStream(data[1]), stream.createWriteStream(data[2])]);

};


module.exports = streamer;