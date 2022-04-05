import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import './LoginForm.css';

export default function LoginForm({ setUser }) {
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    try {
        const session = await api.account.createAnonymousSession();
        setUser(session);
        if (e.target.name.value) {
          await api.account.updateName(e.target.name.value);
        }
      } catch(e) {
        
      } finally {
        navigate('/vote');
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={login}>
        <p className="login-name">
          <label htmlFor="name">Name (optional)</label>

          <input type="text" id="name" name="name" placeholder="Enter Name" />
        </p>

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
