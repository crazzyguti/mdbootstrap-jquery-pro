function get_social_counts() {
	var thisUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
	$.ajax({
		type: "GET",
		url: 'https://mdbootstrap.com/wp-content/themes/mdbootstrap4/inc/get_social_counts.php?thisurl='+thisUrl,
		dataType: "json",
		success: function (data){

    	var div = document.getElementById("dom-target-fb");
    	var fbBase = div.textContent;
    	var div = document.getElementById("dom-target-tw");
    	var twBase = div.textContent;
    	var div = document.getElementById("dom-target-gp");
    	var gpBase = div.textContent;

		var fbShare = (1 * fbBase.valueOf() + data.facebook);
		var twShare = (1 * twBase.valueOf() + data.twitter);
		var gpShare = (1 * gpBase.valueOf() + data.gplus);


	if(fbShare>0){
		$('#facebook-span').text(fbShare);
	}
	else {
		$('#facebook-span').hide();
		}	
			$('#twitter-span').html(twShare);
			$('#gplus-span').html(gpShare);


		

			
		}
	});
}

function loadTemplatesBy (category, order)
{



	$.post(ajax_object.ajaxurl, {
			action: 'ajax_action',
			category: category
		}, function(data) {
			console.log(category);
			//alert(data); // alerts 'ajax submitted'
			$("#products").html(data);
		});

}
