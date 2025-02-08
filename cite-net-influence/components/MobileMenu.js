import "../styles/Navbar.css";

const MobileMenu = () => {
  return (
    <ul className="mobile-menu">
      {["Home", "Services", "About", "Contact"].map((item) => (
        <li key={item}>
          <a href={`#${item.toLowerCase()}`}>{item}</a>
        </li>
      ))}
    </ul>
  );
};

export default MobileMenu;
