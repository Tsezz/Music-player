{
    let view = {
        el:'section.songs',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            let {songs} = data
            console.log(songs)
            console.log(data)
            songs.map((song)=>{
                console.log(song)
                let $li = $(`
                    <li>
                        <h3>${song.name}</h3>
                        <p>
                            <svg class="icon icon-sq">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
                            </svg>
                            ${song.singer}
                        </p>
                        <a class="playButton" href="#">
                            <svg class="icon icon-play">
                                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
                            </svg>
                        </a>
                    </li>
                    `)
                    this.$el.find('ol.list').append($li)
            })
        }
    }
    let model = {
        data: {
            songs: []
        },
        find(){
            // 从 LeanCloud里查询所有歌曲信息
            var query = new AV.Query('Song')
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id: song.id, ...song.attributes}
                })
                return this.data.songs
            })
        }
    }
    let contorller = {
        init(view,model){
           this.view = view
           this.view.init()
           this.model = model 
           this.model.find().then(()=>{
               this.view.render(this.model.data)
           })
        }
    }
    contorller.init(view,model)
}