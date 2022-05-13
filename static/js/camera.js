document.querySelector('#play-button').addEventListener("click",()=>{
    console.log("Here...to listen");
    let synth = window.speechSynthesis;
    let utter = new SpeechSynthesisUtterance();
    let help=(text,lang) =>{
        let utter = new SpeechSynthesisUtterance();
        utter.lang = lang;
        utter.text = text;
        utter.volume = 0.5;
        window.speechSynthesis.speak(utter);    
    }

    help(document.querySelector('#result').textContent,"hi")
})

function ShowCam() {
    Webcam.set({
        width: 320,
        height: 240,
        image_format: 'jpeg',
        jpeg_quality: 100
    });

    Webcam.attach('#my_camera');
}
window.onload= ShowCam;

function snap() {
    Webcam.snap( function(data_uri) {
        // display results in page
        document.getElementById('my_camera').innerHTML = 
        '<img id="image" src="'+data_uri+'"/>';
      } );      
}


function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }

function upload() {
    console.log("Uploading...")
    var imgBase64 = document.getElementById('image').src;
    console.log(imgBase64);
    const file = DataURIToBlob(imgBase64)
    const formData = new FormData();
    formData.append('file', file, 'image.jpg') 
 
    $('.loader').show();
    $.ajax({
        type: 'POST',
        url: '/predict',
        data: formData,
        contentType: false,
        cache: false,
        processData: false,
        async: true,
        success: function (data) {
            console.log(''+data);
            $('.loader').hide();
            $('#result').fadeIn(600);
            $('#result').text('' + data);
            
            console.log('Success!');
            $('#play-button').show()
            console.log('Success!');
        },
    });
}