export function validateUserName(username){
    if(!username.trim()){
        return "Имя обязательно";
    }
    else if (username.length > 50) {
        return "Имя пользователя должно содержать не более 50 символов";
    }
    return null;
}

export function validateEmail(email){
    if(email.trim()){
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!re.test(email)){
            return "Неверный формат email";
        }
    }
    return null;
}

export function validatePassword(password){
    if(!password.trim()){
        return "Пароль обязателен";
    }
    else if(password.length <8){
        return "Пароль должен содержать не менее 8 символов"
    }
    else if (password.length > 50) {
        return "Пароль должен содержать не более 50 символов";
    }
    return null;
}

export function validateTitle(title){
    if (!title.trim()) {
      return "Заголовок обязателен";
    }
    else if(title.length > 50){
        return "Заголовок должен содержать не более 50 символов";
    }
    return null;
  };