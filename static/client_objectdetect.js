// Parameters
const s = document.getElementById("objDetect");
const sourceVideo = s.getAttribute("data-source");
const uploadWidth = s.getAttribute("data-uploadWidth") || 640;
const mirror = s.getAttribute("data-mirror") || false;
const scoreThreshold = 0.5;

// video element selector
v = document.getElementById(sourceVideo);

// for starting events
let isPlaying = false, gotMetadata = false;

let imageCanvas = document.createElement("canvas");
let imageCtx = imageCanvas.getContext("2d");

// create canvas for drawing object binaries
let drawCanvas = document.createElement("canvas");
document.body.appendChild(drawCanvas);
let drawCtx = drawCanvas.getContext("2d");

// starting events

// check if metadata is ready - we need the video size
v.onloadedmetadata = () => {
    console.log("video metadata ready");
    gotMetadata = true;
    if (isPlaying)
        startObjectDetection();
}

// see if the video has started playing
v.onplaying = () => {
    console.log("video playing");
    isPlaying = true;
    if (gotMetadata)
        startObjectDetection();
}


function startObjectDetection(){
    console.log("starting object detection");
    drawCanvas.width = v.videoWidth;
    drawCanvas.height = v.videoHeight;
    imageCanvas.width = uploadWidth;
    imageCanvas.height = uploadWidth * (v.videoHeight / v.videoWidth);

    // some styles for draw canvas
    drawCtx.lineWidth = "4";
    drawCtx.strokeStyle = "cyan";
    drawCtx.font = "20px Verdana";
    drawCtx.fillStyle = "cyan";

    // save and send first frame
    
    imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight);
    imageCanvas.toBlob(postFile, 'image/jpeg');
}

// add file blob to a form and post
function postFile(file)
{
    // set options as form data
    let formData = new FormData();
    formData.append("image", file);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", window.location.origin + "/api/send", true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        if (this.status == 200){
            let bytes = new Uint8Array(this.response);
            let binaryData = "";

            for (let i=0, len=bytes.byteLength; i<len; i++){
                binaryData += String.fromCharCode(bytes[i]);
            }

            // draw boxes
            drawImage(binaryData)

            imageCtx.drawImage(v, 0, 0, v.videoWidth, v.videoHeight, 0, 0, uploadWidth, uploadWidth * (v.videoHeight / v.videoWidth));
            imageCanvas.toBlob(postFile, "image/jpeg");

        }
        else{
            console.error(xhr);
        }
    }

    xhr.send(formData);
}

function drawImage(binaryData){
    let image = new Image();
    image.src = "data:image/jpeg;base64," + window.btoa(binaryData);
    image.onload = function(){
        console.log(image.width, image.height, v.videoWidth, v.videoHeight);
        // send the next image
        drawCtx.drawImage(image, 0, 0, image.width, image.height);
    }
}