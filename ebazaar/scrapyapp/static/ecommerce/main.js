function redirect(url) {
    window.location.href = url;
}

function spliceSplit(str, index, count) {
    let ar = str.split('');
    ar.splice(index, count);
    return ar.join('');
}

function removeParam(label, key, source_url) {
    let url_list = source_url.split('?')
    let new_url = url_list[0]

    if (url_list.length > 1){
        let params_str = url_list[1]
        params_str = params_str.replaceAll('+', ' ')
        let search_param = label + '=' + key
        let index = params_str.indexOf(search_param)

        if(index > -1){
            if(index === 0){
                params_str = spliceSplit(params_str, index, search_param.length + 1)
            }
            else{
                params_str = spliceSplit(params_str, index - 1, search_param.length + 1)
            }
        }

        params_str = params_str.replaceAll(' ', '+')
        url_list[1] = params_str
        new_url = url_list.join('?')
    }
    return new_url
}

$(document).ready(function() {
    let redirected_url = new URL(window.location.href)
    let brand_params = redirected_url.searchParams.getAll("brand");
    let category_params = redirected_url.searchParams.getAll("category");

    for (let i=0; i<brand_params.length; i++){
        let id = `[id='${brand_params[i]}']`
        $(id).prop('checked',true)
    }

    for (let i=0; i<category_params.length; i++){
        let id = `[id='${category_params[i]}']`
        $(id).prop('checked',true)
    }

    $(document).on('click', '[type=checkbox]', function() {
        let url = new URL(window.location.href)
        let label = null;

        if(this.classList.contains('js-brand-item'))
            label = 'brand'
        else if(this.classList.contains('js-category-item'))
            label = 'category'

        if(label) {
            if ($(this).is(":checked")) {
                url.searchParams.append(label, this.id)
            } else {
                url.href = removeParam(label, this.id, url.href)
            }
            url.href = removeParam('page', url.searchParams.get('page'), url.href)
            redirect(url.href)
        }
    });

});

