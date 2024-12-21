var settings = {
    initPopupMode: false,

    modal: {},
    
    data: {},
    globalData: {},

    nothingData: [],
    linkMapping: {},
    searchEngineMapping: {
        Google: "https://www.google.com/search?q=",
        Naver: "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=",
        Youtube: "https://www.youtube.com/results?search_query=",
        StackO: "https://stackoverflow.com/search?q=",
        Trans: ""
    },

    checkBoxSetList: ['isDarkmode',
        'isNewTab',
        'useCustomWallpaper',
        'useClock',
        'useSticker'
    ],

    checkBoxGlobalSetList: ['floatingService','useDrag','usePapago'],

    userSetStringTagID: ["wallpaperURL"],

    init: (initPopupMode=false) => {
        var self = settings;
        self.initPopupMode = initPopupMode;
        if(!initPopupMode){
            $.extend(true, self.modal, basicModal);
            self.modal.init(
                '#settingModal',
                `${getLocales("str22")} | QuickSearch4.0 | by.hbcha0916`,
                [()=>{
                    var self = settings;
                    self.saveUserCheckBoxSetting();
                    self.saveUserString();
                    // 가장 마지막 
                    self.saveInChromeStorage(self.data);
                    self.saveInChromeStorage(self.globalData, reload=true,globalOpt=true);
                }]
            )
        }
        
        // TEST
        // var initData = {
        //     wallpaper: "default",
        //     isDarkmode: true,
        //     userLink: [{linkName: "naver", linkURL: "https://naver.com"},{linkName: "google", linkURL: "https://google.com"}],
        //     userLinkLen: 2,
        //     isNewTab: false
        // }
        // self.saveInChromeStorage(initData);

        // var initData = {
        //     floatingService: true,
        //     defaultSearchURL: "https://www.google.com/search?q="
        // }
        // stringData = JSON.stringify(initData);
        // self.saveInChromeStorage(initData,reload=false,globalOpt=true);
        // TEST END

        

        // self.modal.alert();

        
        

        self.loadInChromeStorage();
        // 이후 설정값 load는 `setting`에서 수행.
    },

    loadInChromeStorage: () => {
        var self = settings;
        var getData = ["quickSearch4Data","quickSearchGlobal"];
        chrome.storage.sync.get(getData, result => {
            for(var i = 0; i < getData.length; i++){
                var stringData = result[getData[i]];
                if(stringData === undefined){
                    // 최초실행일경우(데이터가 없다)
                    if(getData[i] === "quickSearch4Data"){
                        self.data.userLink = [];
                        self.data.userLinkLen = 0;
                        self.data.searchEngine = "Google"
                        if(self.initPopupMode){
                            $(".notReady").show();
                        }else{
                            self.saveUserCheckBoxSetting();
                            self.saveUserString();
                            self.saveInChromeStorage(self.data);
                            self.modal.alert();
                        }
                    }else if(getData[i] === "quickSearchGlobal"){
                        var initData = {
                            floatingService: true
                        }
                        stringData = JSON.stringify(initData);
                        self.saveInChromeStorage(initData,reload=false,globalOpt=true);
                    }
                    // self.saveInChromeStorage(initData);
                    // stringData = JSON.stringify(initData);
                    // 초기값 설정하기END
                }
                if(stringData!=undefined){
                    var jsonData = JSON.parse(stringData);
                    if(getData[i] === "quickSearch4Data"){
                        self.data = jsonData;
                        
                    }else if(getData[i] === "quickSearchGlobal"){
                        self.globalData = jsonData;
                    }
                }
                
                
            }
            self.setting();
        });
    },

    setting: () => {
        var self = settings;
        // TODO: 설정값 로드함수실행
        self.globalData.UILanguage = chrome.i18n.getUILanguage().split("-")[0];
        if(!self.initPopupMode){
            self.changeMode(); //다크모드
            self.loadUserString();
            self.saveInChromeStorage(self.globalData, reload=false,globalOpt=true);
            self.loadUserLink();
        }
        self.showWallpaper();
        self.loadUserCheckBoxSetting();
        self.loadSearchEngine();

        widget.init(self.initPopupMode);

        // 설정값 로드함수실행END
    },

    setSearchEngine: (engine) => {
        var self = settings;
        var engineString = engine.replace("searchEngine","");
        self.data.searchEngine = engineString;
        self.globalData.defaultSearchURL = self.searchEngineMapping[self.data.searchEngine];
        self.saveInChromeStorage(self.data);
        self.saveInChromeStorage(self.globalData, reload=false,globalOpt=true);
    },

    showWallpaper: () => {
        var self = settings;
        self.data.wallpaper = self.data.wallpaperURL;
        if(self.data.useCustomWallpaper){
            if(self.data.wallpaper === "default" || self.data.wallpaper.replace(" ","") === ""){
                $("#wallpaper").css('background-image', 'url("../../defaultWallpaper.jpg")');
                $('#useCustomWallpaper').prop('checked',false);
            }else{
                $("#wallpaperURL").text(self.data.wallpaper);
                $("#wallpaper").css('background-image', `url(${self.data.wallpaper})`);
            }
        }else{
            $("#wallpaper").css('background-image', 'url("../../defaultWallpaper.jpg")');
        }
    },

    saveInChromeStorage: (data, reload=false, globalOpt=false) => {
        var stringData = JSON.stringify(data);
        var saveType = "quickSearch4Data";
        if(globalOpt){
            saveType = "quickSearchGlobal";
        }
        chrome.storage.sync.set({[saveType]: stringData}, () => {
            if(reload){
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length > 0) {
                        // 현재 탭 새로고침
                        chrome.tabs.reload(tabs[0].id);
                    }
                });
            }
        });
    },

    loadUserLink: () => {
        var self = settings;
        // 비우고 다시그린다.
        $('#userLinks').empty();
        $('#setUserLinks').empty();
        for(var i = 0; i < self.data.userLinkLen; i++){
            var linkName = self.data.userLink[i].linkName;
            var linkURL = self.data.userLink[i].linkURL;
            // 링크매핑에 값 추가
            self.linkMapping[`link_${linkName}`] = linkURL;

            var tagString = `<div class="col-sm-auto link linkBTN" id="link_${linkName}">${linkName}</div>`
            var tagSetString = `<div class="col-sm-auto link setLinkBTN" id="set_${linkName}">${linkName}</div>`
            $('#userLinks').append(tagString);
            $('#setUserLinks').append(tagSetString);
        }
    },

    saveUserString: () => {
        var self = settings;
        var ignoreSet = ["wallpaperURL"];
        for(var i=0; i<self.userSetStringTagID.length; i++){
            if(ignoreSet.includes(self.userSetStringTagID[i])){
                continue;
            }
            self.data[self.userSetStringTagID[i]] = $(`#${self.userSetStringTagID[i]}`).val();
        }
    },

    saveUserCheckBoxSetting: () => {
        var self = settings;
        var ignoreSet = ["useCustomWallpaper"];

        for(var i =0; i<self.checkBoxSetList.length; i++){
            if(ignoreSet.includes(self.checkBoxSetList[i])){
                continue;
            }
            self.checkBoxSetBinder(self.checkBoxSetList[i]);
        }

        for(var i =0; i<self.checkBoxGlobalSetList.length; i++){
            self.checkBoxSetBinder(self.checkBoxGlobalSetList[i],globalOpt=true);
        }

    },

    loadSearchEngine: () => {
        var self = settings;
        $(`#searchEngine${self.data.searchEngine}`).prop('checked',true);
    },

    loadUserString: () => {
        var self = settings;

        for(var i=0; i<self.userSetStringTagID.length; i++){
            $(`#${self.userSetStringTagID[i]}`).val(self.data[self.userSetStringTagID[i]]);
        }
    },

    loadUserCheckBoxSetting: () => {
        var self = settings;

        for(var i =0; i<self.checkBoxSetList.length; i++){
            self.checkBoxLoadBinder(self.checkBoxSetList[i]);
        }

        for(var i =0; i<self.checkBoxGlobalSetList.length; i++){
            self.checkBoxLoadBinder(self.checkBoxGlobalSetList[i],globalOpt=true);
        }
    },

    checkBoxSetBinder: (setName, globalOpt=false, trueVal=true, falseVal=false) => {
        var self = settings;
        if(!globalOpt){
            if($(`#${setName}`).prop('checked')){
                self.data[setName] = trueVal;
            }else{
                self.data[setName] = falseVal;
            }
        }else{
            if($(`#${setName}`).prop('checked')){
                self.globalData[setName] = trueVal;
            }else{
                self.globalData[setName] = falseVal;
            }
        }
    },

    checkBoxLoadBinder: (setName, globalOpt=false, trueVal=true, falseVal=false) => {
        var self = settings;
        if(!globalOpt){
            if(self.data[setName]){
                $(`#${setName}`).prop('checked',trueVal)
            }else{
                $(`#${setName}`).prop('checked',falseVal)
            }
        }else{
            if(self.globalData[setName]){
                $(`#${setName}`).prop('checked',trueVal)
            }else{
                $(`#${setName}`).prop('checked',falseVal)
            }
        }
        
    },

    goURL: (linkID) => {
        var self = settings;
        var URL = self.linkMapping[linkID];
        if(self.data.isNewTab){
            // 탭생성후 URL이동
            chrome.tabs.create({url:URL});
        }else{
            // 현재탭에 URL이동
            chrome.tabs.update({url:URL});
        }
    },

    goSearch: (keyword) => {
        var self = settings;
        var keywordString = keyword.replace("Q_U-ICKSEARCH4_","");
        var URL = `${self.searchEngineMapping[self.data.searchEngine]}${keywordString}`
        if(self.data.searchEngine === "Trans"){
            URL = `https://translate.google.co.kr/?sl=auto&tl=${self.globalData.UILanguage}&text=${keywordString}&op=translate`

            if(self.globalData.usePapago){
                URL = `https://papago.naver.com/?sk=auto&tk=${self.globalData.UILanguage}&hn=0&st=${keywordString}`
            }
        }
        
        if(self.data.isNewTab){
            chrome.tabs.create({url:URL});
        }else{
            chrome.tabs.update({url:URL});
        }
    },

    // 독바를 설정합니다.
    setURL: (linkID, object, option="edit") => {
        // 기본값은 수정입니다.
        var self = settings;
        var mappingID = linkID.replace("set_","link_");
        var oldLinkName = linkID.replace("set_","");
        var oldLinkURL = self.linkMapping[mappingID];
        if(linkID===""){
            oldLinkURL = ""
        }

        // 1차분기
        if(option === "edit" || option === "add"){
            // var newLinkName = prompt("링크이름을 입력해 주세요.",oldLinkName);
            var newLinkName = prompt(getLocales("str20"),oldLinkName);
            // var newLinkURL = prompt("URL을 입력해 주세요.",oldLinkURL);
            var newLinkURL = prompt(getLocales("str21"),oldLinkURL);
        }
        // 2차분기
        if(option === "add" && newLinkName !="" && newLinkURL != ""){
            self.data.userLinkLen += 1;
            self.data.userLink.push({linkName: newLinkName});
            self.data.userLink[self.data.userLinkLen-1].linkURL = newLinkURL;
            self.linkMapping[`link_${newLinkName}`] = newLinkURL;
            var tagSetString = `<div class="col-sm-auto link setLinkBTN" id="set_${newLinkName}">${newLinkName}</div>`
            $('#setUserLinks').append(tagSetString);
            // 추가일경우 여기서 끝납니다.
        }

        for(var i = 0; i < self.data.userLinkLen; i++){
            var linkName = self.data.userLink[i].linkName;
            // 3차분기
            if(linkName === oldLinkName){
                if(option === "edit"  && newLinkName !="" && newLinkURL != ""){
                    self.data.userLink[i].linkName = newLinkName;
                    self.data.userLink[i].linkURL = newLinkURL;
                    delete self.linkMapping[mappingID]
                    self.linkMapping[`link_${newLinkName}`] = newLinkURL;
                    $(object).text(newLinkName);
                    $(object).attr("id", `set_${newLinkName}`);
                }else if(option === "del"){
                    self.data.userLink.splice(i,1);
                    self.data.userLinkLen -= 1;
                    $(object).remove();
                    delete self.linkMapping.mappingID;
                    break;
                }
            }
        }


        
    }, 

    changeMode: () => {
        if(settings.data.isDarkmode === true){
            $('body').addClass("dark");
            $("body").attr("data-bs-theme", "dark");
        }else{
            $('body').removeClass("dark");
            $("body").attr("data-bs-theme", "");
        }
    }

    
}

var popupSettings = {

}