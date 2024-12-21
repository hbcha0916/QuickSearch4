var widget = {
    initPopupMode: false,
    data: {
        sticker: []
    },
    init: (initPopupMode=false) => {
        var self = widget;
        var set = settings;

        self.initPopupMode = initPopupMode;

        if(set.data.useClock === undefined){
            set.data.useClock = false;
        }

        if(set.data.useSticker === undefined){
            set.data.useSticker = false;
        }

        if(set.data.useClock){
            self.clock.init();
        }

        self.loadInChromeStorage();

    },

    loadInChromeStorage: () => {
        var self = widget;
        var getData = ["quickSearchWidgetData"];
        chrome.storage.sync.get(getData, result => {
            for(var i = 0; i < getData.length; i++){
                var stringData = result[getData[i]];
                if(stringData === undefined){
                    // 최초실행일경우(데이터가 없다)
                    if(getData[i] === "quickSearchWidgetData"){
                        self.data = {
                            sticker: []
                        };
                    }
                    self.saveData();
                }
                if(stringData!=undefined){
                    var jsonData = JSON.parse(stringData);
                    if(getData[i] === "quickSearchWidgetData"){
                        self.data = jsonData;
                    }
                }
                
                
            }
            self.setting();
        });
    },

    setting: () => {
        var self = widget;
        var set = settings;

        if(set.data.useSticker){
            if(!self.initPopupMode){
                self.sticker.showSticker();
            }
        }
    },

    saveData: (idStinrg=null) => {
        var self = widget;
        if(idStinrg){
            var idIDX = idStinrg.replace("stickerInput_","");
            self.data.sticker[Number(idIDX)] = $(`#stickerInput_${idIDX}`).val();
        }
        var stringData = JSON.stringify(self.data);
        
        chrome.storage.sync.set({"quickSearchWidgetData": stringData}, () => {
            
        });
    },

    clock: {
        clockInterval: null,

        init: () => {
            var self = widget.clock;
            self.clockInterval = setInterval(self.updateClock, 1000);
        },

        updateClock: () => {
            var now = new Date();

            var year = now.getFullYear();
            var month = String(now.getMonth() + 1).padStart(2, '0');
            var day = String(now.getDate()).padStart(2, '0');

            var hours = String(now.getHours()).padStart(2, '0');
            var minutes = String(now.getMinutes()).padStart(2, '0');
            var seconds = String(now.getSeconds()).padStart(2, '0');

            
            if(settings.globalData.UILanguage === "ko"){
                $('#widgetClockDate').text(`${year}년${month}월${day}일`);
            }else{
                $('#widgetClockDate').text(`${month}-${day}-${year}`);
            }

            $('#widgetClockTime').text(`${hours}:${minutes}`);
            $('#widgetClockTimeSeconds').text(`${seconds}`);
            $("#widgetClock").show();
            
        },

        stop: () => {
            var self = widget.clock;
            clearInterval(self.clockInterval);
        }
    },

    sticker: {
        showSticker: () => {
            var self = widget;
            $('#widgetSticker').empty();
            for(var i = 0; i<self.data.sticker.length; i++){
                var tagString = `
                <div class="col-2" id="stickerIDX_${i}">
                    <div class="stickerOBJ">
                        <div class="row">
                            <div class="col text-end">
                                <div class="btn btn-danger btn-sm removeStickerBTN" id="removeSticker_${i}">X</div>
                            </div>
                        </div>
                        <div class="row stickerTextArea">
                            <div class="col">
                                <textarea class="stickerInput" id="stickerInput_${i}" spellcheck="false"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                `
                $("#widgetSticker").append(tagString);
                $(`#stickerIDX_${i} .stickerInput`).val(self.data.sticker[i]);
            }

            var lastAppendTagString = `
                <div class="col-2">
                    <div class="stickerOBJ stickerAppendBTN">
                        +
                    </div>
                </div>
                `
            $("#widgetSticker").append(lastAppendTagString);
            $("#widgetSticker").show();
        },

        removeSticker: (objID) => {
            var self = widget;
            var idIDX = objID.replace("removeSticker_","");
            $(`#stickerIDX_${idIDX}`).remove();
            self.data.sticker.splice(Number(idIDX),1);
            self.saveData();
            self.loadInChromeStorage();
        },

        appendSticker: () => {
            var self = widget; 
            self.data.sticker.push("");
            self.saveData();
            self.loadInChromeStorage();
        }
    }
}