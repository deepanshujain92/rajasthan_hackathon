var me = {};
me.avatar = "images/user.png";

var you = {};
you.avatar = "images/ssologo.png";

var botConfigEnglish =
        {
            language : "en",
            language_code : "en-US",
            accessToken : "001a9dec3b1b403b8d2bb09a21ab4fc0",
            title : "Samvaad"
        };
var botConfigHindi =
        {
            language : "hi",
            language_code : "en-US",
            accessToken : "a6147c5328c04d29b7455ee6428b765b",
            title : "संवाद"

        };        
var botConfig =  botConfigHindi;       

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}            
  function startDictation() {

    if (window.hasOwnProperty('webkitSpeechRecognition')) {

      var recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "hi-IN";
      recognition.start();

      recognition.onresult = function(e) {
        document.getElementById('input').value
                                 = e.results[0][0].transcript;
        recognition.stop();
        //document.getElementById('labnol').submit();
        insertChat("me",document.getElementById('input').value);
        document.getElementById('input').value = '';
        

      };

      recognition.onerror = function(e) {
        recognition.stop();
      };

    }
  }
  
function setLanguage(language)
{
    resetChat(); 
    if(language==="english")
    {
        botConfig = botConfigEnglish;
        insertChat('you','Hey ya!');
        $('.chat_body').slideToggle('slow');

    }
    else
    {
       botConfig = botConfigHindi;
       insertChat('you','नमस्कार!');
       $('.chat_body').slideToggle('slow');
    }
    document.getElementById("title").text = botConfig.title;
    
}

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0){
    var control = "";
    var date = formatAMPM(new Date());
    
    if (who == "me"){
        
        control = 
                        '<div class="msj macro">' +
                        '<div class="avatar"><img class="img-circle" style="width:100%;" src="'+ me.avatar +'" /></div>' +
                            '<div class="text text-l">' +
                                '<p>'+ text +'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '</div>'; 
                                                send(text);                     

    }else{
        control = 
                        '<div class="msj-rta macro">' +
                            '<div class="text text-r">' +
                                '<p>'+text+'</p>' +
                                '<p><small>'+date+'</small></p>' +
                            '</div>' +
                        '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="'+you.avatar+'" /></div>'                                
    }
    setTimeout(
        function(){   
                if(who!=="me")
                  speak(text);
               $(".chat-text").append(control);
                   $('.chat-text').scrollTop($('.chat-text')[0].scrollHeight);


        }, time);
        
    
}

function resetChat(){
    $(".chat-text").empty();
}

$(document).ready(function(){
$(document).on("click", "#userResponse", function(){
                        insertChat("me", ($(this).val()));     
});
$(document).on("click", "#language", function(){
                        setLanguage($(this).val());     
});
   
    $('.chat_head').click(function(){
        $('.chat_body').slideToggle('slow');
    });
    $('.msg_head').click(function(){
        $('.msg_wrap').slideToggle('slow');
    });
    
    $('.close').click(function(){
        $('.msg_box').hide();
    });
});
//-- Clear Chat
resetChat();

function speak(text, callback) {
    var u = new SpeechSynthesisUtterance();
    u.text = text;
    u.lang = botConfig.language_code;
 
    u.onend = function () {
        if (callback) {
            callback();
        }
    };
 
    u.onerror = function (e) {
        if (callback) {
            callback(e);
        }
    };
 
    speechSynthesis.speak(u);
}

/*api.ai code*/
var lan = botConfig.language_code;
var baseUrl = "https://api.api.ai/v1/";
$(document).ready(function() {
$("#input").keypress(function(event) {
if (event.which === 13) {
event.preventDefault();
if($("#input").val()!=='')
{
insertChat("me",$("#input").val() );
}  
$(this).val('');
            
}
})});
function send(text) {
//var text = $("#input").val();
$.ajax({
type: "POST",
url: baseUrl + "query?v=20150910",
contentType: "application/json; charset=utf-8",
dataType: "json",
headers: {
"Authorization": "Bearer " + botConfig.accessToken
},
data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
success: function(data) {
setResponse(data.result.fulfillment.speech);
},
error: function() {
setResponse("Internal Server Error");
}
});
//setResponse("Loading...");
}
function setResponse(val) {
insertChat("you", val, 0);
$("#response").text(val);
$("#query").text($("#input").val());
}
//-- Print Messages
insertChat("you", 'नमस्कार! सम्वाद में आपका स्वागत है! \n');
//insertChat("me", '<button type="button" class="btn btn-primary btn-round-lg btn-lg">Option 2</button>', 0);  
//insertChat("you", "Hi, Pablo", 1500);
//insertChat("me", "What would you like to talk about today?", 3500);
//insertChat("you", "Tell me a joke",7000);
//insertChat("me", "Spaceman: Computer! Computer! Do we bring battery?!", 9500);
//insertChat("you", "LOL", 12000);


//-- NOTE: No use time on insertChat.