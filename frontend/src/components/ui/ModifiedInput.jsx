import '../../CSS/ui/ModifiedInput.css';


const ModifiedInput = (props) => {
  const { span_text, type, name, value, onChange, className, placeholder, autoFocus } = props;
  
  return (
    <div className="input_container">
      <span>{span_text}</span>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
        autoFocus={autoFocus} required />
    </div>
  )
}

export default ModifiedInput