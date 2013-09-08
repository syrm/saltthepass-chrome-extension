var sync = []
var settings = {}

$(function() {
  chrome.storage.sync.get("settings", function(data) {
    $('#color').val(data.settings.color)
    $('#antiphishingColor').val(data.settings.antiphishingColor)
    $('#antiphishing').val(data.settings.antiphishing)
    $('#hash').val(data.settings.hash)

    $('#color').minicolors()
    $('#antiphishingColor').minicolors()
  })

  $("#apply").on("click", function() {
    settings.color = $('#color').val()
    settings.antiphishing = $('#antiphishing').val()
    settings.antiphishingColor = $('#antiphishingColor').val()
    settings.hash = $('#hash').val()
    chrome.storage.sync.set({settings: settings})
    window.close()
  })
})
