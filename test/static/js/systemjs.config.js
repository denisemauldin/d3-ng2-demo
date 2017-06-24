(function () {
    System.config({
        defaultJSExtensions: true,
        // map tells the System loader where to look for things
        map: {
          //'app': '/static/app',

            // angular bundles
            '@angular/core': '/static/libs/@angular/core/bundles/core.umd.js',
            '@angular/common': '/static/libs/@angular/common/bundles/common.umd.js',
            '@angular/compiler': '/static/libs/@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': '/static/libs/@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': '/static/libs/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': '/static/libs/@angular/http/bundles/http.umd.js',
            '@angular/http/testing': '/static/libs/@angular/http/bundles/http-testing.umd.js',
            '@angular/router': '/static/libs/@angular/router/bundles/router.umd.js',
            '@angular/forms': '/static/libs/@angular/forms/bundles/forms.umd.js',

            // other
            'rxjs': '/static/libs/rxjs',
            'jquery': '/static/libs/jquery/dist/jquery.min.js',
            'lodash': '/static/libs/lodash/index.js',
            'underscore': '/static/libs/lodash/index.js',
            '*': {
                'underscore': '/static/libs/lodash/index.js',
                'lodash': '/static/libs/lodash/index.js',
            },
            'backbone': '/static/libs/backbone-min.js',
            'jointjs': '/static/libs/jointjs/joint.js',
            'foundation-sites': '/static/libs/foundation-sites/foundation.min.js',
            'angular2-modal': '/static/libs/angular2-modal.umd.js',
            'angular2-modal/plugins/vex': '/static/libs/angular2-modal.vex.umd.js',
            'd3': '/static/libs/d3',
            'd3-ng2-service': '/static/libs/d3Service/index.js',
        },
        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            app: {
                main: './main.js',
                defaultExtension: 'js'
            },
            rxjs: {
                defaultExtension: 'js'
            },
            'd3-ng2-service': {
                defaultExtension: 'js'
            }
        },
        meta: {
            'jointjs': {
                exports: 'joint',
                deps: ['jquery', 'lodash', 'underscore', 'backbone']
            },
            'backbone': {
                deps: ['underscore'],
            },
            'graphlib': {
                format: 'global',
                deps: ['lodash'],
            },
            'dagre': {
                format: 'global',
                deps: ['lodash'],
            },
            'd3-ng2-service': {
                deps: ['d3'],
            },
        },
    });
})();
