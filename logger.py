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
        'arm1Angle': table.getNumber('arm1Angle', 120),
        'arm2Angle': table.getNumber('arm2Angle', 40),
        'gripperClosed': table.getNumber('gripperStatus', 1)
    }
    balance = {
        'balanceAngle': table.getNumber('balanceAngle', 6)
    }
    LED = {
        'colorState': table.getNumber('colorState', 0)
    }
    swerve = {
        'FLAngle': table.getNumber('FLCC',12),
        'FRAngle': table.getNumber('FRCC', 12),
        'BLAngle': table.getNumber('BLCC', 12),
        'BRAngle': table.getNumber('BRCC', 12),
        'FLPow': table.getNumber('FLWM', 100),
        'FRPow': table.getNumber('FRWM', 100),
        'BLPow': table.getNumber('BLWM', 100),
        'BRPow': table.getNumber('BRWM', 100)
        }
    leRobot = [arm, balance, LED, swerve]
    return leRobot

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=3000)



    
