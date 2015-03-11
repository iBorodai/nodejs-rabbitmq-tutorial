var amqp = require( '../node_modules/amqp' );
//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

connection.on( 'ready' , function (){
    console.log( 'rabbit connected...' );
    connection.publish('hello_queue', 'Hello rabbit!!!')
    /*
    -- this callback newer called because
    -- "will get called if the exchange is in confirm mode" (documentation)
    -- so, not yhis case
     .addCallback(function(wasError) {
    console.log('publish callback');
    });
    */
    console.log('message published');
  setTimeout(function(){
    connection.destroy();
    },100);
});

connection.on( 'error' , function(e){
    console.log( e );
});

connection.on( 'close' , function(){
    console.log( 'rabbit connection closed' );
});