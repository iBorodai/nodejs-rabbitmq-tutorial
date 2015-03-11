var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

connection.on( 'ready' , function (){
	console.log( 'rabbit connected...' );

	var data = process.argv[2] || 'Hello rabbit!';

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
		connection.publish(
			'task_queue',
			data
		);
	  console.log('message published');
	});

	//Need timeout to send message complete
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