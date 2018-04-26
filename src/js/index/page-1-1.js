{
    let view ={
        el: 'section.playlists',
        init(){
            this.$el = $(this.el)
        }
    }
    let model ={

    }
    let contorller ={
        init(view,model){
            this.view = view
            this.view.init()
            this.model = model
        }
    }
    contorller.init(view,model)
}