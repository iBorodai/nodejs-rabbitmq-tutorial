var amqp = require( '../node_modules/amqp' );

//createConnection returns net.Socket instance
var connection = amqp.createConnection({host:'localhost'}),
        queue = false;

connection.on( 'ready' , function(){
  console.log('rabbit connected');
    queue = connection.queue(
        'task_queue',
        {
            autoDelete:false
        },
        function( q ) {
            console.log( 'queue '+q.name+' defined. Wating for message...' );
            q.subscribe(
                {
                    prefetchCount: 1,
                    ack:true
                },
                function( message, headers, deliveryInfo, messageObj ) {
                    var data=message.data.toString('utf-8');
                    var sec=( data.split('.').length-1 );
                    console.log( '[X]'+data+' ('+sec+' sec)' );
                    setTimeout(
                        function(){
                            console.log('[x] Done');
                            q.shift();
                        },
                        ( sec * 1000 )
                    );
                }
            )
            //q.on('basicQosOk',function(){ console.log('basicQosOk!!!'); }); Does not work :( -> https://github.com/postwait/node-amqp/issues/264
            .once('error', function(error) {
                console.log(error);
            }).once('basicQosOk', function() {
                //it is supposed it is emmited when subscription is ready, but...
                //it seems is not working :(
                //https://github.com/postwait/node-amqp/issues/264
            }).addCallback(function subscribed(ok){
                console.log('basicQosOk!!!');
            });
        }
    );
    queue.on('error', function(e){
        console.log(e)
    });
});
connection.on( 'error' , function(e){ console.log( 'Error:', e ); } );
connection.on( 'close' , function(){console.log( 'rabbit connection closed' ); }  );