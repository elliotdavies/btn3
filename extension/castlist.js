function tagNames(text) {
    console.log(text);
    $.ajax({
        type: "POST",
        url: "http://access.alchemyapi.com/calls/html/HTMLGetRankedNamedEntities",
        data: {
            "apikey": "a5c2da39dc22ae367ecae6192dbc0832c19fe087",
            "html": text,
            "outputMode": "json"
        },
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function(data){
            var names = [];
            console.log(data);
            for (var i = 0; i < data.entities.length; i++) {
                if (data.entities[i].type == "Person") names.push(data.entities[i].text);
            }

            for (var i = 0; i < names.length; i++) {
                text = text.replace(names[i], "<a href='#' class='castlist-actor'>" + names[i] + "</a>");
            }
            console.log(names);

            $('div.article-page').html(text);

            $("a.castlist-actor").click(function(event) {
                event.preventDefault();
                $("div.castlist-info").remove();

                generateActorDiv($(this));
            });
        }
    });
}

function generateActorDiv(toappend) {
    var name = toappend.html();

    var div = $("<div class='castlist-info'></div>");
    div.append("<a href='' class='castlist-info-close'>Close</a>")
    div.append("<h1 class='castlist-info-name'>" + name + "</h1>");
    div.append("<img class='castlist-info-img' src='' />");
    div.append("<div class='castlist-info-desc'></div>");
    div.append("<p class='castlist-info-link'><a href=''>More on " + name + " from <em>The Times</em></a></p>");

    toappend.after(div.css({
        "left": event.pageX,
        "top": event.pageY
    }));

    $("a.castlist-info-close").click(function(event) {
        event.preventDefault();
        $("div.castlist-info").remove();
    });

    queryMySQL(name);
    queryWikipediaImg(name);
}

function queryMySQL(name) {
    var url = 'http://46.101.38.33/?service=single&name=' + name;

    $.ajax({
        url: url,
        crossDomain: false,
        success: function(data) {
            if (data == "") {
                var search_link = "http://www.thetimes.co.uk/tto/public/sitesearch.do?querystring=";
                search_link += name + "&x=0&y=0&p=tto&pf=all&bl=on#/tto/public/sitesearch.do?querystring=";
                search_link += name + "&offset=0&hits=0&sortby=date&order=DESC&bl=on&service=searchframe";
                
                $("p.castlist-info-link a").attr("href", search_link);
                queryWikipediaDesc(name);
            } else {
                data = data[0];
                $("p.castlist-info-link a").attr("href", data.search_link);

                if (data.description) $("div.castlist-info-desc").html(data.description);
                else queryWikipediaDesc(name);
            }
        }
    });
}

function queryWikipediaDesc(name) {
    $.getJSON("http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&redirects=true&titles=" + name,
        function(data) {
            
            var desc = "";
            var first = true;
            $.each(data['query']['pages'], function(i, val) {
                if (first) {
                    desc = val['extract'];
                    first = false;
                }
            });

            var end = desc.indexOf("</p>");
            desc = desc.substr(0, end+4)
            $("div.castlist-info-desc").html(desc);
        });
}

function queryWikipediaImg(name) {
    $.getJSON("http://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageimages&redirects=true&titles=" + name,
        function(data) {
            var img_page_url = "";
            var first = true;
            $.each(data['query']['pages'], function(i, val) {
                if (first) {
                    img_page_url = val['pageimage'];
                    first = false;
                }
            });

            img_page_url = "File:" + img_page_url;

            $.getJSON("http://en.wikipedia.org/w/api.php?format=json&action=query&prop=imageinfo&iiprop=url&titles=" + img_page_url,
                function(data) {
                    var img_url = "";
                    var first = true;
                    $.each(data['query']['pages'], function(i, val) {
                        if (first) {
                            if (val['imageinfo']) img_url = val['imageinfo'][0]['url'];
                            first = false;
                            console.log(val);
                        }
                    });

                    if (img_url) $("img.castlist-info-img").attr("src", img_url);

                });
        });
}


console.log("Tagging...");
var text = $('div.article-page').html();
tagNames(text);
console.log("Tagged");