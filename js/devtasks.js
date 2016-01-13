function loadTasks(project, sprint, callback) {
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
    callback(tasksByStatus);
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


function loadSprints(callback) {
  var map = [
    {
      project: 'ark_sprints', 
      sprints: ['2015-11-27','2015-12-04','2015-12-18']
    },
  { project: 'hydra_sprints',
    sprints: ['2015-11-27','2015-12-04','2015-12-18']
  },
  { project: 'pipeline_sprints', sprints: ['2015-11-27','2015-12-04','2015-12-18']},
  { project:'graphics_sprints', sprints:['2015-11-27','2015-12-04','2015-12-18']}
];
  callback(map);
}

function loadTasksByDate(project, sprint) {

return [ {
  date: '2015-11-01',
  tasks: [
    {taskid: 12345, status: 'Complete'},
    {taskid: 12346, status: 'Complete'},
    {taskid: 12347, status: 'InProgress'},
    {taskid: 12348, status: 'Complete'},

  ]}];
}

function loadCFD(project, sprint) {
  var tasksByDate = loadTasksByDate(project, sprint);

  return tasksByDate.entries().map((key, value) => key, countByStatus(value));
}

function countByStatus(tasks) {
  var map = new Map();
  tasks.forEach(task => {
    if (map.has(task.status)) {
      map.set(task.status, map.get(task.status)+1);
    }
  });
  return [...map.entries().map((key, value) => {key, value})];
}
