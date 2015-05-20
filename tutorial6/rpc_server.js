var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

connection.on( 'ready' , function (){
    console.log( 'rabbit connected...' );
    //declare queue
    connection.queue(
        'rpc_queue',
        {
            autoDelete : true
        },
        function( q ){

            q.subscribe(
                {
                    prefetchCount: 1,
                    ack:true
                },
                function( message, headers, deliveryInfo, messageObj ){
                    //console.log(message);
                    var n = parseInt( message.data.toString('utf-8') ),
                    fibV = fib(n);
                    console.log( " [.] fib("+ n +") = " + fibV );

                    //The message can be either a Buffer or Object. A Buffer is used for sending raw bytes; an Object is converted to JSON.
                    //https://github.com/postwait/node-amqp#exchangepublishroutingkey-message-options-callback
                    var publishOpts={
                        delivery_mode: 2,    //"delivery_mode:2" - make message persistent    http://www.rabbitmq.com/tutorials/tutorial-two-php.html
                        correlationId: ''+deliveryInfo.correlationId
                        //,replyTo: deliveryInfo.callbackQueueName
                    };

                    var pres = connection.publish(
                        ''+deliveryInfo.replyTo,
                        ''+fibV,
                        publishOpts
                        // callback newer called in this case, becouse defaultExchange has no <options.confirm> (and could not have, couse of it inited without any params... fuck!)
                        //, function(wasError){ if(!wasError) console.log( 'sent back to '+deliveryInfo.callbackQueueName ); }
                    );
                    //Just call shift without callbacks!
                    q.shift();
                }
            ).once('error', function onError(error) {
                console.log(error);
            }).once('basicQosOk', function subscribed() {
                //it is supposed it is emmited when subscription is ready, but...
                //it seems is not working :(
                //https://github.com/postwait/node-amqp/issues/264
            }).addCallback(function subscribed(ok){
                console.log( '[x] Awaiting RPC requests. To exit press CTRL+C' );
            });
        }
    )
}).on( 'error' , function(e){
    console.log( e.stack );
}).on( 'close' , function(){
    console.log( 'rabbit connection closed' );
});


function fib($n) {
    if ($n == 0) return 0;
    if ($n == 1) return 1;
    return fib($n-1) + fib($n-2);
}