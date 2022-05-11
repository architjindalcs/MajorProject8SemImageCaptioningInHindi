
document.querySelector('#play-button').addEventListener("click",()=>{
    console.log("Here...to listen");
    let synth = window.speechSynthesis;
    let utter = new SpeechSynthesisUtterance();
    let help=(text,lang) =>{
        let utter = new SpeechSynthesisUtterance();
        utter.lang = lang;
        utter.text = text;
        utter.volume = 0.5;
        
        // event after text has been spoken
        
        // speak
        window.speechSynthesis.speak(utter);    
    }

    help(document.querySelector('#result').textContent,"hi")
})

$(document).ready(function () {
    // Init
    $('.image-section').hide();
    $('.loader').hide();
    $('#result').hide();

    // Upload Preview
    function readURL(input) {
        console.log("Ip"+input)
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview').css('background-image', 'url(' + e.target.result + ')');

                $('#imagePreview').hide();
                $('#imagePreview').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }


    function readURL1(input) {
        console.log("Ip1"+input)
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#imagePreview1').css('background-image', 'url(' + e.target.result + ')');

                $('#imagePreview1').hide();
                $('#imagePreview1').fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload1").change(function () {
        $('.image-section1').show();
        $('#btn-predict1').show();
        $('#result1').text('');
        $('#result1').hide();
        readURL1(this);
    });

    $("#imageUpload").change(function () {
        $('.image-section').show();
        $('#btn-predict').show();
        $('#result').text('');
        $('#result').hide();



        readURL(this);
    });

    // Predict
    $('#btn-predict').click(function () {
        var form_data = new FormData($('#upload-file')[0]);

        // Show loading animation
        $(this).hide();
        $('.loader').show();
        
        // Make prediction by calling api /predict
        console.log("Here..");
        console.log("Form Data: ", form_data)
        $.ajax({
            type: 'POST',
            url: '/predict',
            data: form_data,
            contentType: false,
            cache: false,
            processData: false,
            async: true,
            success: function (data) {
                // Get and display the result
                $('.loader').hide();
                $('#result').fadeIn(600);
                $('#result').text('' + data);
                
                console.log('Success!');
                $('#play-button').show()
            },
        });
    });

});
