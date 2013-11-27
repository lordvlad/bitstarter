define(["jquery", "hogan", "typeahead", "capture"], function($,Hogan, x, Capture){
    $.fn.enable = function(){return $(this).attr("disabled",false);}
    $.fn.disable = function(){ return $(this).attr("disabled", true);}

    // Convert dataURL to Blob object
    function dataURLtoBlob(dataURL) {
        // Decode the dataURL
        var binary = atob(dataURL.split(',')[1]);
        // Create 8-bit unsigned array
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        // Return our Blob object
        return new Blob([new Uint8Array(array)], {type: 'image/png'});
    }


    $("#newSignWord").typeahead([
        {
            name: "novel-words"
            , remote: "/api/words/%QUERY"
        }
    ]);

    $("#newSignRegion").typeahead([
        {
            name: "novel-words"
            , remote: "/api/regions/%QUERY"
        }
    ])

    capture = new Capture("#capture",{
        image : null
        , extension : "png"
    })


    $capture   = $("#capture")
    $snapshots = $capture.find(".snapshots")
    $video     = $capture.find("video")
    $preview   = $capture.find(".snapshot-preview")
    $img       = $capture.find("img").detach()

    $capture
        .on("capture.stream.started", function(){
            $capture.addClass("live")
            $capture.find(".capture-start").disable().next().enable().next().enable().next().disable()
            $capture.find(".snapshot-fill").hide()
            $video.show()
        })
        .on("capture.stream.stopped", function(){
            $capture.removeClass("live")
            $capture.find(".capture-start").enable().next().disable().next().disable().next().enable()
        })
        .on("capture.snapshot.taken", function(e, dataURL){
            $capture.find(".snapshot-flash").addClass("flash-now")
            $img.clone().attr("src", dataURL).hide().appendTo($snapshots).show('slow')
        })

    $capture.find(".capture-start")
        .on("click", function(e){
            e.preventDefault()
            $snapshots.show()
            $capture.find(".snapshot-fill").show()
            $preview.hide("slow", function(){ $(this).empty() })
            $capture.trigger("capture.stream.start")
        })
        .next()
        .disable()
        .on("click", function(e){
            e.preventDefault()
            $capture.trigger("capture.snapshot.take")
        })
        .next()
        .disable()
        .on("click", function(e){
            e.preventDefault()
            $capture.trigger("capture.stream.stop")
        })
        .next()
        .disable()
        .on("click", function(e){
            $(this).disable()
            e.preventDefault();
            $preview.find("img").hide("slow", function(){$(this).remove()})

            var word = $("[name=word]").val()
            , region = $("[name=region]").val()

            $('body').css('cursor','wait');

            // Create new form data
            var fd = new FormData();

            // Append our Canvas image files to the form data
            $(".snapshots img").get().forEach(function(img, i){
                fd.append("image"+i, dataURLtoBlob(img.src))
            })

            $("body").css("cursor","wait");
            // And send it
            $.ajax({
                url: "/gebaerden/erstellen",
                type: "POST",
                data: fd,
                processData: false,
                contentType: false,
            }).done(function(dataurl){
                $("body").css("cursor","default");
                $snapshots.hide("slow", function(){ $snapshots.empty() })
                $video.hide("slow")
                $img.clone().attr("src", dataurl).appendTo($preview.show("slow"))
            }).fail(function(){
                alert(arguments);
            })

        })

    $capture.find(".snapshot-snap")
        .on("click", function(e){
            e.preventDefault()
            $capture.trigger("capture.snapshot.take")
        })

})