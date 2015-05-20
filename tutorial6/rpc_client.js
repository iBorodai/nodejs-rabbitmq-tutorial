var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

var id = Math.floor( Math.random()*(900-100)+100 );

connection.on( 'ready' , function (){
    console.log( 'rabbit connected...' );
    //declare callbackQueeue
    connection.queue(
        '',
        {
            autoDelete : true
        },
        function( callbackQ ){
            console.log( '[!] CallbackQ "'+ callbackQ.name +'" declared');

            callbackQ.subscribe(
                function( message, headers, deliveryInfo, messageObj ){
                    if( deliveryInfo.correlationId == id ) {
                        console.log( 'result:'+ parseInt( message.data.toString('utf-8') ) );
                        process.exit();
                    }
                }
            ).once('error', function onError(error) {
                console.log(error);
            }).once('basicQosOk', function subscribed() {
                //it is supposed it is emmited when subscription is ready, but...
                //it seems is not working :(
                //https://github.com/postwait/node-amqp/issues/264
            }).addCallback(function subscribed(ok){

                console.log( '[!] subscribed on "'+ callbackQ.name +'" callbackQ');

                //MAKE FIBONACCHI CALL
                var opts = {
                    //contentType: 'application/json',
                    //contentEncoding: 'utf-8',
                    delivery_mode: 2,    //"delivery_mode:2" - make message persistent    http://www.rabbitmq.com/tutorials/tutorial-two-php.html
                    correlationId: ''+id,
                    replyTo: ''+callbackQ.name
                };

                var number = process.argv[2] || 30;
                number = parseInt(number);

console.log('sending number:'+number);

                connection.publish(
                    'rpc_queue',
                    ( ''+number ),
                    opts
                    ,
                    function( wasError ){
                        if(!wasError) console.log( 'fibonachi RPC request sent' );
                        else console.log( 'sending error' );
                    }
                );
console.log('(after publish)');
            });
        }
    );
}).on('error', function(err){
    console.log(err);
});