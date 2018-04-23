{
    let view = {
        el: '.newSong',
        template: `
            新建歌曲
        `,
        render(data) {
            $(this.el).html(this.template)
            //获取集合中第一个匹配元素的HTML内容 或 #设置#每一个匹配元素的html内容。
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.active()
            window.eventHub.on('upload', (data) =>{
                this.active()
            })
        },
        active(){
            $(this.view.el).addClass('active')
        }
    }
    controller.init(view,model)
}