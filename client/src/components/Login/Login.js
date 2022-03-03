import React, { useState } from "react";

const Login = () => {
  const [data, setData] = useState({ username: "", password: "" });
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

  const finishLogin = () => {};

  const handleSubmit = () => {
    const { username, password } = data;
    if (!username.trim() || !password.trim()) {
      return error("Fill Proper Credentials");
    }

    clear_error();
  };

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
          <h1 className="form-title">2FA Login</h1>
          <div className="input-group">
            <span className="placeholder">Two Factor Code</span>
            <input type="text" className="form-input twofactor" value={twoFactorCode} onChange={handle2faInput} placeholder="2FA Code" inputMode="numeric" pattern="\d*" maxLength={6} autoCapitalize="false" autoComplete="false" spellCheck="false" />
          </div>
          <div className="form-error-container"></div>
          <button className={twoFactorCode.trim().length < 6 ? "form-submit disabled" : "form-submit"} disabled={twoFactorCode.trim().length < 6 ? !0 : !1} onClick={finishLogin}>
            Login
          </button>
          {/* <div className="input-group">
            <span className="placeholder">Username</span>
            <input type="text" className="form-input" value={data.username} onChange={(e) => setData({ ...data, username: e.target.value })} />
          </div>
          <div className="input-group">
            <span className="placeholder">Password</span>
            <input type="password" className="form-input" value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })} />
          </div>
          <div className="form-error-container"></div>
          <button className="form-submit" onClick={handleSubmit}>
            Login
          </button> */}
        </div>
      </div>
    </>
  );
};

export default Login;