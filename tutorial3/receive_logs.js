var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

connection.on( 'ready' , function (){
    console.log( 'rabbit connected...' );

    //declare exchange
    var exc = connection.exchange(
        'logs',
        {
            type:'fanout',
            autoDelete:false
        },
        function (exchange) {
          console.log('Exchange ' + exchange.name + ' is open');
        }
    );
    exc.on('error', function(e){console.log('[x]ExchangeError:',e);});
    exc.on('open', function(){
        //Declare queue {exclusive-true, auto_delete-false}
        connection.queue(
            '',
            {
                exclusive : true,
                autoDelete : false
            },
            function( q ){
                console.log( 'queue '+q.name+' declired' );
                //Binding queue to exchange
                q.on('error',function(e){console.log('[x]ERROR:',e)});
                q.on('queueBindOk',function(e){console.log('event:queueBindOk');});
                q.bind( 'logs', '' ,function(queue){
                    console.log( '[x] wating for logs. To exit press CTRL+C' );
                    //no_ack:true - default
                    queue.subscribe(
                        function( message, headers, deliveryInfo, messageObj ){
                            console.log( " [x] %s", message.data.toString('utf-8')  );
                        }
                    )
                });
            }
        )

    });
});

connection.on( 'error' , function(e){
    console.log( e );
});
connection.on( 'close' , function(){
    console.log( 'rabbit connection closed' );
});