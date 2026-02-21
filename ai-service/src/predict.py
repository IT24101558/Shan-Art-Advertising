import pickle

def load_model():
    # Load model from file
    # with open('../models/model.pkl', 'rb') as f:
    #     return pickle.load(f)
    return None

def predict(features):
    model = load_model()
    if model:
        return model.predict(features)
    return "No model loaded"
