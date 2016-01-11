function loadTasks(project, sprint) {
    var taskStatuses = ['ToDo', 'InProgress', 'CodeReview', 'Pushed', 'Released'];
    var tasksByStatus = new Map();
    taskStatuses.forEach(status => {
      var tasks = [];
      for (var i = 0; i < 10; i++) {
        tasks.push({id: project + '-' + status + '-'+100+i, status: status, title: 'Do this, do that', 
          description: 'Blah, Blah, Blah, Blah, Blah, Blah',
          assignee: 'gromit'}); 
      }
      tasksByStatus.set(status, tasks);
    });
    return tasksByStatus;
  }

function updateTaskStatus(tasksByStatus, taskId, newStatus) {
  for (var i = 0; i < tasksByStatus.size; i++) {

    var entries = [...tasksByStatus.entries()];
    var status = entries[i][0];
    var tasks = entries[i][1];
    for (var j = 0; j < tasks.length; j++) {
      var task = tasks[j];  
      if (task.id == taskId) {
        tasks.splice(tasks.indexOf(task), 1);
        tasksByStatus.get(newStatus).push(task);
        return;
      }
    }
  }
}


function loadSprints() {
  var map = new Map();
  map.set('Ark', ['2015-11-27','2015-12-04','2015-12-18']);
  map.set('Hydra', ['2015-11-27','2015-12-04','2015-12-18']);
  map.set('Pipeline', ['2015-11-27','2015-12-04','2015-12-18']);
  map.set('Graphics', ['2015-11-27','2015-12-04','2015-12-18']);
  return map;
}

function loadCumulativeFlowDiagram(project, sprint) {

  var map = new Map();
  var date = new Date();
  var i = 14;
  for (var j = 0; j < 14; j++) {
    var cfdDate = new Date(date);

    map.set(cfdDate, {
      todoCount: i,
      inProgressCount: 2,
      codeReviewCount: 2,
      pushedCount: 2,
      completeCount: j
    });

    date.setDate(date.getDate() + 1);
    i--;
  }

  return map;
}
