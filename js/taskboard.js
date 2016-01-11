
"use strict";

/*****************************************
/****        View Components       *******
******************************************/



function dayOfWeekAsInteger(day) {
  return ["Sun","Mon","Tues","Wed","Thu","Fri","Sat"][day];
}

var RadioButton = React.createClass({
  render: function() {
    return React.DOM.ul({className: 'radio'}, 
      this.props.values.map((value) => React.DOM.li(
        {
          key: value, 
          className: 'radioItem' + (this.props.selected == value ? ' selected' : ''),
          onClick: (ev) => this.props.onSelectionChanged(value)
          }, 
        value)));
    }
  });

var SprintNav = React.createClass({
  render: function() {

      return React.DOM.div({className: 'sprintSelector'}, 
        React.DOM.ul({}, 
          [...this.props.projects.entries()].map((entry) => 
          React.DOM.li({key:entry[0], title: 'Open current sprint'}, 
            React.DOM.label({}, entry[0]),
            React.DOM.ul({}, [...Array.from(entry[1], 
              (name) => React.DOM.li({
                  title: 'Open sprint', 
                  key: name,
                  onClick: (ev) => this.props.onSelectionChanged(entry[0], name)
                }, name))])
            )
          )
        )
        )
      }
    });


var DevTaskTile =  React.createClass({

  drag: function(ev) {
    ev.dataTransfer.setData("taskID", this.props.task.id);
  },

  render: function() {
    return React.DOM.div({className: "task", draggable: true, onDragStart: this.drag}, 
      React.DOM.label({className: 'devTaskId'}, this.props.task.id),
      React.DOM.label({className: 'taskTitle'}, this.props.task.title,
        React.DOM.div({className: 'description'}, this.props.task.description)),
      React.DOM.img({src: this.props.task.assignee + ".jpg", className: 'assignee'})
      );
    }
  });

var TaskList = React.createClass({

    allowDrop: function(ev) {
      ev.preventDefault();
    },

    drop: function(ev) {
      ev.preventDefault();
      this.props.onStatusUpdated(ev.dataTransfer.getData("taskID"), this.props.status)
    },

    render: function() {

      var taskTiles = this.props.tasks.map((task) => React.createElement(DevTaskTile, {key: task.id, task: task, onDragOver: this.allowDrop}));

      return React.DOM.div({className: "taskphase", onDrop: this.drop, onDragOver: this.allowDrop}, 
                React.DOM.label({className: 'phaseTitle  tasklist-' + this.props.status}, this.props.status),
                React.createElement("div", {className: "tasklist", onDragOver: this.allowDrop, onDrop: this.drop}, taskTiles)
                );
        }
    });

var TaskBoard = React.createClass({
    render: function() {

      var divs = [];
      this.props.taskMap.forEach((tasks, status) => {
        divs.push(React.createElement(TaskList, {key: status, status: status, tasks: tasks, onStatusUpdated: (taskId, status) => this.props.onStatusUpdated(taskId, status)}))});
 
      return React.DOM.div({className: "taskboard"}, divs);
    }
});

var AgileBoard = React.createClass({
    render: function() {

      var model = this.props.model;
      var controller = this.props.controller;

      var view = model.selectedView == 'TaskBoard' ? 
        React.createElement(TaskBoard, {taskMap: model.taskMap, currentView: model.view, onStatusUpdated: (taskId, status) => this.props.controller.updateStatus(taskId, status)}) :
        React.createElement(BurnDown, {cfd: model.cfd});
 
      return React.DOM.div({},
            React.DOM.nav({className: 'mainNav'},
              React.createElement(SprintNav, {projects: model.sprints, onSelectionChanged: this.props.controller.sprintSelectionChanged}),
              React.createElement(SprintTitle, {project: model.selectedProject, sprint: model.selectedSprint}),
              React.createElement(RadioButton, {values: model.views, selected: model.selectedView, onSelectionChanged: (view) => this.props.controller.viewSelectionChanged(view)})
            ),view
          );
    }
});

