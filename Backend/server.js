//stashing concept local
//git stash
//git pull origin master
//git stash pop
//git stash apply
//git stash clear

const app = require('./app');
const debug = require('debug')('node-angular');
const http = require('http');
process.env.UV_THREAD_POOL_SIZE = 1024;
const normalizePort = (val) => {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
};

const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shuttig down gracefully.');
    server.close(() => {
        console.log('Process terminated');
    });
});

const onListening = () => {
    const addr = server.address();
    const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
    debug('Listening on ' + bind);
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);

server.listen(port, () => {
    console.log(`SERVER LISTENING ON PORT ${port}`);
});
