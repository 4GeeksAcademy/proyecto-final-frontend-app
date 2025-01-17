import PropTypes from 'prop-types';
import '../../styles/navbar.css'

function Navbar({ onRegisterClick }) {
  return (
    <nav className="navbar">
      <div>
        <a className="navbar-brand ms-1" href="#"><img src="/logo-horizontal.png" alt="Logo" className="navbar-image"/></a>
        
      </div>
      <button className="start-button btn btn-success me-1" onClick={onRegisterClick}>Empiece gratis</button>
    </nav>
  );
}

Navbar.propTypes = {
  onRegisterClick: PropTypes.func.isRequired,
};

export default Navbar;