var SprintTitle = React.createClass({
  render: function() {
    return React.DOM.table({className: 'title'},
      React.DOM.tbody({}, 
        React.DOM.tr({}, 
          React.DOM.td({className: 'titleName'},'Project:'), 
          React.DOM.td({className: 'titleValue'},this.props.project), 
          React.DOM.td({className: 'titleName'},'Sprint:'), 
          React.DOM.td({className: 'titleValue'},this.props.sprint) 
          )
        )
      );
  }
});

var BurndownLegend = React.createClass({
  render: function() {
    return React.DOM.div({className:'legend'},
      React.DOM.label({className:'legendTitle'}, 'Legend'),
      React.DOM.label({className:'tasklist-ToDo'}, 'ToDo'),
      React.DOM.label({className:'tasklist-InProgress'}, 'In Progress'),
      React.DOM.label({className:'tasklist-CodeReview'}, 'Code Review'),
      React.DOM.label({className:'tasklist-Pushed'}, 'Pushed'),
      React.DOM.label({className:'tasklist-Released'}, 'Released')
      );
  }

});

var BurnDown = React.createClass({
  render: function() {
    var cfd = this.props.cfd;
    return React.DOM.div({className: 'cfdContainer'},
              React.DOM.div({className: 'cfdChart'},  [...cfd.entries()].map(this.createBar)),
            React.createElement(BurndownLegend, {}))
    ;
  },

  createBar: function(entry) {
    var date = entry[0];
    var unitHeight = 20;
    var cfdValues = entry[1];
            return React.DOM.div({className: 'cfdBar', key: date.toString()},
                React.DOM.div({className: 'tasklist-ToDo', style: {height: cfdValues.todoCount*unitHeight}}, ' '),
                React.DOM.div({className: 'tasklist-InProgress', style: {height: cfdValues.inProgressCount*unitHeight}}),
                React.DOM.div({className: 'tasklist-CodeReview', style: {height: cfdValues.codeReviewCount*unitHeight}}),
                React.DOM.div({className: 'tasklist-Pushed', style: {height: cfdValues.pushedCount*unitHeight}}),
                React.DOM.div({className: 'tasklist-Released', style: {height: cfdValues.completeCount*unitHeight}}),
                React.DOM.label({className: 'cfdBarLabel'}, dayOfWeekAsInteger(date.getDay())
                  )
            );

  }
});

/*****************************************/


/*****************************************
/****            Data Model        *******
******************************************/

class SprintModel {
  constructor() {
    this.selectedView = 'TaskBoard';
    this.views = ['TaskBoard', 'Burndown'];
    this.sprints = loadSprints();
    this.selectedProject = 'Ark';
    this.selectedSprint = '2015-12-18';
    this.taskMap = loadTasks('Ark', '2015-12-18');
    this.cfd = loadCumulativeFlowDiagram('Ark', '2015-12-18');
  }
  selectSprint(project, sprint) {
    this.selectedSprint = sprint;
    this.selectedProject = project;
    this.taskMap = loadTasks(project, sprint);
    this.cfd = loadCumulativeFlowDiagram(project, sprint);
  }
}

class SprintController {
  constructor(model, viewRefresh) {
    this.model = model;
    this.viewRefresh = viewRefresh;
  }
  selectSprint(project, sprint) {
    this.model.selectSprint(project, sprint);
    this.viewRefresh();
  }
  updateStatus(taskId, newStatus) {
    updateTaskStatus(this.model.taskMap, taskId, newStatus);
    this.viewRefresh();
  }
  sprintSelectionChanged(project, sprint) {
    this.model.selectSprint(project, sprint);
    this.viewRefresh();
  }
  viewSelectionChanged(selectedView) {
    this.model.selectedView = selectedView;
    this.viewRefresh();
  }
}
var sprintModel = new SprintModel();
var sprintController = new SprintController(sprintModel, drawScreen);

/*****************************************/


/*****************************************
/****        Event Handlers        *******
******************************************/


function drawScreen() {
  var screen = React.createElement(AgileBoard, {model: sprintModel, controller: sprintController});
  ReactDOM.render(screen, document.getElementById('container'));
}

