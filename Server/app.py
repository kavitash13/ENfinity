import datetime
import io
import traceback
from pathlib import Path

import pandas as pd
from flask import Flask, Response, jsonify, request, send_file
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from mongoengine import *

import classification
import regression

# giving runnnig mode to flask
app = Flask(__name__)
CORS(app)
# to give a secret key when creating a databse
app.secret_key = "gurpreet2001"

# connecting/configuring the databse
app.config['MONGODB_SETTINGS'] = {
    'db': 'ENfinity',
    'host': 'localhost',
    'port': 27017
}

# schema pattern of mongo to be followed
db = MongoEngine()
db.init_app(app)

# allowed extensions to be uploaded in the database
Allowed_Extensions = set(['csv', 'xlsx', 'xlsm', 'xlsb', 'xltx',
                         'xltm', 'xls', 'xlt', 'xls', 'xml', 'xlam', 'xla', 'xlw', 'xlr'])
UPLOAD_DEST = Path(__file__).parent/'uploads'
TRAINED_MODELS_FOLDER = Path(__file__).parent / 'trained_models'

UPLOAD_DEST.mkdir(exist_ok=True)
TRAINED_MODELS_FOLDER.mkdir(exist_ok=True)

app.config["UPLOAD_FOLDER"] = str(UPLOAD_DEST)
app.config["TRAINED_MODELS_FOLDER"] = TRAINED_MODELS_FOLDER

# to check whether uploaded file is permissible or not


def get_extension(filename_or_path: str):
    return filename_or_path.split(".")[-1].lower()


