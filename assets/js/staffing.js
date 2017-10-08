$(function() {
    var division = [
        'Bendahara',
        'Sekretaris',
        'Badan Rumah Tangga',
        'Marketing',
        'Manajemen Proyek',
        'Pengembangan Karya',
        'Publikasi Eksternal',
        'Publikasi Internal',
        'Intrakampus',
        'Ekstrakampus',
        'Pengmas',
        'MSDA',
        'Aksara',
        'Kaderisasi',
        'Kekeluargaan',
        'Tim Senator'
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
    var formKey = "1rP_a4zS4FoO5wl6jsuPkoc6F_axYOuMo3DJI0xGBWfI";

    // google form entry key
    var formEntries = {
        nim:    "entry.1719197950",
        nama:   "entry.1270260493",
        idline: "entry.919817710",
        division: [
            "entry.1913572718",
            "entry.2061202386",
            "entry.1624881999",
            "entry.1350220173",
            "entry.277885585",
            "entry.933546810",
            "entry.1521225000",
            "entry.201225294",
            "entry.257564708",
            "entry.65830304",
            "entry.1198737195",
            "entry.1170044625",
            "entry.1050247186",
            "entry.1484587408",
            "entry.354642495",
            "entry.2045009708",
            "entry.124631733"
        ],
        reason: [
            "entry.1575940720",
            "entry.1117517217",
            "entry.1608496440"
        ],
        shuffled:"entry.1580498851"
    };


    $('#real-submit-button').click(function() {
        // generate form link
        var url = "//docs.google.com/forms/d/" + formKey + "/formResponse";

        // prepopulate form
        var form = $('#main-form');
        form.attr('action', url);
        form.html('');

        // nim and nama and telepon, dan id line
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
