import React, { Component } from "react";
import {Container, Draggable} from "react-smooth-dnd";
import TodoCard from './TodoCard';
import PropTypes from "prop-types";

class TodoBoard extends Component {
  render() {
    const { heading, list, listData, color, groupname, drop } = this.props;
    // console.log(drop);
    return (
      <div className="cardOuter">
        <div className="container">
        <div className="heading">{heading}</div>
        
          <Container
          groupName={groupname}
          getChildPayload={i => listData[i]}
          onDrop={e => drop?this.props.onDrop(e, list):undefined}
        >
          {listData.map((p, i) => {
            return (
              <Draggable key={`${list}-${i}`}>
                <TodoCard
                  modClass="draggable-item"
                  data={p.data}
                  time={p.timetodo}
                  colorClass = {color}
                  deleteTodo={() => this.props.removeTodo(p.id, list)}
                  drop ={this.props.drop}
                />
              </Draggable>
            );
          })}
        </Container>
      </div>
      </div>
    );
  }
}

export default TodoBoard;

PropTypes.TodoBoard = {
  heading: PropTypes.string,
  list: PropTypes.string.isRequired,
  listData: PropTypes.array.isRequired,
  color: PropTypes.string,
  groupname: PropTypes.string,
  removeTodo: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired
};
