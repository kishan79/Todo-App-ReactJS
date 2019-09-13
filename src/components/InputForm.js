import React from "react";

const InputForm = (props) => {
  // console.log(props);
  // console.log(props.currdate);
  return (
    <div>
      <input type="text" id="todoinp" placeholder="Todo" onChange={e =>{props.inputText(e);props.hideclass(e)}} required />
      <input
        type="date"
        id="dateinp"
        min={props.currdate}
        onChange={props.inputDate}
        value = {props.currdate}
        required
      />
      <button onClick={e=>{props.addTodoInList(e);props.showclass(e)}}>Add</button>
    </div>
  );
};

export default InputForm;
