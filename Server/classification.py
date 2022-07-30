from pycaret.classification import *
from pandas.api.types import is_float_dtype

def can_apply(series):
    return len(series.unique()) <= 0.5*len(series)

def get_res_model(df, target, filename):
    setup(data = df, target=target, silent=True)
    cm = compare_models()
    save_model(cm, filename)
    model_comparison_result = pull().to_dict('records')[:5]
    results = predict_model(cm, data = df)[[target, 'Label']].to_dict('list')
    results['Predicted ' + target] = results.pop('Label')
    return model_comparison_result, results