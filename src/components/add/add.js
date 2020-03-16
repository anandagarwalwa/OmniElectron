$(document).ready(function() {
    $("#btnPublish").click(function(){
        if($("input[type='radio'].radioBtnClass").is(':checked')) {
            debugger
            var radioBtnClass_type = $("input[type='radio'].radioBtnClass:checked").val();
            if(radioBtnClass_type == "dataLink")
            {
                $('#addDataPointForm').addClass('d-none');
                $('#dataLinkBlock').removeClass('d-none');
            }
            else if(radioBtnClass_type == "analysis")
            {
                $('#addDataPointForm').addClass('d-none');
                $('#analysisBlock').removeClass('d-none');
            }
            else
            {
                $('#addDataPointForm').addClass('d-none');
                $('#testBlock').removeClass('d-none');
            }
        }
    }); 
});