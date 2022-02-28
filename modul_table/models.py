from modul_table import db
from sqlalchemy.inspection import inspect

class ModelMixin:
    """Provide dict-like interface to db.Model subclasses."""

    def __getitem__(self, key):
        """Expose object attributes like dict values."""
        return getattr(self, key)

    def keys(self):
        """Identify what db columns we have."""
        return inspect(self).attrs.keys()

class Table(db.Model, ModelMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DATE, nullable=False)
    name = db.Column(db.String(300), nullable=False)
    number = db.Column(db.Integer, nullable=False)
    distant = db.Column(db.Integer, nullable=False)

    def __str__(self):
        return f'date:{self.date}, name: {self.name}, number: {self.number}, distant: {self.distant}'