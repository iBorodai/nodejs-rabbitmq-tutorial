var amqp = require( '../node_modules/amqp' );

var severities = process.argv.slice(2);
console.log(severities);
if( severities.length<1 ){
    console.log("Usage: $argv[0] [info] [warning] [error]");
    process.exit();
}

//createConnection returns net.Socket instance
var connection = amqp.createConnection( {host:'localhost'} );

connection.on( 'ready' , function (){
    console.log( 'rabbit connected...' );

    //declare exchange
    var exc = connection.exchange(
        'topic_logs',
        {
            type:'topic',
            autoDelete:false
        },
        function (exchange) {
          console.log('Exchange ' + exchange.name + ' is open');
        }
    );
    exc.on('error', function(e){console.log('[x]exchangeError:',e)});
    exc.on('open', function(){
        connection.queue(
            '',
            {
                exclusive : true,
                autoDelete : false
            },
            function( q ){
                console.log( 'queue '+q.name+' declired' );

                //bind for all severities
                for( i in severities ){
                    q.bind( 'topic_logs', severities[i] );
                }
                q.on('error',function(e){
                    console.log('[x]queueError:',e);
                });
                q.on('queueBindOk',function(){
                  console.log( '[x] wating for logs. To exit press CTRL+C' );

                  //$channel->basic_consume($queue_name, '', false, true, false, false, $callback);
                  //no_ack:true,
                  this.subscribe(
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