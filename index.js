/**
 * Created by Natalia Voronina on 31.07.2017.
 */

var MyForm = {
    validate: function(){
        var getData = MyForm.getData();
        var fio = getData.fio;
        var errorFieldsArr = [];
        var isValidBool = true;
        var i = 0;
        var errorsListPrev = [];
        //check fio
        fio = fio.replace (/\r\n?|\n/g, ' ').replace (/ {2,}/g, ' ').replace (/^ /, '').replace (/ $/, '');
        if(!fio.match(/^([a-zа-я]+)(\s+)([a-zа-я]+)(\s+)([a-zа-я]+)$/i)){
            errorFieldsArr.push('fio');
        }

        //check email
        var email = getData.email;
        if(!email.match(/^[-._a-z0-9]+@ya.ru$|^[-._a-z0-9]+@yandex.ru$|^[-._a-z0-9]+@yandex.ua$|^[-._a-z0-9]+@yandex.kz$|^[-._a-z0-9]+@yandex.by$|^[-._a-z0-9]+@yandex.com$/i)){
            errorFieldsArr.push('email');
        }

        //check phone
        var phone = getData.phone;
        if(!phone.match(/^\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$/i)){
            errorFieldsArr.push('phone');
        } else {
            var numbers = phone.match(/[0-9]/g);
            var sum = 0;
            for(i = 0; i < numbers.length; i++){
                sum += parseInt(numbers[i]);
            }
            if(sum > 30) {
                errorFieldsArr.push('phone');
            }
        }

        // remove class 'error'set in previous validation
        errorsListPrev = document.getElementsByTagName('input');
        if(errorsListPrev.length > 0){
            for(i = 0; i < errorsListPrev.length; ++i){
                errorsListPrev[i].classList.remove('error');
            }
        }

        // set class 'error' if array errorFieldsArr not empty
        if(errorFieldsArr.length > 0) {
            isValidBool = false;
            for(i = 0; i < errorFieldsArr.length; i++){
                document.getElementById(errorFieldsArr[i]).className = 'error';
            }
        }
        return {
            "isValid": isValidBool,
            "errorFields": errorFieldsArr
        };

    },
    getData: function(){
        var data  = {};
        var arr = document.getElementsByTagName('input');
        for (var i = 0; i < arr.length - 1; i++) {
            data[arr[i].getAttribute('name')] = arr[i].value;
        }
        return data;
    },
    setData: function(obj){
        for(var key in obj){
            if(key === "fio" || key === "phone" || key === "email") {
                document.getElementsByName(key)[0].value = obj[key];
            }
        }
    },
    submit: function(){
        event.preventDefault();
        var validation = MyForm.validate();
        if(validation.isValid === true){
            ajax();
            document.getElementById('submitButton').disabled = true;
        }
    }
};
function ajax(){
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open("POST", document.getElementById("myForm").action, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange =function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status !== 200) {
            alert("Status:" + xhr.status);
        } else {
            try {
                var answer = JSON.parse(xhr.response);
                if(answer.status === "success"){
                    document.getElementById('resultContainer').innerHTML = 'Success';
                    document.getElementById('resultContainer').className = 'success';
                } else if(answer.status === "progress"){
                    document.getElementById('resultContainer').innerHTML = 'Progress';
                    document.getElementById('resultContainer').className = 'progress';
                    console.log('test');
                    setTimeout(ajax, answer.timeout);
                } else {
                    document.getElementById('resultContainer').innerHTML = answer.reason;
                    document.getElementById('resultContainer').className = 'error';
                }
            } catch (e) {
                alert( e.message );
            }
        }
    };
    xhr.send();
}
document.getElementById('submitButton').onclick = MyForm.submit;

