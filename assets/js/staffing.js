$(function() {
    var division = [
        'Bendahara',
        'Sekretaris',
        'Rumah Tangga',
        'Marketing',
        'Manajemen Proyek',
        'Teknikal',
        'Intrakampus',
        'Ekstrakampus',
        'Pengmas',
        'Kekeluargaan',
        'PMB',
        'Kaderisasi',
        'MSDA',
        'Akademik',
        'Publikasi',
        'Kreatif',
        'Tim Senator',
        'DPP'
    ];
    var divisionItemTemplate =
        '<div class="col-md-4 col-sm-4 col-xs-6 division-item">'
            + '<div class="panel panel-default">'
                + '<div class="panel-heading"><span></span></div>'
            + '</div>'
        + '</div>';
    var divisionItemPlaceholder =
        '<div class="col-md-4 col-sm-4 col-xs-6 division-item division-item-placeholder">'
            + '<div class="panel panel-default">'
                + '<div class="panel-heading"><span></span></div>'
            + '</div>'
        + '</div>';
    var isShuffled = false;

    function initializePool() {
        var pool = $('.division-pool');
        pool.html('');
        for (i = 0; i < division.length; ++i) {
            var newDivisionItem = $($.parseHTML(divisionItemTemplate));
            newDivisionItem.data('division', division[i]);
            pool.append(newDivisionItem);
        }
        // append clear to make the well works
        pool.append('<div class="clear"></div>');
    }

    initializePool();
    
    function shuffle(){
        for(i = 1;i <= 100; ++i){
            var x = Math.floor(Math.random() * i) % division.length;
            var y = Math.floor(Math.random() * (i + 1)) % division.length;
            var temp = division[x];
            division[x] = division[y];
            division[y] = temp;
        }
        initializePool();
        reorderDivisionItem();
        isShuffled = true;
    }

    // initially, shuffle the options
    shuffle();
    $('#shuffle').click(shuffle);

    function reorderDivisionItem(ui) {
        // reorder the numbering
        $('.division-item:not(.ui-sortable-helper)').each(function(i, e) {
            // convert into jQuery object
            e = $(e);
            if (e.hasClass('division-item-placeholder')) {
                e = ui.helper;
            }
            var name = e.data('division');
            e.find('span').html('' + (i + 1) + '. ' + name);

            // bold the top three, replace them in text
            e.removeClass('division-item-top');
            if (i < 3) {
                e.addClass('division-item-top');
                $('.division-' + (i + 1)).html(name);
            }
        });
    }
    reorderDivisionItem();
    
    $('.division-pool').sortable({
        cursor: 'move',
        items: '.division-item',
        opacity: 0.8,
        update: function (event, ui) {
            reorderDivisionItem();
            isShuffled = false;
        },
        sort: function (event, ui) {
            reorderDivisionItem(ui);
        },
        placeholder: {
            element: function(clone, ui) {
                return $(divisionItemPlaceholder);
            },
            update: function() {}
        },
        revert: 300
    });

    $('input[required], textarea[required]').on('focusout change', function() {
        if (!$(this).val()) {
            $(this).addClass('error');
            $(this).closest('.form-group').find('.error-validation').show();
        } else {
            $(this).removeClass('error');
            $(this).closest('.form-group').find('.error-validation').hide();
        }
    });
    function validateInput() {
        var firstError = null;
        $('input[required], textarea[required]').each(function(i, e) {
        if ($(e).attr('type') == 'checkbox') {
            console.log($(e).is(':checked'));
        }
            if (!$(e).val() || ($(e).attr('type') == 'checkbox' && !($(e).is(':checked')))) {
                $(e).addClass('error');
                $(e).closest('.form-group').find('.error-validation').show();
                if (!firstError) {
                    firstError = $(e);
                }
            }
        });
        if (firstError) {
            firstError.focus();
            return false;
        } else {
            return true;
        }
    }

    function fillModal() {
        // nim-nama-telepon
        $('#nim-nama-review').html($('#nim').val() + " / " + $('#nama').val() + " / " + $('#telepon').val() + " / " +$('#idline').val());
        // division order
        var order = $('#division-review');
        order.html('<ol></ol>');
        $('.division-item').each(function(i, e) {
            order.find('ol').append('<li>' + $(e).data('division') + '</li>');
        });
        // reasons
        for (i = 1; i <= 3; ++i) {
            $('#reason' + i + '-review').html($('#reason' + i).val());
        }
    }

    $('.submit-button').click(function() {
        // TODO: validate form input
        if (!validateInput()) {
            return false;
        }
        fillModal();
        $('#review-modal').modal('show');
    });

    //////////////////////
    // google form related
    //////////////////////

    // google form key
    var formKey = "1qTyTNmkYH7jl89QPBntbifgmG8-E7AWZjzsMzm7RGjM";

    // google form entry key
    var formEntries = {
        nim:    "entry.2025209625",
        nama:   "entry.1022360252",
        telepon:"entry.1387741161",
        idline: "entry.1909003065",
        division: [
            "entry.806464474",
            "entry.1248643119",
            "entry.560973193",
            "entry.914959542",
            "entry.1844253789",
            "entry.1320463128",
            "entry.1926496184",
            "entry.1461528561",
            "entry.659224251",
            "entry.726232680",
            "entry.1700182841",
            "entry.945529493",
            "entry.1594940084",
            "entry.46464716",
            "entry.780219317",
            "entry.278532221",
            "entry.979206341",
            "entry.647941047"

        ],
        reason: [
            "entry.278632534",
            "entry.661248390",
            "entry.697588095"
        ],
        shuffled:"entry.489806969"
    };


    $('#real-submit-button').click(function() {
        // generate form link
        var url = "//docs.google.com/forms/d/" + formKey + "/formResponse";

        // prepopulate form
        var form = $('#main-form');
        form.attr('action', url);
        form.html('');

        // nim and nama and telepon
        form.append('<input type="text" name="' + formEntries.nim + '" value="' + $('#nim').val() + '">');
        form.append('<input type="text" name="' + formEntries.nama + '" value="' + $('#nama').val() + '">');
        form.append('<input type="text" name="' + formEntries.telepon + '" value="' + $('#telepon').val() + '">');
        form.append('<input type="text" name="' + formEntries.idline + '" value="' + $('#idline').val() + '">');
        
        // division orders
        $('.division-item').each(function(i, e) {
            form.append('<input type="text" name="' + formEntries.division[i] + '" value="' + $(e).data('division') + '">');
        });

        // reasons
        for (i = 1; i <= 3; ++i) {
            form.append('<input type="text" name="' + formEntries.reason[i-1] + '" value="' + $('#reason' + i).val() + '">');
        }

        // shuffled/not?
        form.append('<input type="text" name="' + formEntries.shuffled + '" value="' + (isShuffled ? "ya" : "tidak") + '">');

        form.submit();
    });
});
