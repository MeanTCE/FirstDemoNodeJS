$(function(){

    $('body').on('click','#btn_delete_category',function(e){
      e.preventDefault()
      Swal.fire({
        title: 'Confirm Delete?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {

          //submit form
          $(this).closest('form#delete_category_form').submit()
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    })

    $('body').on('click','#btn_delete_product',function(e){
      e.preventDefault()
      Swal.fire({
        title: 'Confirm Delete?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {

          //submit form
          $(this).closest('form#delete_product_form').submit()
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }
      })
    })
    
})