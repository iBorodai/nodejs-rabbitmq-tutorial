var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

connection.on( 'ready' , function (){
	console.log( 'rabbit connected...' );

	var data = process.argv[2] || 'Hello rabbit!';

	connection.publish(
		'task_queue',
		data,
		{ deliveryMode:2 } //make message persistent
	);
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