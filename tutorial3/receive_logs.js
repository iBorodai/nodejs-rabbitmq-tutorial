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
    exc.on('open', function(){
        //TODO - declare tmp queue, bind to exchange, subscribe, receive messages

        //Declare queue {exclusive-true, auto_delete-false}
        connection.queue(
            '',
            {
                exclusive : true,
                autoDelete : false
            },
            function( q ){
                console.log( 'queue '+q.name+' declired' );
                q.bind( 'logs', '' );
                console.log( '[x] wating for logs. To exit press CTRL+C' );

                //$channel->basic_consume($queue_name, '', false, true, false, false, $callback);
                //no_ack:true,
                q.subscribe(
                    function( message, headers, deliveryInfo, messageObj ){
                        console.log( " [x] %s", message.data.toString('utf-8')  );
                    }
                )
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