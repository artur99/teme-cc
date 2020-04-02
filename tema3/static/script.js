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
})
