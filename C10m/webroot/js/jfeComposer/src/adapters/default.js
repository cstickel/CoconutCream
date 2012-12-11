$.jfeC.addAdapter('default', {
    name: "default",
    'get': function(data, options, jfeCSettings) {
        var postData = {
            'requestType': 'ajax'
        };

        $.extend(true, postData, { data: data.data }, options['postData']);
        return {
            url:  jfeCSettings.baseURL + '/' + options.controller + '/get',
            data: postData
        };
    },
    'create': function(data, options, jfeCSettings) {
        return this.update(data, options, jfeCSettings);
    },
    'update': function(data, options, jfeCSettings) {
        var postData = {
            'requestType': 'ajax'
        };

        $.extend(true, postData, { data: data.data }, options['postData']);
        return {
            url:  jfeCSettings.baseURL + '/' + options.controller + '/edit',
            data: postData
        };
    },
    'translate': function(data, options, jfeCSettings) {
        var postData = {
            'requestType': 'ajax'
        };

        $.extend(true, postData, { data: data.data }, options['postData']);
        return {
            url:  jfeCSettings.baseURL + '/' + options.controller + '/translate',
            data: postData
        };
    },
    'delete': function(data, options, jfeCSettings) {
        var postData = {
            'requestType': 'ajax'
        };

        $.extend(true, postData, data.data, options['postData']);

        return {
            url:  jfeCSettings.baseURL + '/' + options.controller + '/delete/'+data.id,
            data: postData
        };
    },
    'blobUpload': function(data, options, jfeCSettings) {
        var formData = new FormData();

        if(data.data.files.length > 1) {
            $.each(data.files, function() {
                formData.append(data.data['fieldName']+"[]", this);
            });
        }
        else formData.append(data.data['fieldName'], data.data.files[0]);
        $.each($.param(options.postData).split("&"), function(){
            var parameter = this.split('=');
            formData.append(unescape(parameter[0]), parameter[1]);
        });
        return {
            url:  jfeCSettings.baseURL + '/' + options.controller + '/edit/',
            formDataObject: formData
        };
    },
    'isSuccess': function(response) {
        if (response['error'] == 0) return true;
        return false;
    },
    'parseResponse': function(response) {
        return $.parseJSON(response);
    }
});