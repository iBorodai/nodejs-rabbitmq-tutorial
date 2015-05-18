var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

connection.on( 'ready' , function (){
    console.log( 'rabbit connected...' );

    //declare "topic" exchange
    var exc = connection.exchange(
        'topic_logs',
        {
            type:'topic',
            autoDelete:false
        },
        function (exchange) {
            var routing_key = process.argv[2] || 'anonymous.info';
            var data = (process.argv.length>2) ? process.argv.slice( 3 ).join(' ') : 'Hello rabbit!';

            console.log('Exchange ' + exchange.name + ' is open');
            exchange.publish( routing_key, data );
            console.log('-- message published:',routing_key, data);
        }
    );

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