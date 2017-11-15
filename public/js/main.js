$(document).ready(fucntion(){
	$('.delete-article').on('click', fucntion(e){
		$target = $(e.target);
		const id = $target.attr('data-id');
		$.ajax({
			type: 'DELETE',
			url: '/article/'+id,
			success: function(response){
				alert('Deleting Article');
				window.location.href='/';
			},
			error: function(err){
				console.log(err);
			}
		});
	});
});