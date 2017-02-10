'use strict';

$(document).ready(function(){
    
    function updateBars(data){
        console.log(data);
        barList.bars = data.businesses;
    }
    
    function submitSearch(){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: window.location.origin + '/api/search',
            data: {
                location: $('#search-text').val()
            }
        })
            .done(updateBars)
            .fail(console.error);
    }
    
    var barList = new Vue({
        el: '#bar-list',
        data: {
            bars: []
        }
    });
    
    $('#search-btn').on('click', submitSearch);
    
    $('#search-text').on('keypress', function(e){
        if (e.keyCode === 13){
            $('#search-btn').click();
        }
    });
    
    $('.join-bar-btn').on('click', function(){
        
    });
    
});