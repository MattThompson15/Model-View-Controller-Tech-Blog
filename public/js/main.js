document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.querySelector('#login-form');
    const registerForm = document.querySelector('#register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;

            if (!username || !password) {
                e.preventDefault();
                alert('Please enter username and password');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submut', function(e) {
            const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;
            const confirmPassword = document.querySelector('#confirmPassword').value;

            if (!username || !password || !confirmPassword) {
                e.preventDefault();
                alert('Please enter username and password');
            } else if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match');
            }

        });
    }

});
    