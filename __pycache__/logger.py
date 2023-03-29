from networktables import NetworkTables
from flask import Flask


# To see messages from networktables, you must setup logging
import logging

logging.basicConfig(level=logging.DEBUG)

ip = '10.49.3.2'

NetworkTables.initialize(server=ip)

table = NetworkTables.getTable("SmartDashboard")


app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5555'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'OPTIONS, GET, POST, PUT, DELETE'
    return response

@app.route("/")
def hello():
    arm = {
        'arm1Angle': table.getNumber('arm1Angle', 0),
        'arm2Angle': table.getNumber('arm2Angle', 0)
    }
    balance = {
        'balanceAngle': table.getNumber('balanceAngle', 0)
    }
    LED = {
        'colorState': table.getNumber('colorState', 0)
    }
    swerve = {
        'FLAngle': table.getNumber('FLCC',0),
        'FRAngle': table.getNumber('FRCC', 0),
        'BLAngle': table.getNumber('BLCC', 0),
        'BRAngle': table.getNumber('BRCC', 0),
        'FLPow': table.getNumber('FLWM', 0),
        'FRPow': table.getNumber('FRWM', 0),
        'BLPow': table.getNumber('BLWM', 0),
        'BRPow': table.getNumber('BRWM', 0)
        }
    leRobot = [arm, balance, LED, swerve]
    return leRobot

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)



    
