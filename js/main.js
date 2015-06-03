var kw;

(function (kw, $, WIN, DOC, undefined) {

    var showProject,
        loadData,
        data,
        index,
        bind,
        animating = false,
        open = false,
        otherClose = false,
        device,
        rowAmount,
        thumbOffset;

    loadData = function () {
        $.getJSON('data/data.json', function(d) {
            data = d.data;
            showProject(data[index]);
        });
    };

    bind = function () {
        $('.fa-search').on('click', function () {
            if (!animating) {
                index = $('.thumb').index($(this).parent('.thumb'));
                if (open) { 
                    $('.fa-times-circle').click();
                    otherClose = true;
                }
                else loadData();
            }
        });
    };

    resize = function () {
        var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (width > 1034) {
            device = 'desktop';
            rowAmount = 3;
        } else if (width > 674 && width <= 1034) {
            device = 'tablet';
            rowAmount = 2;
        } else if (width <= 674) {
            device = 'mobile';
            rowAmount = 1;
        }

        if (open) {
            $('.thumb').removeClass('hide');
            setThumbOffset();
            setProjectOffset();
            hideThumbs();
        }
    };

    hideThumbs = function () {
        for (var i = thumbOffset; i < thumbOffset + (rowAmount * 2); i++) {
            $('.thumb').eq(i).addClass('hide');
        }
    };

    setThumbOffset = function () {
        if (index > $('.thumb').length - 1 - rowAmount) thumbOffset = Math.floor((index - rowAmount) / rowAmount) * rowAmount;
        else thumbOffset = Math.floor(index / rowAmount) * rowAmount;
    };

    setProjectOffset = function () {
        var offset;

        if (index > $('.thumb').length - 1 - rowAmount) offset = Math.floor((index - rowAmount) / rowAmount) * 320 + 20;
        else offset = Math.floor(index / rowAmount) * 320 + 20;

        $('.project').css({ 'top': offset });
    };

    growEnd = function () {
        setThumbOffset();
        $(this)
            .off('animationend')
            .off('oanimationend')
            .off('MSAnimationEnd')
            .off('webkitAnimationEnd');

        hideThumbs();
        animating = false;

    };

    shrinkEnd = function () {
        $(this).remove()
            .off('animationend')
            .off('oanimationend')
            .off('MSAnimationEnd')
            .off('webkitAnimationEnd');

            if (otherClose) {
                showProject(data[index]);
                otherClose = false;
            }
            else open = false;

        animating = false;
    };

    showProject = function (d) {
        var $section;
            
        open = true;
        animating = true;

        $('.thumbnails').append('<section class="project"></section>');

        $section = $('.project');

        setProjectOffset();

        $section.addClass('grow-in')
            .on('animationend', growEnd)
            .on('oanimationend', growEnd)
            .on('MSAnimationEnd', growEnd)
            .on('webkitAnimationEnd', growEnd);

        $section.append(
            '<div class="info">' +
                '<h4>' + d.title + '</h4>' +
                '<p class="small">Agency</p>' +
                '<p>' + d.agency + '</p>' +
                '<p class="small">Client</p>' +
                '<p>' + d.client + '</p>' +
                '<p class="small">Overview</p>' +
                '<p>' + d.overview + '</p>' +
                '<p class="small">Responsibilites</p>' +
                '<p>' + d.responsibilites + '</p>' +
                '<p class="small">Tools used</p>' +
                '<p>' + d.tools + '</p>' +
                '<a href="' + d.url + '" target="_blank">' + d.visit + '</a>' +
            '</div>' +
            '<div class="carousel">' +
                '<div class="controls">' +
                    '<i class="fa fa-chevron-left arrow"></i>' +
                    '<i class="fa fa-chevron-right arrow"></i>' +
                '</div>' +
                '<div class="window"></div>' +
            '</div>' +
            '<i class="fa fa-times-circle"></i>'
        );

        if (d.url === null) {
            $section.find('a').addClass('disabled').on('click', function() {
                return false;
            });
        }

        if (d.images.length == 1) $('.controls').addClass('hide');

        for (var i = 0; i < d.images.length; i++) {
            $section.find('.window').append('<img src="' + d.images[i] + '" alt="" />');
        }

        $section.find('.carousel').carousel();
        $section.on('click', '.fa-times-circle', function () {
            if (!animating) {
                animating = true;
                $section.addClass('grow-out')
                .on('animationend', shrinkEnd)
                .on('oanimationend', shrinkEnd)
                .on('MSAnimationEnd', shrinkEnd)
                .on('webkitAnimationEnd', shrinkEnd);

                $('.thumb').removeClass('hide');
            }
        });
    };

    kw.init = function () {
        bind();
        resize();
        window.onresize = resize;
    };

    $(kw.init);
    return kw;

}(kw = kw || {}, jQuery, window, document, undefined));

//carousel plugin
$.fn.carousel = function () {
    var $car = this,
        $imgs = $car.find('img'),
        index = 0,
        animating = false,
        transition,
        updatePagination;
        
    $imgs.eq(0).addClass('active');

    transition = function (direction) {
        if ($(this).hasClass('fa-chevron-right') && !animating) {
            $imgs.eq(index).animate({'left': -428});
            index++;
            if (index > $imgs.length - 1) index = 0;
            $imgs.eq(index).addClass('active').css({'left': 428}).animate({'left': 0}, resetAnimation);
        } else if (!animating) {
            $imgs.eq(index).animate({'left': 428});
            index--;
            if (index < 0) index = $imgs.length - 1;
            $imgs.eq(index).addClass('active').css({'left': -428}).animate({'left': 0}, resetAnimation);
        }

        updatePagination();
        animating = true;
    };

    updatePagination = function () {
        $car.find('.pagi').removeClass('active').eq(index).addClass('active');
    };

    resetAnimation = function () {
        animating = false;
    };

    //create pagination
    for (var i = 0; i < $imgs.length; i++) {
        $car.find('.fa-chevron-left').after('<i class="fa pagi"></i>');
    }
    $car.find('.pagi').eq(0).addClass('active');

    //events
    $car.on('click', '.arrow', transition);
};