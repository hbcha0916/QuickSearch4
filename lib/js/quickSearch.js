var quickSearch = {
    data: {
        
    },
    init: () => {
        settings.init();
        
    },

    getSuggestQueries: () => {
        var str = $('#searchString').val();
        $.ajax({
            url: "https://suggestqueries.google.com/complete/search?output=chrome&hl=ko&q="+str,
            dataType: "json",
            method: "GET",
            success: data => {
                $("#suggestArea").empty();
                var maxNum = 8;
                if(data[1].length<maxNum){
                    maxNum = data[1].length;
                }

                if(maxNum>0){
                    for(var i = 0; i<maxNum; i++){
                        if (data[1][i]!=undefined || data[1][i]!=null || data[1][i]!=""){
                            var tagString = `<div class="col col-sm-auto link sgLink" id="Q_U-ICKSEARCH4_${data[1][i]}">${data[1][i]}</div>`
                            $("#suggestArea").append(tagString);
                        }
                    }
                }
            }
        })
        
    }

    
}
$(document).on('click', '.linkBTN', function(event){
    var self = settings;
    var linkID = $(this).first().attr('id');
    self.goURL(linkID);
});

$(document).on('click', '#settingModalShowBTN', function(event){
    var self = settings;
    self.modal.alert();
});

$(document).on('click', '.setLinkBTN', function(event){
    var self = settings;
    var linkID = $(this).first().attr('id');
    if($('#isLinkDel').prop('checked')){
        self.setURL(linkID,this,option="del");
    }else{
        self.setURL(linkID,this);
    }
    
});

$(document).on('click', '#addLink', function(){
    var self = settings;
    var linkID = $(this).first().attr('id');
    self.setURL("",this,option="add");
});

$(document).on('click', '#goMyBlog', function(){
    var URL = "https://hbcha0916.tistory.com/";
    chrome.tabs.create({url:URL});
});

$(document).on('click', '#goGitHub', function(){
    var URL = "https://github.com/hbcha0916/QuickSearch4";
    chrome.tabs.create({url:URL});
});

$(document).on('click', '.sgLink', function(event){
    var self = settings;
    var keyword = $(this).attr('id');
    self.goSearch(keyword);
});

$(document).on('click', '[name="searchEngineOpt"]', function(event) {
    var self = settings;
    var searchEngine = $(this).attr('id');
    self.setSearchEngine(searchEngine);
    
});

$(document).on('click', '.removeStickerBTN', function(event) {
    var self = widget;
    var objID = $(this).attr('id');
    self.sticker.removeSticker(objID);
    
});

$(document).on('click', '.stickerAppendBTN', function(event) {
    var self = widget;
    self.sticker.appendSticker();
    
});

$(document).on('keyup', '#searchString', function(){
    var self = quickSearch;
    self.getSuggestQueries();
});

document.addEventListener("DOMContentLoaded", function (){
    document.addEventListener('hide.bs.modal', function(event) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });
});

$(document).on('keydown', 'body', function(event) {
    var self = settings;
    if (!$(event.target).is('.stickerInput') && event.key === 'Enter') {
        const textValue = $("#searchString").val();
        self.goSearch(textValue);
    }
});

$(document).on('keyup', '.stickerInput', function(event) {
    var self = widget;
    self.saveData($(event.target).attr('id'));
});

$(document).ready(()=>{
    setLocales();
    quickSearch.init();
});