import '../../CSS/ui/modifiedP.css';

const ModifiedP = (props) => {

    const {span_text, text, onclick, children} = props
    return (
        <div className="p_container" onClick={onclick}>
            <p><span>{span_text}</span>{text}</p>

            {children}
        </div>
    )
}

export default ModifiedP;