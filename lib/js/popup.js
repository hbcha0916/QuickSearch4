var popup = {
    init:() => {
        settings.init(initPopupMode=true);
    }
}

$(document).on('click', '[name="searchEngineOpt"]', function(event) {
    var self = settings;
    var searchEngine = $(this).attr('id');
    self.setSearchEngine(searchEngine); 
});

$(document).on('click', 'body', function(event) {
    var self = settings;
    self.saveUserCheckBoxSetting();
    self.saveUserString();
    self.saveInChromeStorage(self.data);
    self.saveInChromeStorage(self.globalData, reload=false ,globalOpt=true);
});


$(document).ready(()=>{
    setLocales();
    popup.init();
});