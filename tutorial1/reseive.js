var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection({host:'localhost'}),
        queue = false;

connection.on( 'ready' , function(){
  console.log('rabbit connected');
    queue = connection.queue(
        'hello_queue',
        {autoDelete:false},
        function( q ) {
            console.log( 'queue '+q.name+' defined. Wating for message...' );
            q.subscribe( function( message, headers, deliveryInfo, messageObj ) {
                console.log( '[X]'+message.data.toString('utf-8') );
            } );
        }
    );
  queue.on('error', function(e){
        console.log(e)
    } );
});
connection.on( 'error' , function(e){ console.log( 'Error:', e ); } );
connection.on( 'close' , function(){console.log( 'rabbit connection closed' ); }  );