function showList(names) {
    console.log("Recieved: " + names);
    
    for (var i = 0; i < names.length; i++) {
        var html = "<li>" + names[i] + "</li>";
        $("ul.castlist-list").append(html);
    }

    $("ul.castlist-list").append("test");
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    showList(request.data);
});