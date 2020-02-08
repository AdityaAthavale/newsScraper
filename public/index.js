$(document).ready(function () {
    $("#saerchButton").click(function(event) {
        $("#search-list").html("")
        event.preventDefault()
       let searchQuery = $("#searchField").val()
       $.ajax({
            type: "get",
            url: "/scrape/" + searchQuery,
            success: function(data) {
                console.log("Creating card....")
                data.forEach(element => {
                    let card = makeCard(element)
                    let item = $('<li>')
                    item.append(card)
                    $("#search-list").append(item)
                });
            }
        })
    })
});

function makeCard(element) {
    let cardDiv = $('<div>')
    cardDiv.addClass('card')

    let cardBody = $('<div>')
    cardBody.addClass('card-body')

    let title = $('<p>')
    title.addClass('card-title')
    title.text(element.title)
    cardBody.append(title)

    let a = $('<a>');

    a.attr('href', "https://www.nytimes.com/" + element.link);
    a.attr('target', '_blank')
    a.text('more...');
    a.addClass('btn');
    a.addClass('btn-primary');
    cardBody.append(a)

    let desc = $('<p>')
    // desc.addClass('card-title')
    desc.text(element.details)
    cardBody.append(desc)
    
    cardDiv.append(cardBody)
    return cardDiv
}