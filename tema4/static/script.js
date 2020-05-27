var load_tasks = function() {
    $.post("/api/get_tasks").done(task_list => {
        if(!task_list) return;
        
        var tot_html = ''

        for(let task of task_list) {
            tot_html += `<div class="task" data-id="${task.id.id}">`
            tot_html += `<label>`

            tot_html += `<input type="checkbox" ${task.done ? 'checked' : ''}>`
            tot_html += `<span>${task.description}</span>`

            tot_html += `</label>`
            tot_html += `</div>`
        }

        $(".tasklist").html(tot_html)
    })
}

$(document).ready(function(){
    $('.login_form').submit(function(e) {
        e.preventDefault(e)

        var data = {}
        $('.login_form').serializeArray().map(x => data[x.name] = x.value.trim())
        if(!data.email || !data.pass) return false

        $.post("/api/login", data)
        .done(function(resp){
            if(resp.error) {
                return Swal.fire("Error", resp.error, 'error')
            }
            Swal.fire("Success", resp.success, 'success').then(_ => {
                window.location.href = '/dash'
            })
        })

        return false
    })

    $('.register_form').submit(function(e) {
        e.preventDefault(e)

        var data = {}
        $('.register_form').serializeArray().map(x => data[x.name] = x.value.trim())
        if(!data.email || !data.pass || !data.cpass) return false

        $.post("/api/register", data)
        .done(function(resp){
            if(resp.error) {
                return Swal.fire("Error", resp.error, 'error')
            }
            Swal.fire("Success", resp.success + ' Now you can login.', 'success').then(_ => {
                window.location.href = '/'
            })
        })

        return false
    })

    $(".logout-btn").click(function(e) {
        e.preventDefault();

        $.post("/api/logout").done(_ => {
            window.location.href = '/'
        })
    })

    $(".form_add_task").submit(function(e) {
        e.preventDefault()

        var desc = $("#task_desc").val().trim()
        if(!desc.length) return false

        $("#task_desc").val("")

        $.post("/api/add_task", {description: desc}).done(_ => {
            load_tasks()
        })

        return false
    })

    $(document).on('change', '.task', function(e) {
        var task_id = $(this).data('id')
        var done = $(this).find('input[type=checkbox]').is(':checked')

        $.post("/api/mark_task", {task_id: task_id, done: done}).done(_ => {
            // load_tasks()
        })
    })


    if($(".tasklist").length) {
        load_tasks()
    }
})
