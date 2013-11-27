define(["jquery", "fileinput", "switch"], function($,z,y){
    $(".fileinput").on("click", "[data-trigger=imagecrop]", function(e){
        e.preventDefault()
        $input = $(e.delegateTarget)
        $img = $input.find("img[data-src]")
    })
})
