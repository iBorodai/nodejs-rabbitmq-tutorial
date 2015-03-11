var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

connection.on( 'ready' , function (){
    console.log( 'rabbit connected...' );

    var severity = process.argv[2] || 'info';
    var data = (process.argv.length>2) ? process.argv.slice( 3 ).join(' ') : 'Hello rabbit!';

    //declare "direct_logs" exchange
    var exc = connection.exchange(
        'direct_logs',
        {
            type:'direct',
            autoDelete:false
        },
        function (exchange) {
            console.log('Exchange ' + exchange.name + ' is open');
            exchange.publish( severity, data );
            console.log('-- message published:',severity, data);
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