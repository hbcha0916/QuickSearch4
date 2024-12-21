var basicModal = {
    modalParentTag: null,
    messageTitle: null,
    message: null,
    okCallbacks: null,
    cancelCallbacks: null,
    // init: (modalParentTag, messageTitle, message, okCallbacks, cancleCallbacks=null) => {
    init: (modalParentTag, messageTitle, okCallbacks, cancleCallbacks=null) => {
        var self = basicModal
        self.modalParentTag = modalParentTag;
        self.messageTitle = messageTitle;
        // self.message = message;
        self.okCallbacks = okCallbacks;
        self.cancelCallbacks = cancleCallbacks;
    },
    alert: () => {
        var self = basicModal;
        $(self.modalParentTag+" #modal-title").html(self.messageTitle);
        // $(self.modalParentTag+" #modal-body-text").html(self.message);
        $(self.modalParentTag+" #modalAlert").modal('show');


        $(self.modalParentTag+" #modalBtnOK").off().on('click', function(){
            // event.preventDefault();
            $(self.modalParentTag+" #modalAlert").modal('hide');
            for(var i=0;i<self.okCallbacks.length; i++)
                self.okCallbacks[i]();
        })
        
    }
}