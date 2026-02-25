import { useState } from "react"
import "../components/admin/AdminSign.css"
import "../assets/logo.avif"
import axios from "axios"
import { useNavigate } from "react-router-dom";
axios.defaults.withCredentials = true;

const AdminSign = () => {
  const [container, setContainer] = useState("admin-container")
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerError, setRegisterError] = useState("Error Message")
  const [errorRegister, setErrorRegister] = useState("error none text-2xl")

  const [loginError, setLoginError] = useState("Error Message")
  const [errorLogin, setErrorLogin] = useState("error none text-2xl")

  const [successModalBackground, setSuccessModalBackground] = useState("modal-background dont-show")
  const [successModalCenter, setSuccessModalCenter] = useState("modal-center dont-show")
  const [successMessage, setSuccessMessage] = useState("")

  const [successLoginBackground, setModalLoginBackground] = useState("modal-background dont-show")
  const [successLoginCenter, setModalLoginModalCenter] = useState("modal-center dont-show")
  const [successLoginMessage, setLoginMessage] = useState("")

  const Register = async () => {
    await axios.post("http://localhost:8920/api/auth/admin/register", {
      name: formName,
      email: formEmail,
      password: formPassword
    })
      .then(function (response: any) {
        setErrorRegister("error none text-2xl")
        setSuccessMessage(response.data.message)
        setSuccessModalBackground("modal-background")
        setSuccessModalCenter("modal-center")
      })
      .catch(function (error: any) {
        if (error.response) {
          setRegisterError(error.response.data.message)
          setErrorRegister("error text-2xl")
        }
      })
  }

  const Login = async () => {
    await axios.post("http://localhost:8920/api/auth/admin/login", {
      email: loginEmail,
      password: loginPassword
    })
      .then(function (response: any) {
        setErrorLogin("error none text-2xl")
        setLoginMessage(response.data.message)
        setModalLoginBackground("modal-background")
        setModalLoginModalCenter("modal-center")
        // Auto-redirect to admin dashboard after successful login
        setTimeout(() => {
          navigate("/admin-dashboard")
        }, 1500)
      })
      .catch(function (error: any) {
        if (error.response) {
          setLoginError(error.response.data.message)
          setErrorLogin("error text-2xl")
        }
      })
  }

  const preventSubmitDefault = (event: React.FormEvent) => event.preventDefault()

  const newName = (event: React.ChangeEvent<HTMLInputElement>) => setFormName(event.target.value)
  const newEmail = (event: React.ChangeEvent<HTMLInputElement>) => setFormEmail(event.target.value)
  const newPassword = (event: React.ChangeEvent<HTMLInputElement>) => setFormPassword(event.target.value)

  const newLoginEmail = (event: React.ChangeEvent<HTMLInputElement>) => setLoginEmail(event.target.value)
  const newLoginPassword = (event: React.ChangeEvent<HTMLInputElement>) => setLoginPassword(event.target.value)

  const navigate = useNavigate()

  return (
    <div className="admin-center-container">
      <div className={container} id={container}>
        <div className="admin-form-container admin-sign-up">
            <form onSubmit={preventSubmitDefault}>
                <h1 className="text-3xl font-bold">Create Account</h1>
                <span className="admin-span">or use your email for registeration</span>
                <input type="text" placeholder="Name" value={formName} onChange={newName} />
                <input type="email" placeholder="Email" value={formEmail} onChange={newEmail} />
                <input type="password" placeholder="Password" value={formPassword} onChange={newPassword} />
                <p className={errorRegister}>{registerError}</p>
                <button onClick={Register}>Sign Up</button>
            </form>
        </div>
        <div className="admin-form-container admin-sign-in">
            <form onSubmit={preventSubmitDefault}>
                <h1 className="text-4xl font-bold">Sign In</h1>
                <span className="admin-span">Please enter your credentials.</span>
                <input type="email" placeholder="Email" value={loginEmail} onChange={newLoginEmail} />
                <input type="password" placeholder="Password" value={loginPassword} onChange={newLoginPassword} />
                <p className={errorLogin}>{loginError}</p>
                <a href="#">Forget Your Password?</a>
                <button onClick={Login}>Sign In</button>
            </form>
        </div>
        <div className="admin-toggle-container">
            <div className="admin-toggle">
                <div className="admin-toggle-panel admin-toggle-left">
                    <h1 className="text-3xl font-bold">Welcome Back!</h1>
                    <div className="size-20 bg-primary rounded-full flex items-center justify-center p-1 overflow-hidden div-margin">
                      <img src="/src/assets/logo.avif" alt="LocalWorks" className="rounded-full" />
                    </div>
                    <p>Already have an existing account? Please click this to sign in.</p>
                    <button onClick={() => setContainer("admin-container")} className="admin-hidden" id="login">Sign In</button>
                </div>
                <div className="admin-toggle-panel admin-toggle-right">
                    <h1 className="text-4xl font-bold">Hello, Admin!</h1>
                    <div className="size-20 bg-primary rounded-full flex items-center justify-center p-1 overflow-hidden div-margin">
                      <img src="/src/assets/logo.avif" alt="LocalWorks" className="rounded-full" />
                    </div>
                    <p>Welcome to LocalWorks!</p>
                    <button onClick={() => setContainer("admin-container active")} className="admin-hidden" id="register">Sign Up</button>
                </div>
            </div>
        </div>
    </div>

    <div className={successModalBackground}></div>
    <div className={successLoginBackground}></div>

    <div className={successModalCenter}>
      <div className="modal-container">
        <h1 className="text-4xl font-bold">{successMessage}</h1>
        <button onClick={() => {// Source - https://stackoverflow.com/a/3715123
// Posted by gianebao, modified by community. See post 'Timeline' for change history
// Retrieved 2026-02-22, License - CC BY-SA 4.0

window.location.reload()
}}>Ok</button>
      </div>
    </div>

    <div className={successLoginCenter}>
      <div className="modal-container">
        <h1 className="text-4xl font-bold">{successLoginMessage}</h1>
        <button onClick={() => {
          navigate("/admin-dashboard")
        }}>Ok</button>
      </div>
    </div>
    </div>
  )
}

export default AdminSign