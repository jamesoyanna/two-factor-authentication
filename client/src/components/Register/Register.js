import React, { useState } from "react";

const Register = () => {
  const [data, setData] = useState({ name: "", username: "", password: "" });
  const [qrLoaded, setQrLoaded] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const error = (err) => {
    const elem = document.querySelector(".form-error-container");
    if (elem) {
      if (global.error_timout) {
        clearTimeout(global.error_timout);
      }
      elem.innerHTML = `<span class="form-error">${err}</span>`;
    }

    global.error_timout = setTimeout(() => (elem.innerHTML = ``), 10000);
  };
  const clear_error = (err) => {
    const elem = document.querySelector(".form-error-container");
    if (elem) {
      if (global.error_timout) {
        clearTimeout(global.error_timout);
      }
      elem.innerHTML = ``;
    }
  };

  const handleSubmit = async () => {
    const { name, username, password } = data;
    if (!name.trim() || !username.trim() || !password.trim()) {
      return error("Fill Proper Credentials");
    }

    if (password.trim().length < 5) {
      return error("Password must be more than 5  in length");
    }

    clear_error();
  };

  const fetchQR = async (url) => {
    const res = await fetch(url);
    const rawData = await res.arrayBuffer();

    function convertToBase64(input) {
      const uInt8Array = new Uint8Array(input);
      const count = uInt8Array.length;

      // Allocate the necessary space up front.
      const charCodeArray = new Array(count);

      // Convert every entry in the array to a character.
      for (let i = count; i >= 0; i--) {
        charCodeArray[i] = String.fromCharCode(uInt8Array[i]);
      }

      // Convert the characters to base64.
      const base64 = btoa(charCodeArray.join(""));
      return base64.toString();
    }

    console.log(convertToBase64(rawData));
    setQrLoaded(`data:image/png;base64,${convertToBase64(rawData)}`);
  };

  fetchQR("https://chart.googleapis.com/chart?chs=240x240&chld=L|0&cht=qr&chl=otpauth://totp/TwoFactorAuthenticator%3Ad%3Fsecret=NHYM2O3AXRAMPLRJ3STP6D5XAIPW5UOI%26issuer=TwoFactorAuthenticator");
  if (twoFactorMode) {
    // fetchQR()
  }

  const handle2faInput = (event) => {
    const getFirstNonEmptyValue = (arr) => {
      return arr.filter((e) => !!e?.trim())[0];
    };
    const pressedKey = getFirstNonEmptyValue(event.target.value.split(twoFactorCode));
    if (!pressedKey ? true : !isNaN(parseInt(pressedKey))) {
      setTwoFactorCode(event.target.value.trim());
    }
  };

  return (
    <>
      <div className="form-container">
        <div className="form">
          <h1 className="form-title">2FA Registration</h1>
          <div className="form-qr">
            {qrLoaded ? <img src={qrLoaded} alt="Authenticator QR" /> : <h1>Loading...</h1>}
            {/* <img src={"https://chart.googleapis.com/chart?chs=240x240&chld=L|0&cht=qr&chl=otpauth://totp/TwoFactorAuthenticator%3Ad%3Fsecret=NHYM2O3AXRAMPLRJ3STP6D5XAIPW5UOI%26issuer=TwoFactorAuthenticator"} alt="Authentication QR " /> */}
          </div>
          <div className="instructions">
            <h3>Instructions: </h3>
            <p>
              1. Scan the QR Code with any Authenticator App <br />
              &nbsp;&nbsp;&nbsp;(for eg. Google Authenticator, Microsoft Authenticator).
            </p>
            <p>2. Enter the Code here To Finish Registration.</p>
            <p>Note: The Code is Refreshed Every Minute.</p>
          </div>
          <div className="input-group">
            <span className="placeholder">Two Factor Code</span>
            <input type="text" className="form-input twofactor" placeholder="2FA Code" inputMode="numeric" value={twoFactorCode} onChange={handle2faInput} maxLength={6} autoCapitalize={false} autoComplete={false} spellCheck={false} />
          </div>
          <div className="form-error-container"></div>
          <button className="form-submit" onClick={handleSubmit}>
            Register
          </button>
          {/* <div className="input-group">
            <span className="placeholder">Full Name</span>
            <input type="text" className="form-input" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>
          <div className="input-group">
            <span className="placeholder">Username</span>
            <input type="text" className="form-input" value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
          </div>
          <div className="input-group">
            <span className="placeholder">Password</span>
            <input type="password" className="form-input" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
          </div>
          <div className="form-error-container"></div>
          <button className="form-submit" onClick={handleSubmit}>
            Register
          </button> */}
        </div>
      </div>
    </>
  );
};

export default Register;