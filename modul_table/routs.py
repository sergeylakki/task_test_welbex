from flask import Flask, render_template, redirect, url_for, request, flash,jsonify,json
from modul_table import app, db
from modul_table.models import Table
from datetime import date
from sqlalchemy import desc,asc


@app.route('/', methods=['GET'])
def index():
    numbers = Table.query.all()
    print(numbers)
    return render_template('index.html')


@app.route('/get_bd', methods=['GET', 'POST'])
def get_bd():
    req_data = request.get_json()
    page = int(req_data['num_page'])
    if req_data['filter']['column'] is not None:
        query = query_filter(req_data['filter']['column'], req_data['filter']['operator'], req_data['filter']['value'])
    else:
        query = Table.query
    print(query)
    print(req_data)

    if req_data['sorted']['column'] is not None:
        data = sorted_data(page, 6, req_data['sorted']['column'], req_data['sorted']['direction'],query)
    else:
        print(type(query))
        data = query.paginate(page, 6, False)
        #data = Table.query.paginate(page, 3, False).items

    send_data = dict(results=data.items, num_page=data.pages)
    #send_data['number_page'] = data.pages
    return jsonify(send_data)


@app.route('/create_bd', methods=['GET'])
def create_bd():

    db.session.add(Table(date=date.today(), name='Москва', number=20, distant=10000))
    db.session.add(Table(date=date.today(), name='Хабаровск', number=90, distant=23300))
    db.session.add(Table(date=date.today(), name='Новосибирск', number=20, distant=6700))
    db.session.add(Table(date=date.today(), name='Геленджик', number=40, distant=13400))
    db.session.add(Table(date=date.today(), name='Краснодар', number=60, distant=15200))
    db.session.add(Table(date=date.today(), name='Омск', number=120, distant=12100))
    db.session.add(Table(date=date.today(), name='Иркутск', number=10, distant=344100))
    db.session.add(Table(date=date.today(), name='Новгород', number=50, distant=54100))
    db.session.add(Table(date=date.today(), name='Сочи', number=25, distant=23100))
    db.session.commit()
    for item in Table.query.all():
        print(item)
    return "base create"


def sorted_data(page, page_list, column, direct, query):
    if direct == 'desc':
        if column == 'name':
            return  query.order_by(Table.name.desc()).paginate(page, page_list, False)
        elif column == 'distant':
            return  query.order_by(Table.distant.desc()).paginate(page, page_list, False)
        elif column == 'number':
            return  query.order_by(Table.number.desc()).paginate(page, page_list, False)
    elif direct == 'asc':
        if column == 'name':
            return  query.order_by(Table.name.asc()).paginate(page, page_list, False)
        elif column == 'distant':
            return  query.order_by(Table.distant.asc()).paginate(page, page_list, False)
        elif column == 'number':
            return  query.order_by(Table.number.asc()).paginate(page, page_list, False)
    return None


def query_filter(column, operator, value):
    if column == 'name':
        if operator == 'in':
            return Table.query.filter(Table.name.ilike('%' + value + '%'))
        elif operator == '=':
            return Table.query.filter(Table.name.ilike(value))
            #return Table.query.filter(Table.name == value)

    if column == 'number':
        if operator == '>':
            return Table.query.filter(Table.number > int(value))
        if operator == '<':
            return Table.query.filter(Table.number < int(value))
        if operator == '=':
            return Table.query.filter(Table.number == int(value))

    if column == 'distant':
        if operator == '>':
            return Table.query.filter(Table.distant > int(value))
        if operator == '<':
            return Table.query.filter(Table.distant < int(value))
        if operator == '=':
            return Table.query.filter(Table.distant == int(value))