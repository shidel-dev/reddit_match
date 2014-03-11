spyOn( $, 'ajax' ).andCallFake( function (params) { 
  params.success({foo: 'bar'});   
});


