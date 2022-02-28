//Создаем переменные
let page_number = 1
let page_all_namber = 3
let theads = document.querySelectorAll('thead .sorting')
let filters = document.querySelectorAll('.filter')
let btn_filter = document.getElementById('btn-filter')
let send_json = {}

let last_page_number=null
let last_sort_column=null
let sort_column =null
let sort_direct = null
let filter_column = null
let filter_value = null
let filter_operator = null

//Подключаем события
btn_filter.addEventListener('click',btn_filter_click)

for (let i=0; i<filters.length; i++){
    filters[i].addEventListener('change', change_filter)
}



for (let i=0; i<theads.length; i++){
    theads[i].addEventListener('click', clic_sort_title)
}



//updateTable(data)
pagination(page_number)
generate_send_json()
//Обновляем таблицу
function updateTable(data){
    let table = document.querySelector('tbody')
    table.innerHTML=''
    for (let i=0; i< data.length; i++){
        let tr = document.createElement('tr')
        //console.log(data[i])
            let td = document.createElement('td')
            td.innerHTML=data[i].date
            tr.append(td)
            td = document.createElement('td')
            td.innerHTML=data[i].name
            tr.append(td)
            td = document.createElement('td')
            td.innerHTML=data[i].number
            tr.append(td)
            td = document.createElement('td')
            td.innerHTML=data[i].distant
            tr.append(td)

        table.append(tr)
    }
}

//обновляем пагинацию
function pagination(page_number){
    if (page_number == 1)
        document.getElementById(`last`).classList.add('disabled')
    else
        document.getElementById(`last`).classList.remove('disabled')
    if (page_number == page_all_namber)
        document.getElementById('next').classList.add('disabled')
    else
        document.getElementById('next').classList.remove('disabled')

    document.getElementById(`p${page_number}`).classList.add('active')
    if (last_page_number != null)
        document.getElementById(`p${last_page_number}`).classList.remove('active')
}

//обрабатываем переход по страницам таблицы
function clic_paginator(event){
    let target=''
    if (event.target.classList.contains('page-link'))
        target=event.target.parentNode
    else
        target=event.target
    if (!target.classList.contains('disabled')) {
        if (!target.classList.contains('active')) {
            element_id = target.id
            console.log(element_id)
            last_page_number = page_number
            if (element_id == 'next') {
                page_number++
            } else if (element_id == 'last') {
                page_number--
            } else if (element_id[0] == 'p') {
                page_number = element_id[1]
            }
            console.log(page_number)
            pagination(page_number, last_page_number)
            generate_send_json()
        }
    }
}

//сортируем по колонкам
function clic_sort_title(event){
    if (last_sort_column != null && last_sort_column != event.target){
        last_sort_column.classList.remove('sorting_asc')
        last_sort_column.classList.remove('sorting_desc')
        last_sort_column.classList.add('sorting')
    }
    if (event.target.classList.contains("sorting")){
        event.target.classList.remove('sorting')
        event.target.classList.add('sorting_asc')
        sort_direct='asc'
    }
    else if(event.target.classList.contains("sorting_asc")){
        event.target.classList.remove('sorting_asc')
        event.target.classList.add('sorting_desc')
        sort_direct='desc'
    }
    else{
        event.target.classList.remove('sorting_desc')
        event.target.classList.add('sorting_asc')
        sort_direct='asc'
    }
    last_sort_column=event.target
    sort_column = event.target.id
    generate_send_json(null,null,null,)
}

//настраиваем фильтр
function change_filter(event){
    column = document.getElementById('column').value
    operator = document.getElementById('operator').value
    value = document.getElementById('value').value
    console.log(operator)
    if (operator != 'null' && column != 'null' &&value) {
        console.log('go')
        btn_filter.removeAttribute('disabled')
        btn_filter.focus()
        filter_column=column
        filter_operator=operator
        filter_value=value
        console.log(filter_column)
        console.log(filter_operator)
        console.log(filter_value)
    }
    else{
        btn_filter.setAttribute('disabled',true)
    }
}

//Фильтруем
function btn_filter_click(){
    page_number=1
    generate_send_json()
    last_page_number=null
}

function generate_send_json(){
    send_json = {
        'num_page': page_number,
        'filter': {'column':filter_column, 'operator': filter_operator, 'value':filter_value},
        'sorted': {'column':sort_column, 'direction':sort_direct}
    }
    console.log(send_json)
    getDatatable('/get_bd')
}

function update_pagination(num_page){
    page_all_namber = num_page
    let paginators = []
    let paginator = document.getElementById('pagination')
    paginator.innerHTML=''
    let li = document.createElement('li')
    li.innerHTML = '<a class="page-link" href="#">Предыдущий</a>'
    li.id="last"
    li.classList.add("page-item")
    console.log(li)
    paginator.append(li)
    paginators.push(li)
    for(let i=0;i<num_page; i++){
        li = document.createElement('li')
        li.innerHTML = `<a class="page-link" href="#">${i+1}</a>`
        li.id=`p${i+1}`
        li.classList.add("page-item")
        paginator.append(li)
        paginators.push(li)
    }
    li = document.createElement('li')
    li.innerHTML = '<a class="page-link" href="#">Следующий</a>'
    li.id="next"
    li.classList.add("page-item")
    paginator.append(li)
    paginators.push(li)

    for (let i=0; i<paginators.length; i++){
    paginators[i].addEventListener('click', clic_paginator)
}
    pagination(page_number)
}

//Посылаем запрос к бд
function getDatatable(url) {
    $.ajax({
        headers: { "Content-Type": "application/json"  },
            url:     url, //url страницы
            type:     "POST", //метод отправки
            dataType: "json", //формат данны
            data: JSON.stringify(send_json),//send_json,  // Сеарилизуем объект
            success: function(data) {
                console.log(data)
                updateTable(data.results)
                update_pagination(data.num_page)
            }, 
});
}