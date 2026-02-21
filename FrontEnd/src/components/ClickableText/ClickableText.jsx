const ClickableText = ({ className, onClick, children }) => {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      style={{ border: "none", background: "transparent", padding: 0, textAlign: "left" }}
    >
      {children}
    </button>
  );
};

export default ClickableText;
