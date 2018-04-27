{
    let view = {
        el: '#app',
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let { song, status } = data
            this.$el.find('.background').css('background-image', `url(${song.cover})`)
            this.$el.find('img.cover').attr('src', song.cover)
            if (this.$el.find('audio').attr('src') !== song.url) {
                // 防止暂停刷新url导致重头开始播放。
                let audio = this.$el.find('audio').attr('src', song.url).get(0)
                audio.onended = () => {
                    window.eventHub.emit('songEnd')   //不冒泡，无法事件委托。使用触发事件通知
                    //播放结束后触发一个事件给contorller
                }
                audio.ontimeupdate = () => {
                    this.showLyric(audio.currentTime)
                }
            }
            if (status === 'playing') {
                this.$el.find('.disc-container').addClass('playing')
            } else {
                this.$el.find('.disc-container').removeClass('playing')
            }
            this.$el.find('.song-description > h1').text(song.name)
            let { lyrics } = song
            lyrics.split('\n').map((string) => {
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)/
                let matches = string.match(regex)  //正则分别匹配到时间和歌词
                if (matches) {
                    p.textContent = matches[2]     //设置节点的文本内容,给每行歌词加上p标签
                    let time = matches[1]
                    let parts = time.split(':')
                    let minutes = parts[0]
                    let seconds = parts[1]
                    let newTime = parseFloat(minutes, 10) * 60 + parseFloat(seconds, 10)
                    p.setAttribute('data-time', newTime)  //在class里显示时间轴
                } else {
                    p.textContent = string
                }
                this.$el.find('.lyric> .lines').append(p)
            })
        },
        showLyric(time) {
            let allP = this.$el.find('.lyric>.lines>p')
            let p
            for (let i = 0; i <= allP.length - 1; i++) {
                let currentTime = allP.eq(i - 1).attr('data-time')
                let nextTime = allP.eq(i).attr('data-time')
                if (currentTime <= time && time < nextTime) {
                    p = allP[i - 1]
                    break
                }
            }
            let pHeight = p.getBoundingClientRect().top
            let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
            let height = pHeight - linesHeight
            this.$el.find('.lyric>.lines').css({
                transform: `translateY(${- (height - 25)}px)`
            })
            $(p).addClass('active').siblings('.active').removeClass('active')
        },
        play() {
            this.$el.find('audio')[0].play()
        },
        pause() {
            this.$el.find('audio')[0].pause()
        }
    }
    let model = {
        data: {
            song: {
                id: '',
                name: '',
                singer: '',
                url: '',
            },
            status: 'paused'
        },
        get(id) {
            var query = new AV.Query('Song');
            return query.get(id).then((song) => {
                // Object.assign(this.data.song, { id: song.id, ...song.attributes })
                console.log(song.attributes)
                Object.assign(this.data.song, {
                    id: song.id,
                    name: song.attributes.name,
                    singer: song.attributes.singer,
                    url: song.attributes.url,
                    cover: song.attributes.cover,
                    lyrics: song.attributes.lyrics
                })
                return song
            })
        }
    }
    let contorller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(() => {
                this.model.data.status = 'playing'   //打开页面自动开始播放和旋转。
                this.view.render(this.model.data)  
                this.view.play()
            })
            this.bindEvents()
        },
        bindEvents() {
            $(this.view.el).on('click', '.icon-play', () => {
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click', '.icon-pause', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
                this.view.pause()
            })
            window.eventHub.on('songEnd', () => {
                this.model.data.status = 'paused'
                this.view.render(this.model.data)
            })
            // window.eventHub.on('play', () => {
            //     console.log('111')
            //     this.model.data.status = 'playing'
            //     this.view.render(this.model.data)
            //     this.view.play()
            // })
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