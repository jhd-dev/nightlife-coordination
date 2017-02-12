'use strict';

$(document).ready(function(){
    
    function updateBars(data){
        console.log(data);
        barList.bars = data.bars;
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
        },
        methods: {
            toggleUser: function(bar){
                var self = this;
                var updated_bar = JSON.parse(JSON.stringify(bar));
                $.ajax({
                    type: 'GET',
                    dataType: 'json',
                    url: window.location.origin + '/toggle-going',
                    data: {
                        bar: JSON.stringify({
                            id: bar.id,
                            number_attending: bar.number_attending
                        })
                    },
                    success: function(data){
                        if (data.redirect){
                            window.location = data.redirect;
                        }else{
                            var keys = Object.keys(data.updated_bar);
                            for (var key in keys){
                                updated_bar[keys[key]] = data.updated_bar[keys[key]];
                            }
                            self.bars[bar.index] = updated_bar;
                            console.log(updated_bar.user_attending, updated_bar.number_attending, updated_bar);
                        }
                    }
                });
            },
            getAddress: function(bar){
                return bar.location.display_address.join(' ');
            },
            formatReview: function(bar){
                return '"' + bar.snippet_text + '"';
            }
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