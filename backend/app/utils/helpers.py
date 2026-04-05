import time

def get_risk(glucose):
    if glucose < 70:
        return "HIGH"
    elif glucose < 90:
        return "MEDIUM"
    return "LOW"

def user_average(data):
    return sum(data)/len(data)

def personalize(pred, avg):
    return pred - (100 - avg) * 0.1

def minutes_since(timestamp):
    return (time.time() - timestamp)/60