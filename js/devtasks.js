function loadTasks(project, sprint, callback) {
    var taskStatuses = ['ToDo', 'InProgress', 'CodeReview', 'Pushed', 'Released'];
    var tasksByStatus = new Map();
    taskStatuses.forEach(status => {
      var tasks = [];
      for (var i = 0; i < 10; i++) {
        tasks.push({id: project + '-' + status + '-'+100+i, status: status, title: 'Do this, do that, do the other', 
          description: 'Blah, Blah, Blah, Blah, Blah, Blah',
          assignee: 'gromit',
          quote: 1.0,
          remaining: 1.0 - (i * 0.2),
          used: (i *0.2)}); 
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

return [ 
  {
    date: '2015-11-01',
    status: "ToDo",
    tasks: 5
  },
  {
    date: '2015-11-01',
    status: "InProgress",
    tasks: 0
  },
  {
    date: '2015-11-01',
    status: "CodeReview",
    tasks: 0
  },
  {
    date: '2015-11-01',
    status: "CodeReview",
    tasks: 0
  },

  {
    date: '2015-11-02',
    status: "ToDo",
    tasks: 4
  },
  {
    date: '2015-11-02',
    status: "InProgress",
    tasks: 1
  },
  {
    date: '2015-11-02',
    status: "CodeReview",
    tasks: 0
  },
  {
    date: '2015-11-02',
    status: "CodeReview",
    tasks: 0
  },

  {
    date: '2015-11-03',
    status: "ToDo",
    tasks: 2
  },
  {
    date: '2015-11-03',
    status: "InProgress",
    tasks: 1
  },
  {
    date: '2015-11-03',
    status: "CodeReview",
    tasks: 1
  },
  {
    date: '2015-11-03',
    status: "Code Review",
    tasks: 0
  },

  {
    date: '2015-11-04',
    status: "ToDo",
    tasks: 0
  },
  {
    date: '2015-11-04',
    status: "In Progress",
    tasks: 1
  },
  {
    date: '2015-11-04',
    status: "CodeReview",
    tasks: 1
  },
  {
    date: '2015-11-04',
    status: "Pushed",
    tasks: 1
  },
  {
    date: '2015-11-04',
    status: "Released",
    tasks: 3  
  }

  ];
}

function loadCFD(project, sprint) {
  var tasksByDate = loadTasksByDate(project, sprint);
  var currentDate = null;
  var cfd = [];
  var counters = null;

  for (var i = 0; i < tasksByDate.length; i++) {

    var taskCount = tasksByDate[i];
    if (taskCount.date != currentDate) {
      currentDate = taskCount.date;
      counters = {
          date: Date.parse(taskCount.date),
          ToDoCount: 0,
          InProgressCount: 0,
          CodeReviewCount: 0,
          PushedCount: 0,
          ReleasedCount:0
      };
      cfd.push(counters);
    }
    
      var taskStatus = convertStatus(taskCount.status);
      counters[taskStatus+'Count'] = counters[taskStatus+'Count'] + taskCount.tasks; 
    }
  

  return cfd;

}

function convertStatus(status) {
  return status;
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
