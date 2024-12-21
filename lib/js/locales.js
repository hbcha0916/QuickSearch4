function setLocales(){

    var bodyTags = document.getElementsByTagName('body');

    for (var i = 0; i < bodyTags.length; i++){
        var isSuccess = false;

        var tag = bodyTags[i];

        var msgString = tag.innerHTML.toString();

        var setString = msgString.replace(/__MSG_(\w+)__/g, (__, result) => {
            if(result){
                isSuccess = true;
                return chrome.i18n.getMessage(result);
            }else{
                return "";
            }
        });


        if(isSuccess)
        {
            tag.innerHTML = setString;
        }
    }
}

function getLocales(name){
    return chrome.i18n.getMessage(name);
}