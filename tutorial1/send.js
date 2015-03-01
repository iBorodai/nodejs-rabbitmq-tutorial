var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} ),
		exchange = false,
		queue =	false;

connection.on( 'ready' , function (){
	console.log( 'rabbit connected...' );
	connection.publish('hello_queue', 'Hello rabbit!!!');
  console.log('message published');
});

connection.on( 'error' , function(e){
	console.log( e );
});
connection.on( 'close' , function(){
	console.log( 'rabbit connection closed' );
});