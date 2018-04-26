{
    let view = {
        el: '#app',
        render(data){
            let {song, status} = data
            $(this.el).css('background-image', `url(${song.cover})`)
            $(this.el).find('img.cover').attr('src', song.cover)
            if($(this.el).find('audio').attr('src') !== song.url){
                // 防止暂停刷新url导致重头开始播放。
                $(this.el).find('audio').attr('src', song.url)
            }
            if(status === 'playing'){
                $(this.el).find('.disc-container').addClass('playing')
            }else{
                $(this.el).find('.disc-container').removeClass('playing')
            }
        },
        play(){
            $(this.el).find('audio')[0].play()
        },
        pause(){
            $(this.el).find('audio')[0].pause()
        }
    }
    let model = {
        data:{
            song:{
                id:'',
                name:'',
                singer:'',
                url:'',
            },
            status: 'paused'  
        },
        get(id){
            var query = new AV.Query('Song');
            return query.get(id).then((song)=> {
                Object.assign(this.data.song, {id: song.id, ...song.attributes})
                return song
            })
        }
    }
    let contorller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data)
                // this.view.play()
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click', '.icon-play',()=>{
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click', '.icon-pause',()=>{
                console.log('1')
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
        },
        getSongId() {
            let search = window.location.search   //获取查询参数
            if (search.indexOf('?') === 0) {
                search = search.substring(1)      //去掉查询参数前面的问号
            }

            let array = search.split('&').filter((v => v))
            //用&分开多条查询参数，并且过滤掉空字符串（多个&符号）
            let id = ''
            array.forEach(e => {
                let kv = e.split('=')
                let key = kv[0]
                let value = kv[1]
                if (key === 'id') {
                    id = value
                }
            })
            return id
        }
    }
    contorller.init(view, model)
}
  