var inputPassword
//chrome.storage.sync.clear()

var settings = {
  color: '#FF4444',
  antiphishing: 'Set your anti-phishing in options!',
  antiphishingColor: '#FFFFFF',
  hash: 'sha3',
  hashLength: 20
}

chrome.storage.sync.get("settings", function(data) {
  chrome.storage.sync.set({settings: $.extend(settings, data.settings)})
})

$(function() {
  $('input[type="password"]').on('focus', function(e) {
    inputPassword = this
    requestPrompt()
  })

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if ($('#saltthepass').length == 1) {
      var iframe = $('#saltthepass').get(0)
      if ($(iframe).attr('src') == chrome.runtime.getURL("html/prompt.html")) {
        iframe.contentWindow.postMessage({settings: changes.settings.newValue}, "*")
      }
    }
  })

  $(document).keyup(function(e) {
    if(e.which == 27 && $('#saltthepass').length == 1) {
      hidePrompt()
    }
  })

  window.addEventListener("message", function(e) {
    if (e.data.action == 'sync.hashLength') {
      chrome.storage.sync.get("settings", function(data) {
        chrome.storage.sync.set({settings: $.extend(settings, {hashLength: e.data.value})})
      })
    }

    if (e.data.action == 'hide') {
      hidePrompt()
    }

    if (e.data.action == 'password') {
      $(inputPassword).val(e.data.value)
      $('#saltthepass').remove()
    }
  })

})

function hidePrompt()
{

  $('#saltthepass').remove()
  $(inputPassword).data('dontshow', true)
  $(inputPassword).focus()

}

function requestPrompt()
{

  if ($('#saltthepass').length == 0 && $(inputPassword).data('dontshow') == undefined && $(inputPassword).val().length == 0) {
    chrome.storage.sync.get("settings", function(data) {
      $('body').after('<iframe id="saltthepass" src="' + chrome.runtime.getURL("html/prompt.html") + '"></iframe>')
      $('#saltthepass').load(function() {
        if ($('#saltthepass').length == 1) {
          var iframe = $('#saltthepass').get(0)
          if ($(iframe).attr('src') == chrome.runtime.getURL("html/prompt.html")) {
            iframe.contentWindow.postMessage({settings: data.settings, domain: SaltThePass.standardizeDomain(location.href)}, "*")
          }
        }
      })
    })
  }

  if ($(inputPassword).data('dontshow') == true) {
    $(inputPassword).removeData('dontshow')
  }

}