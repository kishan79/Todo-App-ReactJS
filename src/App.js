import React, { Component, Fragment } from "react";
import TodoBoard from "./components/TodoBoard";
import { Container, Draggable } from "react-smooth-dnd";
import { applyDrag } from "./utils/utils";
import TodoCard from "./components/TodoCard";
import InputForm from "./components/InputForm";
import "./styles/main.css";

class App extends Component {
  state = {
    textInput: "",
    dateInput: "",
    all: JSON.parse(localStorage.getItem("all")) || [],
    doing: JSON.parse(localStorage.getItem("doing")) || [],
    done: JSON.parse(localStorage.getItem("done")) || [],
    abon: JSON.parse(localStorage.getItem("abon")) || [],
    expired: JSON.parse(localStorage.getItem("expired")) || [],
    noRes: false,
    showForm: false,
    duplicate: false,
    date: "",
    founditem: {},
    shake: "",
    shakeclass: true
  };

  componentDidMount() {
    this.movetoexpired();
    // let todaydate = document.getElementById("dateinp");
    // let today = new Date();
    // todaydate.value = today.toISOString().substr(0, 10);
  }

  addTodoInList = e => {
    let val = this.state.textInput;
    let dateval = this.state.dateInput;
    let dateformat = dateval.split("-");
    dateformat = dateformat.reverse();
    dateformat = dateformat.join("-");
    document.getElementById("todoinp").value = "";
    document.getElementById("dateinp").value = "";

    if (Boolean(val && dateformat)) {
      const current_all = JSON.parse(localStorage.getItem("all"));
      const found_item = current_all.filter(x => {
        return x.data === val && x.timetodo === dateformat;
      });
      if (found_item.length <= 0) {
        if (localStorage.getItem("all") === null) {
          let usertodo = [];
          let id = Math.random()
            .toString(36)
            .substring(7);
          const userData = {
            id: `todo-${id}`,
            data: val,
            timetodo: dateformat
          };
          usertodo.push(userData);
          this.setState({ all: usertodo, duplicate: true }, () => {
            localStorage.setItem("all", JSON.stringify(usertodo));
          });
        } else {
          let id = Math.random()
            .toString(36)
            .substring(7);
          const mod = { id: `todo-${id}`, data: val, timetodo: dateformat };
          let tododata = JSON.parse(localStorage.getItem("all"));
          tododata.push(mod);

          this.setState({ all: tododata, duplicate: false }, () => {
            localStorage.setItem("all", JSON.stringify(tododata));
          });
        }
      } else {
        // let shake = (JSON.stringify(this.state.founditem[0])===JSON.stringify(p))?"ahashake":undefined;
        this.setState({ duplicate: true, founditem: found_item});
      }
    }
  };

  findTodoInList = e => {
    let inp = e.target.value.toLowerCase().replace(/\s/g, "");
    if (Boolean(inp)) {
      const current_all = JSON.parse(localStorage.getItem("all"));
      const found_items = current_all.filter(x => {
        return x.data === inp;
      });
      console.log(found_items);
      if (found_items.length > 0) {
        this.setState({ all: found_items, noRes: false });
      } else {
        this.setState({ noRes: true, all: [] });
      }
    } else {
      this.setState({
        all: JSON.parse(localStorage.getItem("all")),
        noRes: false
      });
    }
  };

  removeTodoFromBoard = (id, list) => {
    const delete_from = [...JSON.parse(localStorage.getItem(list))];
    const index_to_dlt = delete_from.findIndex(el => el.id === id);
    delete_from.splice(index_to_dlt, 1);
    localStorage.setItem(list, JSON.stringify(delete_from));
    this.setState({ [list]: delete_from });
  };



  currdate = () => {
    let dateObj = new Date();
    let month =
      (dateObj.getMonth() + 1 < 10 ? "0" : "") + (dateObj.getMonth() + 1);
    let day = (dateObj.getDate() < 10 ? "0" : "") + dateObj.getDate();
    let year = dateObj.getFullYear();
    let newdate = year + "-" + month + "-" + day;
    this.setState({ date: newdate });
    return newdate;
  };


