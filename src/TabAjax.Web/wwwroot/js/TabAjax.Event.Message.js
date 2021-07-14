// --- Génère un message HTML sur la page  ---
async function TabAjaxMessage(message) {
    $('#MessageResult').append(message);
    await TabajaxDisplayMessage();
}
// --- Génère un message HTML sur la page  ---
async function TabAjaxErrorMessage(message) {
    var currentdate = new Date();
    var messageError = "<div class='toast' role='alert' data-autohide='false'>";
    messageError += "<div class='toast-header bg-danger'>";
    messageError += "<i class='fa fa-exclamation-triangle mr-2'></i>";
    messageError += "<strong class='mr-auto'>Erreur</strong>";
    messageError += "<small class='text-muted color-blanc'>" + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() + "</small>";
    messageError += "<button type='button' class='ml-2 mb-1 close' data-dismiss='toast' aria-label='Close'>";
    //messageError += "<span style='font-size: 1em;' aria-hidden='true'>&times;</span>";
    messageError += "<span class='fa-stack' aria-hidden='true'><i class='fa fa-circle fa-stack-2x'></i><span id='timer' class='fa fa-stack-1x fa-inverse'>5</span></span>";
    messageError += "</button>";
    messageError += "</div>";
    messageError += "<div class='toast-body'>";
    messageError += message;
    messageError += "</div>";
    messageError += "</div>";
    $('#MessageResult').append(messageError);
    await TabajaxDisplayMessage();
}
// --- Génère un message HTML sur la page  ---
async function TabAjaxSuccessMessage(message) {
    var currentdate = new Date();
    var messageSuccess = "<div class='toast' role='alert' data-autohide='false'>";
    messageSuccess += "<div class='toast-header bg-success'>";
    messageSuccess += "<i class='fa fa-check mr-2'></i>";
    messageSuccess += "<strong class='mr-auto'>Succes</strong>";
    messageSuccess += "<small class='text-muted color-blanc'>" + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds() + "</small>";
    messageSuccess += "<button type='button' class='ml-2 mb-1 close' data-dismiss='toast' aria-label='Close'>";
    //messageSuccess += "<span style='font-size: 1em;' aria-hidden='true'>&times;</span>";
    messageSuccess += "<span class='fa-stack' aria-hidden='true'><i class='fa fa-circle fa-stack-2x'></i><span id='timer' class='fa fa-stack-1x fa-inverse'>5</span></span>";
    messageSuccess += "</button>";
    messageSuccess += "</div>";
    messageSuccess += "<div class='toast-body'>";
    messageSuccess += message;
    messageSuccess += "</div>";
    messageSuccess += "</div>";
    $('#MessageResult').append(messageSuccess);
    await TabajaxDisplayMessage();
}
function TabajaxDisplayMessage() {
    $('#MessageResult').find('div.toast').each(function (i) {
        var elem = $(this);
        $(elem).toast('show');

        $(this).on('shown.bs.toast', function () {
            if ($(this).attr('hide') !== 'false') {
                var i = 4;
                var interval = setInterval(function (e) {
                    $(e).find('#timer').html(i);
                    i--;
                }, 1000, this);
                var timer = $(this).find('#timer');
                setTimeout(function () {
                    clearInterval(interval);
                    $(timer).html('');
                    $(timer).addClass('fa-close');
                    $(elem).toast('hide');
                }, 5000);
            }
        });

        $(this).on('hide.bs.toast', function () {
            if ($(elem).is(':hover') && $(elem).attr('hide') !== 'false') {
                $(elem).attr('hide', 'false');
                $(elem).attr('style', 'opacity:1;display:block;');
                $(elem).toast('show');
            }
            else {
                $(elem).remove();
            }
        });
    });
}