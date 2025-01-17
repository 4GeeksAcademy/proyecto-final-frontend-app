import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/userService';
import UserContext from '../../context/UserContext';
import ForgotPasswordModal from './ForgotPasswordModal';

function LoginModal({ show, onClose, onRegisterClick }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const { addUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    try {
      const response = await loginUser(formData.email, formData.password);

      if (response?.access_token && response?.user) {
        const { access_token, user } = response;

        // Almacena token y datos del usuario
        localStorage.setItem('token', access_token);
        localStorage.setItem('userData', JSON.stringify(user));

        // Actualiza el estado global
        addUser({ ...user, token: access_token });
        onClose();
        navigate('/profile');
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (error) {
      setError('Correo o contraseña incorrectos');
    }
  };

  if (!show) return null;

  return (

    <div className="modal d-block bg-dark bg-opacity-50" >
      <div className="modal-dialog" style={{ borderRadius: '15px' }}>
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#F4A261' }}>
            <h5 className="modal-title text-success">Iniciar Sesión</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body" style={{ backgroundImage: 'url("/Designer.jpg")' }}>
            {error && <p className="text-danger">{error}</p>}
            <input
              type="email"
              name="email"
              placeholder="Correo"
              className="form-control mb-2"
              value={formData.email}
              onChange={handleChange}
            />
            <div className="input-group mb-2">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                className="btn btn-outline-success"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <p>
              ¿No tienes una cuenta?{' '}
              <a href="#" onClick={onRegisterClick}>
                Regístrate aquí
              </a>
            </p>
            <p>¿Olvidaste tu contraseña? <a href="#" onClick={() => setShowForgotPassword(true)}>Recupérala aquí</a></p>
          </div>
          <div className="modal-footer" style={{ backgroundColor: '#F4A261' }}>
            <button className="btn btn-success" onClick={handleSubmit}>
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
      <ForgotPasswordModal show={showForgotPassword} onClose={() => setShowForgotPassword(false)} />
    </div>

  );
}

LoginModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRegisterClick: PropTypes.func.isRequired,
};

export default LoginModal;