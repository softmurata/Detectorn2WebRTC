from flask import Flask, request, Response
import jsonpickle
import numpy as np
import cv2
from PIL import Image, ImageDraw
import random
import io

# Initialize the Flask application
app = Flask(__name__)


# route http posts to this method
@app.route('/api/test', methods=['POST'])
def test():
    r = request
    # convert string of image data to uint8
    nparr = np.fromstring(r.data, np.uint8)
    # decode image
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # do some fancy processing here....

    # build a response dict to send back to client
    response = {'message': 'image received. size={}x{}'.format(img.shape[1], img.shape[0])
                }
    # encode response using jsonpickle
    response_pickled = jsonpickle.encode(response)

    return Response(response=response_pickled, status=200, mimetype="application/json")

@app.route("/api/send", methods=["POST"])
def send():
    image_file = request.files["image"]
    imageBytes = io.BytesIO()
    img = Image.open(image_file).convert("RGB")
    draw = ImageDraw.Draw(img)

    # ml process
    initPos = random.randint(200, 400)
    draw.rectangle((initPos, 100, 300, 200), fill=(0, 192, 192), outline=(255, 255, 255))


    img.save(imageBytes, format="JPEG")
    bytes = imageBytes.getvalue()

    return Response(response=bytes, status=200, mimetype="arraybuffer")

@app.route('/api/client')
def local():
    return Response(open('./static/client.html').read(), mimetype="text/html")


# start flask app
app.run(host="0.0.0.0", port=5000)