def allowedfile(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Allowed_Extensions

# MongoEngine Model


class Data_Lake(db.Document):
    name = db.StringField(max_length=250, required=True)
    data_file = db.FileField(required=True)
    modified_date = db.DateTimeField(default=datetime.datetime.now)


@app.route('/upload', methods=['POST'])
def upload():
    try:
        file = request.files['file']
        if file and allowedfile(file.filename):
            # Save to Filesystem
            series = request.form["series"]
            device = request.form.get("device", "")
            filename = series
            if device:
                filename += "_" + device
            filename += "." + get_extension(file.filename)

            filepath = app.config['UPLOAD_FOLDER'] + '/' + filename
            file.save(filepath)

            update = True
            doc = Data_Lake.objects(name=filename).first()
            if doc is None:
                update = False
                doc = Data_Lake(name=filename)

            with open(filepath, 'rb') as f:
                if update:
                    doc.data_file.replace(f, content_type=file.content_type)
                else:
                    doc.data_file.put(f, content_type=file.content_type)
            doc.modified_date = datetime.datetime.now()
            doc.save()

            return Response('{"filename": "%s"}' % filename, status=201, mimetype='application/json')

    except Exception as e:
        traceback.print_exc()

    return Response(status=406)


def df_string_mapper(read_file):
    for col in read_file:
        if read_file[col].dtype == object:
            map_dict = {}
            i = 0
            for unique_value in read_file[col].unique():
                if type(unique_value) == float:
                    continue
                map_dict[unique_value] = i
                i += 1
            read_file[col] = read_file[col].replace(map_dict).astype('float64')
    return read_file


@app.route('/summary/<filename>', methods=['GET'])
def column_summary(filename):
    func = pd.read_excel if get_extension(
        filename).lower() != 'csv' else pd.read_csv
    read_file = func(app.config['UPLOAD_FOLDER'] + '/' + filename)
    # [
    #   {column, mean, median ...},
    #   {...}
    # ]
    response_json = []

    read_file = df_string_mapper(read_file)

    for col in read_file:
        obj = {}
        obj['Column'] = col
        obj['values'] = list(read_file[col].dropna())
        obj['Mean'] = str(round(read_file[col].mean(), 2))
        obj['Std'] = str(round(read_file[col].std(), 2))
        obj['Median'] = str(round(read_file[col].median(), 2))
        obj['Nulls'] = str(read_file[col].isna().sum())
        obj['Max'] = str(read_file[col].max())
        obj['Min'] = str(read_file[col].min())
        obj['Data Type'] = str(read_file[col].dtype)
        response_json.append(obj)

    return jsonify(response_json)


@app.route('/train/<filename>', methods=['POST'])
def train(filename):
    print(request.json)
    # if float directly apply regression
    # if string directly apply classification
    #
    # if (int)
    #   if(atleast 50% rows from target column are unique)  regression
    #   else classification
    #
    # OR ask from user
    # {
    #   is_classification : true,
    # [
    #  { column, replaceNull: true, removeOutliers: true, target: true}
    # ]
    # }
    func = pd.read_excel if get_extension(
        filename).lower() != 'csv' else pd.read_csv
    read_file = func(app.config['UPLOAD_FOLDER'] + '/' + filename)

    # find delete cols -> saare_cols - required_cols
    required_cols = set()
    remove_outlier_cols = set()
    replace_null_cols = set()
    target_col = ""
    for col in request.json:
        required_cols.add(col['Column'])
        if col.get('target', False):
            target_col = col['Column']
        if col.get('removeOutliers', False):
            remove_outlier_cols.add(col['Column'])
        if col.get('replaceNull', False):
            replace_null_cols.add(col['Column'])

    delete_cols = set(read_file.columns).difference(required_cols)
    read_file.drop(columns=delete_cols, inplace=True)

    # read_file = df_string_mapper(read_file)

    print("Df string to int")

    # Remove Outliers
    try:
        Q1 = read_file[remove_outlier_cols].quantile(0.25)
        Q3 = read_file[remove_outlier_cols].quantile(0.75)
        # Inter Quartile Range
        IQR = Q3 - Q1

        read_file = read_file[~((read_file[remove_outlier_cols] < (
            Q1 - 1.5 * IQR)) | (read_file[remove_outlier_cols] > (Q3 + 1.5 * IQR))).any(axis=1)]

        print("Df remove outliers")
    except:
        pass

    # Replace Null
    for col in replace_null_cols:
        try:
            read_file[col] = read_file[col].fillna(read_file[col].mean())
        except:
            pass
    try:
        read_file[target_col] = read_file[target_col].fillna(
            read_file[target_col].mean())
        print("Df replace Null")
    except:
        pass

    try:
        required_cols = list(required_cols)
        required_cols.remove(target_col)
        categorical_features.remove(target_col)
    except:
        pass

    model_comparison_result, results = 0, 0
    if classification.can_apply(read_file[target_col]):
        print("Classification")
        model_comparison_result, results = classification.get_res_model(
            read_file, target_col, TRAINED_MODELS_FOLDER/filename)
    else:
        print("Regression")
        model_comparison_result, results = regression.get_res_model(
            read_file, target_col, TRAINED_MODELS_FOLDER/filename)

    return jsonify({"cols": list(required_cols), "m": model_comparison_result, "r": results})


@app.route('/predict/<filename>', methods=['POST'])
def predict(filename):
    df = pd.DataFrame({k: [v] for k, v in request.json.items() })
    a = -1
    try:
        from pycaret.classification import load_model, predict_model
        model = load_model(str(TRAINED_MODELS_FOLDER/filename))
        prediction = predict_model(model, data=df)
        a = prediction['Label'].iloc[0]
    except:
        try:
            from pycaret.regression import load_model, predict_model
            model = load_model(str(TRAINED_MODELS_FOLDER/filename))
            prediction = predict_model(model, data=df)
            a = prediction['Label'].iloc[0]
        except:
            pass
    return jsonify({'ans': int(a)})


@app.route("/get-files", methods=['GET'])
def get_files():
    data = Data_Lake.objects
    return jsonify(data)


@app.route("/download/<pk>", methods=['GET'])
def download(pk):
    try:
        doc = Data_Lake.objects(pk=pk).first()
        bytes_data = doc.data_file.read()
        mimetype = doc.data_file.content_type
        return send_file(
            io.BytesIO(bytes_data),
            mimetype=mimetype,
            download_name=f'{doc.name}',
            as_attachment=True
        )
    except:
        Response(status=404)


if __name__ == '__main__':
    app.run(debug=True)
