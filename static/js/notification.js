$(() => {
    $('.close-notification').on('click', function (e) {
        $(`#${$(e.target).data("type")}${$(e.target).data("index")}`).remove();
    })

    $('.close-announcement').on('click', function (e) {
        const hash = $(e.target).data('hash');
        $("#announcement").remove();
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 14);
        document.cookie = `hiddenAnnouncement=${hash}; expires=${expirationDate}; path=/`;
    })
})