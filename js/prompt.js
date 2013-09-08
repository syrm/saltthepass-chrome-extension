var settings

$(function() {
  $('#master').focus()

  $(document).keyup(function(e) {
    if(e.which == 13) {
      submit()
    }
    if(e.which == 27) {
      parent.postMessage({action: "hide"}, "*")
    }
  })

  $('#saltbutton').on('click', function() {
    submit()
  })

  window.addEventListener("message", function(e) {
    settings = e.data.settings

    $('#domain').val(e.data.domain)
    $('body').css('border-color', settings.color)
    $('#antiphishing').css('background-color', settings.color)
    $('#antiphishing').text(settings.antiphishing)
    $('#antiphishing').css('color', settings.antiphishingColor)
    $('#length').val(settings.hashLength)
    $('#lengthText').text(settings.hashLength)
    $('#length').data('slider-max', SaltThePass.getHashLength(settings.hash))
    $('#length').data('slider-value', parseInt($('#length').val()))
    $('#length').slider().on('slide', function(e) {
      $('#lengthText').text(e.value)
    })
  })

  $(window).on('blur', function(e) {
    // Maybe a hack tentative (input over the master input)
    parent.postMessage({action: "hide"}, "*")
  })

})

function submit() {
  settings.hashLength = $('#length').val()
  parent.postMessage({action: "sync.hashLength", value: settings.hashLength}, "*")

  var salted = SaltThePass.saltthepass(settings.hash, $('#master').val(), $('#domain').val(), $('#domainphrase').val()).substring(0, settings.hashLength);
  parent.postMessage({action: "password", value: salted}, "*")
}
