var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8080});

// 连接池
var clients = [];

wss.on('connection', function(ws) {
    // 将该连接加入连接池
    clients.push(ws);

    var userID = ws._ultron.id;
    var data = {'userID':userID};

    ws.send(JSON.stringify(data));

    ws.on('message', function(message) {
        // 广播消息
        var message = JSON.parse(message);
        if(message['userID']){
            var temp = message['userID'];
            clients.forEach(function(wsInClients){

                if(wsInClients._ultron.id == temp) {
                    console.log('success');
                    wsInClients.send(JSON.stringify({'logined':true}));
                }
            })
        }else{
            var temp = {'mes':message};
            clients.forEach(function(wsInClients){

                if(wsInClients !== ws) {
                    wsInClients.send(JSON.stringify(temp));
                }
            })
        }
    });

    ws.on('close', function() {
        // 连接关闭时，将其移出连接池
        clients = clients.filter(function(wsInClients){
            return wsInClients !== ws
        })
    });

    ws.on('error', function() {
        // 连接出错时，将其移出连接池
        clients = clients.filter(function(wsInClients){
            return wsInClients !== ws
        })
    });
});