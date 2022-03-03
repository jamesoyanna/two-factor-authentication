import React, {useState} from 'react';

const Register = () => {
    const [data, setData] = useState({name: "", username: "", password:""});
    const [qrLoaded, setQrLoaded] = useState(false);
    const [twoFactorMode, setTwoFactorMode] = useState(null);
    const [twoFactorCode, setTwoFactorCode] = useState("");

    const error = (err) => {
        const elem = document.querySelector(".form-error-container");
        if(elem){
            if(global.error_timeout) {
                clearTimeout(global.error_timeout)
            }
            elem.innerHTML = `<span class="form-error"${err}</span>`;
        }
        global.error_timeout = setTimeout(() => (elem.innerHTML = ``), 10000)
    };

    const clear_error = (err) => {
        const elem  = document.querySelector(".form-error-container");
        if(elem){
            if(global.error_timeout){
                clearTimeout(global.error_timeout);
            }
        }
    }
    
    const handleSubmit = () => {
        const {name, username, password} = data;
        if(!name.trim()  || !username.trim() || !password.trim()) {
        return error("Fill Proper Credentials");
        };

        if(password.trim().length < 5) {
            return error("Password must be more than 5 in length");
        }
        clear_error();
    };

    const fetchQR = async(url) => {
        const res = await fetch(url);
        const rawData = await res.arrayBuffer();

        function convertToBase64(input) {
            const uInt8Array = new Uint8Array(input);
            const count = uInt8Array.length;

            const charCodeArray = new Array(count);

            for (let i = count; i >= 0; i--) {
             charCodeArray[i] = String.fromCharCode(uInt8Array[i]);
            }

            const base64 = btoa(charCodeArray.join(""));
            return base64.toString();
        }

        console.log(convertToBase64(rawData));
        setQrLoaded(`data:image/png;base64,${convertToBase64(rawData)}`);
    };

    fetchQR("https://chart.googleapis.com/chart?chs=240x240&chld=L|0&cht=qr&chl=otpauth://totp/TwoFactorAuthenticator%3Ad%3Fsecret=NHYM2O3AXRAMPLRJ3STP6D5XAIPW5UOI%26issuer=TwoFactorAuthenticator");
    if(twoFactorMode){
        //
    }
 const handle2faInput = (e) => {
     const getFirstNonEmptyValue = (arr) => {
         return arr.filter((e) => !!e?.trim())[0];
     };

     const pressedKey = getFirstNonEmptyValue(e.target.value.split(twoFactorCode));
     if(!pressedKey ? true : !isNaN(parseInt(pressedKey))) {
         setTwoFactorCode(e.target.value.trim())
     }
 }
      
    return (
        <div className='form-container'>
            <div className='form'>
                <h1 className='form-title'>2FA Registration</h1>
                <div className='form-qr'>
                    {qrLoaded ? <img src={qrLoaded} alt="Authenticator QR" /> : <h1>Loading...</h1>}
                </div>
            </div>
            Register
        </div>
    );
}

export default Register;
