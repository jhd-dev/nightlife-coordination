'use strict';

$(document).ready(function(){
    
    function updateBars(data){
        //console.log(data);
        barList.bars = data.bars;
    }
    
    function submitSearch(){
        var searchTerm = $('#search-text').val();
        sessionStorage.setItem('nightlife-search', searchTerm);
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: window.location.origin + '/api/search',
            data: {
                location: searchTerm
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
                            var copy = self.bars.slice();
                            copy.splice(bar.index, 1, updated_bar);
                            self.bars = copy;
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
            submitSearch();
        }
    });
    
    var query = {};
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value){
        query[key] = decodeURIComponent(value);
    });
    
    if (query.success){
        var search = sessionStorage.getItem('nightlife-search');
        if (search){
            $('#search-text').val(search);
            submitSearch();
        }
    }
    
});