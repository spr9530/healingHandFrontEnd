const userName = document.getElementById('name')
        const password = document.getElementById('password')
        const authError = document.getElementById('authError')
        const cookies = document.cookie;
        const logUser = async () => {
            authError.style.display = "none"
            try {
                const response = await fetch(`https://healing-hand-backend-5l5y.vercel.app/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        userName: userName.value,
                        password: password.value,
                    })
                })
                const token = await response.json()
                if(!response.ok){
                    throw new Error('Failed to login');

                }
                document.cookie = `jwt_token=${token}; Path=/; SameSite=Strict`;
                window.location.replace('http://127.0.0.1:5500/dashboard.html');

            } catch (error) {
                authError.style.display = "block"
            }
        }