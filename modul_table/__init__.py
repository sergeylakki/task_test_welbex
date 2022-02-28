from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask.json import JSONEncoder
from contextlib import suppress

class MyJSONEncoder(JSONEncoder):
    def default(self, obj):
        # Optional: convert datetime objects to ISO format
        with suppress(AttributeError):
            return obj.isoformat()
        return dict(obj)


app = Flask(__name__)
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite.db'
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://tzozedhmbfiesy:982713e617c629a3e6fbbe8a5199285a6a87dc0dd26ab456cfea2cf9073dce21@ec2-63-34-223-144.eu-west-1.compute.amazonaws.com:5432/ddtf5qf7rrioh4"

db = SQLAlchemy(app)

app.json_encoder = MyJSONEncoder

from modul_table import models, routs
db.create_all()
