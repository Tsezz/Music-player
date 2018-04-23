window.eventHub = {
    events: {

    },
    emit(eventName, data){     //发布
        for(let key in this.events){
            if(key === eventName){
                let fnList = this.events[key]
                fnList.map((fn)=>{         //遍历需要包含需要执行函数的数组，并且调用。
                    fn.call(undefined, data)     //传入参数data
                })
            }
        }
    },
    on(eventName, fn){        //订阅的事件和执行的回调函数。
        if(this.events[eventName] === undefined){
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }   
}