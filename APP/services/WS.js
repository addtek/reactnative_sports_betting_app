export default class WS {
     static instance = null
    constructor(wslink){
        this.socket = new WebSocket(wslink) 
    }
    static getInstance = (wslink)=>{
        if(WS.instance === null){
            WS.instance = new WS(wslink);
        }
        return WS.instance
    }

    onSocketOpen(onOpenHandler){
        this.socket.onopen = (e)=>onOpenHandler(e)
    }
    onSocketMessage(onMessageHandler){
        this.socket.onmessage=(e)=>onMessageHandler(e)
    }
    onSocketClose(onCloseHandler){
        this.socket.onclose=(e)=>{onCloseHandler(e)}
    }
    onSocketError(onErrorHandler){
        this.socket.onerror=(e)=>onErrorHandler(e)
    }
    close(){
        this.socket.close()
    }
    send(data){
        this.getReadyState() === WebSocket.OPEN && this.socket.send(data)
    }
    getReadyState(){
        return this.socket.readyState
    }
}