
/*****************************************
/****        View Components       *******
******************************************/



function dayOfWeekAsInteger(day) {
  return ["Sun","Mon","Tues","Wed","Thu","Fri","Sat"][day];
}

var RadioButton = React.createClass({
  showItem: function(value, selected) {
  	var className = 'radioItem' + (selected==value ? ' selected' : '');
  	return (<li key={value} className={className}
          onClick= { (ev) => this.props.onSelectionChanged(value)}>{value}</li>);
  },
  render: function() {
    return (<ul className='radio'> 
      {this.props.values.map((value) => this.showItem(value, this.props.selected))} 
       </ul>);
    }
  });

var SprintNav = React.createClass({

  renderSprint: function(project, sprint) {
    return <li title='Open sprint' key={sprint}
                  onClick={(ev) => this.props.onSelectionChanged(project, sprint)}>{sprint}</li>;
  },
  renderProject: function(project, sprints) {
    var sprintList = [...sprints].map((sprint)=>this.renderSprint(project, sprint));

    return <li key={project} title='Open current sprint'> 
            <label>{project.replace('_sprints','')}</label>
              <ul>{[...sprintList]}</ul>
            </li>;

  },
  render: function() {

       var projectList = this.props.projects.map((project) => this.renderProject(project.project, project.sprints));

      return  <div className='sprintSelector'><ul>{[...projectList]}</ul></div>;
      }
    });


var DevTaskTile =  React.createClass({

  drag: function(ev) {
    ev.dataTransfer.setData("taskID", this.props.task.id);
  },

  render: function() {
    return (<div className='task' draggable='true' onDragStart= {this.drag}> 
      <label className='devTaskId'>{this.props.task.id}</label>
      <label className='taskTitle'>{this.props.task.title}
      <div className='description'>{this.props.task.description}</div></label>
      <img src={this.props.task.assignee + '.jpg'} className='assignee'></img>
      </div>
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
      return (<div className='taskphase' onDrop={this.drop}  onDragOver={this.allowDrop}> 
                <label className={'phaseTitle  tasklist-' + this.props.status}>{this.props.status}</label>
                <div className='tasklist' onDragOver={this.allowDrop} onDrop={this.drop}>
                	{taskTiles}
                </div>
                </div>
                );
        }
    });

var TaskBoard = React.createClass({
    render: function() {

      var divs = [];
      this.props.taskMap.forEach((tasks, status) => {
        divs.push(React.createElement(TaskList, {key: status, status: status, tasks: tasks, onStatusUpdated: (taskId, status) => this.props.onStatusUpdated(taskId, status)}))});
 
      return <div className='taskboard'>{divs}</div>;
    }
});

var AgileBoard = React.createClass({
    render: function() {

      var model = this.props.model;
      var controller = this.props.controller;

      var view = this.props.model.selectedView == 'TaskBoard' ? 
        <TaskBoard taskMap={model.taskMap} currentView={model.view} 
            onStatusUpdated={(taskId, status) => this.props.controller.updateStatus(taskId, status)}/> :
        <BurnDown cfd={model.cfd}/>;
 
      var nav = <nav className='mainNav'>
              <SprintNav projects={model.sprints} onSelectionChanged={(project,sprint) => this.props.controller.sprintSelectionChanged(project,sprint)}/>
              <SprintTitle project={model.selectedProject} sprint={model.selectedSprint}/>
              <RadioButton values={model.views} selected={model.selectedView} onSelectionChanged={(view) => this.props.controller.viewSelectionChanged(view)}/>
             </nav>;

      return <div>{nav}{view}</div>;
    }
});

var SprintTitle = React.createClass({
  render: function() {
    return (<table className = 'title'>
      <tbody> 
        <tr> 
          <td className= 'titleName'>Project:</td>
          <td className= 'titleValue'>{this.props.project.replace('_sprints','')}</td>
          <td className= 'titleName'>Sprint:</td> 
          <td className= 'titleValue'>{this.props.sprint}</td>
         </tr>
        </tbody>
      </table>);
  }
});

var BurndownLegend = React.createClass({
  render: function() {
    return (<div className='legend'>
      <label className='legendTitle'>Legend</label>
      <label className='tasklist-ToDo'>ToDo</label>
      <label className='tasklist-InProgress'>In Progress</label>
      <label className='tasklist-CodeReview'>Code Review</label>
      <label className='tasklist-Pushed'>Pushed</label>
      <label className='tasklist-Released'>Released</label>
      	</div>
      );
  }

});

var BurnDown = React.createClass({
  render: function() {
    return <div className='cfdContainer'>
              <div className='cfdChart'>
              	{[...this.props.cfd].map(this.createBar)}
    				<BurndownLegend />    			
    			</div>
    		</div>
    ;
  },

  createBar: function(cfdValues) {
    console.log(cfdValues);
    var date = new Date(cfdValues.date);
    var unitHeight = 20;
    return <div className='cfdBar' key={date.toString()}>
        <div className='tasklist-ToDo' key="ToDo" style={{height: cfdValues.ToDoCount*unitHeight}}/>
        <div className='tasklist-InProgress' key="InProgress" style={{height: cfdValues.InProgressCount*unitHeight}}/>
        <div className='tasklist-CodeReview' key="CodeReview" style={{height: cfdValues.CodeReviewCount*unitHeight}}/>
        <div className='tasklist-Pushed' key="Pushed" style={{height: cfdValues.PushedCount*unitHeight}}/>
        <div className='tasklist-Released' key="Released" style={{height: cfdValues.ReleasedCount*unitHeight}}/>
        <label className='cfdBarLabel'>{dayOfWeekAsInteger(date.getDay())}</label>
        </div>
    ;

  }
});




/*****************************************
/****            Data Model        *******
******************************************/

var sprintModel = {
    selectedView: 'TaskBoard',
    views: ['TaskBoard', 'Burndown'],
    selectedProject: 'ark_sprints',
    selectedSprint: '20160114',
    sprints: null,
    cfd: [],
    taskMap: []
};

var sprintController = {
  selectSprint: function(project, sprint) {
    sprintModel.selectedProject = project;
    sprintModel.selectedSprint = sprint;
    loadSprint(project, sprint);
  },

  updateStatus: function(taskId, newStatus) {
    updateTaskStatus(sprintModel.taskMap, taskId, newStatus);
    drawScreen();
  },
  sprintSelectionChanged: function(project, sprint) {
    sprintController.selectSprint(project, sprint);
    drawScreen();
  },
  viewSelectionChanged: function(selectedView) {
    sprintModel.selectedView = selectedView;
    drawScreen();
  }
};


function drawScreen() {
  var screen = React.createElement(AgileBoard, {model: sprintModel, controller: sprintController});
  ReactDOM.render(screen, document.getElementById('container'));
}

function loadSprint(project, sprint) {

  sprintModel.cfd = loadCFD(project, sprint);
    loadTasks(project, sprint, (taskMap) => 
  {    
    sprintModel.taskMap = taskMap;
    drawScreen();
  });

}
loadSprints((sprints) => {
  sprintModel.sprints = sprints;
  loadSprint(sprints[0].project, sprints[0].sprints[0]);
});

