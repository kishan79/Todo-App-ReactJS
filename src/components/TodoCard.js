import React from "react";
import PropTypes from "prop-types";
import "../styles/todocards.css";

const TodoCard = props => {
  const { modClass, data, colorClass, drop, shake, shakeclass } = props;
  // const backcolor = {"backgroundColor":"indianred"};
  return (
    // eslint-disable-next-line no-sequences
    <div className={modClass,shakeclass?shake:undefined}>
      <div className={colorClass} >
        <div className="row">
          <div className="col-11">
            <div className="details">
              <p>{data}</p>
              <span className="badge badge-secondary">{props.time}</span>
            </div>
          </div>
          <div className="col-1">
            {drop ? (
              <span
                className="delete-btn fa fa-times"
                onClick={() => {
                  props.deleteTodo();
                }}
              />
              ):undefined}  
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoCard;

PropTypes.TodoCard = {
  modClass: PropTypes.string,
  data: PropTypes.array.isRequired,
  drop: PropTypes.bool,
  deleteTodo: PropTypes.func.isRequired
};
