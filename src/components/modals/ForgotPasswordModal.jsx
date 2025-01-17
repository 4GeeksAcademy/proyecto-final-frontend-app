import { useState } from 'react';
import PropTypes from 'prop-types';
import { requestPasswordReset } from '../../services/authService';

function ForgotPasswordModal({ show, onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setMessage('');
    setError('');
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message);
    } catch (err) {
      setError('Error al enviar el correo. Verifica el email ingresado.');
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block bg-dark bg-opacity-50">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Recuperar Contraseña</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {message && <p className="text-success">{message}</p>}
            {error && <p className="text-danger">{error}</p>}
            <input
              type='email'
              placeholder="Ingresa tu correo"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleSubmit}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

ForgotPasswordModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPasswordModal;