  movetoexpired = () => {
    // let set = new Set();
    let datenow = this.currdate();
    if (localStorage.getItem("all") != null) {
      try {
        let current_all = JSON.parse(localStorage.getItem("all"));
        let current_doing = JSON.parse(localStorage.getItem("doing"));
        let current_done = JSON.parse(localStorage.getItem("done"));
        let current_abon = JSON.parse(localStorage.getItem("abon"));
        let expired_items_all = JSON.parse(localStorage.getItem("expired"));

        let expired_item = current_all.filter(x => {
          return new Date(x.timetodo) < new Date(datenow) ? x : null;
        });

        let expired_doing = current_doing.filter(x => {
          return new Date(x.timetodo) < new Date(datenow) ? x : null;
        });

        let expired_done = current_done.filter(x => {
          return new Date(x.timetodo) < new Date(datenow) ? x : null;
        });

        let expired_abon = current_abon.filter(x => {
          return new Date(x.timetodo) < new Date(datenow) ? x : null;
        });

        let expired_items = [
          ...(expired_items_all || []),
          ...(expired_item || []),
          ...(expired_doing || []),
          ...(expired_done || []),
          ...(expired_abon || [])
        ];

        let items = new Set();
        const filtereditems = expired_items.filter(el => {
          const duplicate = items.has(el.id);
          items.add(el.id);
          return !duplicate;
        });

        // current_all = current_all.filter(el => {
        //   return !expired_item.includes(el);
        // });

        // current_doing = current_doing.filter(el =>{
        //   return !expired_doing.includes(el);
        // })
        // current_doing = current_done.filter(el =>{
        //   return !expired_done.includes(el);
        // })
        // current_doing = current_abon.filter(el =>{
        //   return !expired_abon.includes(el);
        // })
        // current_doing = current_doing===null? [] : current_doing.filter(el =>{
        //     return !expired_item.includes(el);
        // })
        current_all =
          current_all === null
            ? []
            : current_all.filter(el => !expired_item.find(d => el.id === d.id));

        current_doing =
          current_doing === null
            ? []
            : current_doing.filter(
                el => !expired_doing.find(d => el.id === d.id)
              );
        current_done =
          current_done === null
            ? []
            : current_done.filter(
                el => !expired_done.find(d => el.id === d.id)
              );
        current_abon =
          current_abon === null
            ? []
            : current_abon.filter(
                el => !expired_abon.find(d => el.id === d.id)
              );

        this.setState(
          {
            expired: filtereditems,
            doing: current_doing,
            done: current_done,
            abon: current_abon,
            all: current_all
          },
          () => {
            localStorage.setItem("expired", JSON.stringify(filtereditems));
            localStorage.setItem("doing", JSON.stringify(current_doing));
            localStorage.setItem("done", JSON.stringify(current_done));
            localStorage.setItem("abon", JSON.stringify(current_abon));
            localStorage.setItem("all", JSON.stringify(current_all));
          }
        );
      } catch (e) {
        console.log(e);
      }
    }
  };

  inputText = event => {
    this.setState({ textInput: event.target.value || " " });
  };

  inputDate = event => {
    this.setState({ dateInput: event.target.value || " " });
  };

  toggleForm = () => {
    this.setState({ showForm: !this.state.showForm, duplicate: false });
  };

  hideclass = () =>{
    this.setState({ shakeclass : false});
  };

  showclass = () =>{
    this.setState({ shakeclass : true});
  };
 

  render() {
    return (
      <Fragment>
        <div className="cardOuter">
          <div className="container">
            <div className="heading">All Todos</div>

            <div id="search-box">
              <span className="fa fa-search form-control-feedback" />
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                id="search"
                onChange={this.findTodoInList}
              />
            </div>
            <div className="vertical1">
              {this.state.noRes ? (
                <Fragment>
                  <br />
                  <div className="alert alert-danger">
                    <strong>Opps!</strong> No Result Found for
                  </div>
                </Fragment>
              ) : (
                <Container
                  groupName="todo_board"
                  behaviour="move"
                  getChildPayload={i => this.state.all[i]}
                  onDrop={e =>
                    this.setState({ all: applyDrag(this.state.all, e) })
                  }
                >
                  {this.state.all.map((p, i) => {
                    return (
                      <Draggable key={p.id}>
                        <TodoCard
                          colorClass="card"
                          modClass="draggable-item"
                          data={p.data}
                          // isSource={true}
                          // drop = {false}
                          shake={JSON.stringify(this.state.founditem[0])===JSON.stringify(p)?"ahashake":undefined}
                          shakeclass={this.state.shakeclass}
                        />
                      </Draggable>
                    );
                  })}
                </Container>
              )}
            </div>
            <div className="container1">
              <div className="bg"></div>
              <div className="button1" onClick={this.toggleForm}>
                <i
                  className={
                    this.state.showForm === true
                      ? "fa fa-chevron-down icon"
                      : "fa fa-chevron-up icon"
                  }
                  aria-hidden="true"
                ></i>
              </div>
            </div>
            {this.state.duplicate ? <h5>Todo already exists</h5> : ""}
            {this.state.showForm === false ? (
              <InputForm
                inputText={this.inputText}
                inputDate={this.inputDate}
                currdate={this.state.date}
                addTodoInList={this.addTodoInList}
                duplicate={this.state.duplicate}
                hideclass={this.hideclass}
                showclass={this.showclass}
              />
            ) : null}
          </div>
        </div>

        <TodoBoard
          heading="Doing"
          list="doing"
          listData={this.state.doing}
          color="card-doing"
          groupname="todo_board"
          drop={true}
          onDrop={(e, list) =>
            this.setState({ [list]: applyDrag(this.state[list], e, list) })
          }
          removeTodo={(id, list) => this.removeTodoFromBoard(id, list)}
        ></TodoBoard>
        <TodoBoard
          heading="Done"
          list="done"
          color="card-done"
          groupname="todo_board"
          listData={this.state.done}
          drop={true}
          onDrop={(e, list) =>
            this.setState({ [list]: applyDrag(this.state[list], e, list) })
          }
          removeTodo={(id, list) => this.removeTodoFromBoard(id, list)}
        ></TodoBoard>
        <TodoBoard
          heading="Abandoned"
          list="abon"
          color="card-abon"
          groupname="todo_board"
          listData={this.state.abon}
          drop={true}
          onDrop={(e, list) =>
            this.setState({ [list]: applyDrag(this.state[list], e, list) })
          }
          removeTodo={(id, list) => this.removeTodoFromBoard(id, list)}
        ></TodoBoard>
        <TodoBoard
          heading="Expired"
          list="expired"
          color="card-expired"
          groupname="expired_board"
          listData={this.state.expired}
          drop = {false}
        ></TodoBoard>
      </Fragment>
    );
  }
}

export default App;
