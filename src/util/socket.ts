import io from 'socket.io-client'
import {getCookieMsgToken} from "@/util/auth"
const {VITE_MESSAGE_CENTER} = process.env

const socket = io(VITE_MESSAGE_CENTER, {
  query: {
    token: "Bearer " + getCookieMsgToken()
  },
  transports: ['websocket', 'polling'],
  timeout: 5000,
  autoConnect: false, // 避免挂载时候就尝试连接
})

socket.reconnect = function(){
  if (socket && socket.connected) {
    return
  }else if (socket && !socket.connected) {
    socket.query.token = "Bearer " + getCookieMsgToken()
    socket.connect()
    console.log("socket reconnect")
  }
}

socket.on('connect', function(){
  console.log('socket connect status:' + socket.connected)
})

socket.on('reconnect', function(attemptNumber:any){
  console.log('socket reconnect:' + attemptNumber)
})
socket.on('disconnect', function(){
  console.log('socket disconnect status:' + socket.connected)
})

socket.on('error', (error:any)=>{
  console.error(error)
})

export default socket

