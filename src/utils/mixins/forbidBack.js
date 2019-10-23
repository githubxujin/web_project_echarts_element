import $ from 'jquery';
export default {
    beforeRouteEnter(to, from, next) {
        // just use `this`
        console.log('beforeRouteEnter :', to, from);
        if (from.path == '/auto-login') {
            $(function() {
                if (window.history && window.history.pushState) {
                    $(window).on('popstate', function() {
                        window.history.pushState('forward', null, '#');
                        window.history.forward(1);
                    });
                }
                window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
                window.history.forward(1);
            });
        }
        next();
    }
};
