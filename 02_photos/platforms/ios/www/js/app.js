var app = {

    platform: null,
    osVersion: null,

    images: [],

    initialize: function() {

        this.bindEvents();

    },


    bindEvents: function() {

        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);

    },


    onDeviceReady: function() {

        this.platformGating();
        this.ui.init();

    },

    platformGating: function() {
        if(device) {

            this.platform = device.platform;
            this.osVersion = device.version;

            if(this.platform == 'iOS') {
                document.body.classList.add('ios');
            }

        } else {

            console.warn("Cordova Plugin Device no loaded.");

        }
    }, 

    ui: {
        init: function() {
            document.getElementById('camera').addEventListener('click', this.openCamera.bind(this), false);
            this.listView = document.getElementById('listView');
            this.carousel = document.getElementById('carousel');
            this.imagePreview = document.getElementById('preview');

            this.bindEvents();
        },

        bindEvents: function() {
            this.imagePreview.addEventListener("click", this.hideImagePreview.bind(this));
        },

        openCamera: function(e) {
            e.preventDefault();

            navigator.notification.confirm(
                'Choose the source of the image:',
                this.getPictureFromSource.bind(this),
                'Choose Image',
                ['Camera', 'Photo library', 'Saved photos', 'Cancel']
            );

        },

        getPictureFromSource: function(choice){

            var source = Camera.PictureSourceType.CAMERA;

            switch (choice) {
                case 2:
                    source = Camera.PictureSourceType.PHOTOLIBRARY;
                    break;
                case 3:
                    source = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                    break;
                case 4:
                    return;
            }


            var options = {
              quality : 100,
              destinationType : Camera.DestinationType.FILE_URI,
              sourceType : source,
              allowEdit : true,
              encodingType: Camera.EncodingType.JPEG,
              targetWidth: 2000,
              targetHeight: 2000,
              popoverOptions: CameraPopoverOptions,
              saveToPhotoAlbum: true
            };

            navigator.camera.getPicture(
                this.processCameraResults.bind(this),
                this.handleCameraError.bind(this),
                options
            );

        }, 

        processCameraResults: function(tmpPath) {
            function errorHandleFiles() {
                navigator.notification.alert(
                    'Can not store image.',
                    function() {},
                    'File System Error',
                    'Cancel'
                );
            }
            
            window.requestFileSystem(window.PERSISTENT, 10*1024*1024, function(fs){
                // get image from camera
                window.resolveLocalFileSystemURL(tmpPath, function(imageFile){

                    var ts = Math.round( Date.now()/1000 );

                    imageFile.moveTo(fs.root, 'image_'+ts+'.jpg', function(newFile){

                        console.log('File Moved:');
                        console.log(newFile);

                        app.images.push({
                            url: newFile.fullPath,
                            name: ts
                        });

                        app.ui.updateListView(app.images.length-1);

                    }, errorHandleFiles);

                }, errorHandleFiles);

            }, errorHandleFiles);

        }, 

        handleCameraError: function(error) {
            console.log(error);
            if (error != 'no image selected') {
                navigator.notification.alert(
                    error,
                    function() {},
                    'Picture Image Error',
                    'Okay'
                );
            }
        },

        listView: null, 

        updateListView: function(newIndex) {

            if (this.listView) {

                this.listView.innerHTML = '';

                app.images.forEach(function(image, index){
                    var li = document.createElement('li');

                    if (newIndex == index) {
                        li.className = 'slideOn';
                    }

                    var a = document.createElement('a');
                    a.href = '#';
                    a.addEventListener('click', this.showImagePreview.bind(this, index), false);
                    var img = new Image();
                    img.src = cordova.file.documentsDirectory + image.url;
                    img.alt = "Image number: " + index;

                    this.listView.appendChild(li);
                    li.appendChild(a);
                    a.appendChild(img);
                    a.appendChild( document.createTextNode("Image "+ image.name) );

                }.bind(this));

            } else {
                console.error('listView ID not found in DOM');
            }

        },

        carousel: null,
        imagePreview: null, 


        showImagePreview: function(index, e) {
            e.preventDefault();

            if(this.carousel && this.imagePreview) {
                var path = cordova.file.documentsDirectory + app.images[index].url;

                this.imagePreview.style.backgroundImage = "url('"+path+"')";
                this.carousel.classList.add('preview');

            } else {
                console.error("#carousel and #preview not found.")
            }

        },

        hideImagePreview: function(e) {
            e.preventDefault();

            this.carousel.classList.remove('preview');
        }

    }
};















