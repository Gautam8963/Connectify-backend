const socket = require('socket.io')

const initializeSocket = (server) => {
    const io = socket(server,{
        cors: {
            origin: "5173 "
        },
    });
    
    io.on("connection", (socket) => {
        // Handle events
        
        socket.on("joinChat", ()=>{

        })

    });
}

module.exports = initializeSocket;