from flask import Flask,render_template,url_for,request,jsonify,redirect,Response
from werkzeug.utils import secure_filename


from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.applications.xception import Xception
from keras.models import load_model
from pickle import load
import numpy as np
from PIL import Image

import cv2
import tempfile
import sys
import os
import glob
import re

import os
import pickle
import numpy as np
from tqdm.notebook import tqdm
import tensorflow
from keras.applications.vgg16 import VGG16, preprocess_input
from keras.preprocessing.image import load_img, img_to_array
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.models import Model
from tensorflow.keras.utils import to_categorical, plot_model
from keras.layers import Input, Dense, LSTM, Embedding, Dropout, add


from googletrans import Translator
translator = Translator()

app = Flask(__name__)









app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG","PNG"]



@app.route('/video')
def video():
    return ""

@app.route('/')
def frontPage():
    return render_template('frontpage.html')



@app.route('/startcaptioning')
def home():
    return render_template('home.html')

@app.route('/startcaptioningusingcamera')
def camera():
    return render_template('camera.html')


@app.route('/image')
def index():
    return render_template('index.html')




@app.route('/predict', methods=['POST'])
def upload():
    def extract_features(img_path, model):
        try:
            image = Image.open(img_path)
        except:
            print("ERROR: Couldn't open image! Make sure the image path and extension is correct")
        image = load_img(img_path, target_size=(224, 224))
        image = img_to_array(image)
        image = image.reshape((1, image.shape[0], image.shape[1], image.shape[2]))
        image = preprocess_input(image)
        feature = model.predict(image, verbose=0)
        print(feature)
        return feature
    
    def idx_to_word(integer, tokenizer):
        for word, index in tokenizer.word_index.items():
            if index == integer:
                return word
        return None


    def predict_caption(model, image, tokenizer, max_length):
        in_text = 'startseq'
        for i in range(max_length):
            sequence = tokenizer.texts_to_sequences([in_text])[0]
            sequence = pad_sequences([sequence], max_length)
            yhat = model.predict([image, sequence], verbose=0)
            yhat = np.argmax(yhat)
            word = idx_to_word(yhat, tokenizer)
            if word is None:
                break
            in_text += " " + word
            if word == 'endseq':
                break
        
        return " ".join(in_text.split(" ")[1:-1])
    max_length = 37
    with open('tokenizer.pkl', 'rb') as handle:
        tokenizer = pickle.load(handle)

    model = load_model('best_model.h5')
    VGG16Model = VGG16()
    VGG16Model = Model(inputs=VGG16Model.inputs, outputs=VGG16Model.layers[-2].output)

    def allowed_image(fname):
        if not "." in fname:
            return False
        ext = fname.rsplit(".", 1)[1]
        if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
            return True
        else:
            return False

    if request.method == 'POST':
       
        f = request.files['file']
        fname = secure_filename(f.filename)
        print("fname",fname)
        if allowed_image(fname):
            basepath = os.path.dirname(__file__)
            print("Basepath",basepath);
            file_path = os.path.join(basepath, 'uploads', fname)
            print("file_path",file_path)
            f.save(file_path)
            photo = extract_features(file_path, VGG16Model)
            description = predict_caption(model, photo, tokenizer, max_length)
            if os.path.exists(file_path):
                os.remove(file_path)
            return description
        else:
            return 'Error occured, Please ensure you\'re using jpeg or jpg file format.' 
    return None


if __name__ == '__main__':
    app.run(debug=True,port=5000) 