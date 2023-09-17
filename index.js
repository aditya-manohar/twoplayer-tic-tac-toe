const express = require('express');
const app = express();

const path = require('path');
const http = require('http');
const {Server} = require('socket.io');

const server = http.createServer(app);

const io = new Server(server);
app.use(express.static(path.resolve("")));

let arr=[]
let playingArr = []

io.on("connection",(socket)=>{
    socket.on("find",(e)=>{
        if(e.name != null)
        {
            arr.push(e.name)

            if(arr.length >= 2)
            {
                let p1obj = {
                    p1name : arr[0],
                    p1value : "X",
                    p1move : ""
                }

                let p2obj = {
                    p2name : arr[1],
                    p2value : "O",
                    p2move : ""
                }

                let obj = {
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }

                playingArr.push(obj);

                arr.splice(0,2)

                io.emit("find",{allPlayers:playingArr});
            }
        }
    })

    socket.on("play",(e)=>{
        if(e.value == 'X')
        {
            let objtochange = playingArr.find(obj => obj.p1.p1name === e.name);

            objtochange.p1.p1move = e.id 
            objtochange.sum++; 
        }

        else if(e.value == 'O')
        {
            let objtochange = playingArr.find(obj => obj.p2.p2name === e.name);

            objtochange.p2.p2move = e.id 
            objtochange.sum++; 
        }

        io.emit("play",{allPlayers:playingArr});
    })

    socket.on("gameover",(e)=>{
        playingArr = playingArr.filter(obj => obj.p1.p1name !== e.name);
        console.log(playingArr);
    })
})

app.get("/",(req,res)=>{
    return res.sendFile("index.html");
})

server.listen(3000,()=>{
    console.log("server running");
});