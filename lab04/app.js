//app.js -modulo de gestion
const form = document.querySelector("taskList")
function renderTask(){
    list.inneerHtmL ='';
    task.forEach(task,index) => {
        const li = document.createElement('li');
        li.className = 'list-group-itme d-flex justify-content-between align item-center';
        li.innerHTML=
        <span>$(task.text)</span>
    }
}