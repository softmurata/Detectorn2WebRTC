from __future__ import print_function
import requests
import json
import cv2
import jsonpickle
from PIL import Image
import io
import numpy as np

"""
addr = 'http://localhost:5000'
test_url = addr + '/api/test'

# prepare headers for http request
content_type = 'image/jpeg'
headers = {'content-type': content_type}

img = cv2.imread('lena.jpg')
# encode image as jpeg
_, img_encoded = cv2.imencode('.jpg', img)
# send http request with image and receive response
response = requests.post(test_url, data=img_encoded.tostring(), headers=headers)
# decode response
print(json.loads(response.text))
"""

url = "http://localhost:5000/api/send"

response = requests.post(url)
frame = jsonpickle.decode(response.text)
frame = frame.tobytes()
frame = Image.open(io.BytesIO(frame)).convert("RGB")
# write frame
frame = np.asarray(frame)
cv2.imwrite("frame.png", frame)
