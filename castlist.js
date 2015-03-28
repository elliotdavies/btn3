function generateActorDiv(toappend) {
    var name = toappend.html();
    var div = $("<div class='castlist-info'></div>");

    var css = {
        "position": "absolute",
        "left": event.pageX,
        "top": event.pageY,
        "z-index": 100,
        "background-color": "white",
        "border": "1px solid black"
    };

    toappend.after(div.css(css));

    queryMySQL(div, name);
    queryWikipediaImg(div, name);
}

function queryMySQL(div, name) {
    var url = 'http://46.101.38.33/?service=single&name=' + name;

    $.ajax({
        url: url,
        crossDomain: false,
        success: function(data) {
            html = "";

            if (data == "") html += "No information found for " + name;
            else {
                data = data[0];
                html += "<p><h2>" + name + "</h2></p>";
                html += "<p><strong>Age:</strong> " + data.age + "</p>";
                html += "<p><a href='" + data.search_link + "'>Stories</a>";

                if (data.description) {
                    html += "<p><strong>Bio:</strong> " + data.description + "</p>";
                } else {
                    queryWikipediaDesc(div, name);
                }

                div.append(html);
            }
        }
    });
}

function queryWikipediaDesc(div, name) {
    $.getJSON("http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&redirects=true&titles=" + name + "&callback=?",
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
            html = "<p><strong>Bio:</strong> " + desc + "</p>";
            div.append(html);
        });
}

function queryWikipediaImg(div, name) {
    $.getJSON("http://en.wikipedia.org/w/api.php?format=json&action=query&prop=pageimages&redirects=true&titles=" + name + "&callback=?",
        function(data) {
            
            var url = "";
            var first = true;
            $.each(data['query']['pages'], function(i, val) {
                if (first) {
                    url = val['thumbnail']['source'];
                    first = false;
                }
            });

            html = "<img src='" + url + "' />";
            div.append(html);
        });
}

$("a.castlist-actor").click(function(event) {
    event.preventDefault();
    $("div.castlist-info").remove();

    generateActorDiv($(this));
});